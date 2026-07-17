// populate-cgpa-scale-FULL-0.00-to-10.00.spec.js
//
// FULL RUN for the "CGPA" scale on staging.advisebridge.com:
//   GPA Score = CGPA (0.00 .. 10.00 — all 1,001 values)
//   GPA Total = equivalent U.S. 4.0 GPA  =  CGPA x 0.4, rounded to 2 decimals
//
// Identical logic to the TEST script that already passed — only the range,
// the timeout, and the progress logging changed.
//
// OVERNIGHT NOTES:
//  - ~990 new rows. Each Livewire round trip carries the whole form state,
//    so rows get slower as the repeater grows toward ~1,004 items.
//    Realistic total: roughly 2.5 - 4 hours. Timeout is set to 8 hours so an
//    overnight run can never die on the clock.
//  - Keep the laptop plugged in with sleep DISABLED, and keep the terminal
//    window open. The browser is headless — there is no window to close.
//  - Fully resumable: if anything interrupts it (sleep, crash, network),
//    just run the same command again — it continues from the last checkpoint
//    and can only ever need to redo at most ~10 rows.
//  - Checkpoint logs show progress (added/total), elapsed time, and a rough
//    ETA. The ETA lengthens as the form grows — that is expected.
//
// The mapping is computed with PURE INTEGER arithmetic (no floating point):
// for CGPA = k/100, GPA hundredths = floor((4k + 5) / 10). Because 4k mod 10
// can never equal 5, this equals standard rounding with no tie ambiguity —
// verified against float rounding for all 1,001 values of k.

const { test, expect } = require('@playwright/test');

// No visible browser window -> nothing to accidentally close mid-run.
test.use({ headless: true });

// ------------------------------ configuration ------------------------------
const BASE_URL     = 'https://staging.advisebridge.com';
const EMAIL        = 'admin@advisebridge.com';
const PASSWORD     = 'admin@advisebridge.com';
const TARGET_SCALE = 'CGPA';   // row text on /admin/gpas whose Edit we click
const START_CGPA   = 0.00;     // first CGPA to insert (existing ones are skipped)
const END_CGPA     = 10.00;    // last CGPA to insert (inclusive)
const SAVE_EVERY   = 10;       // checkpoint-save every N new rows (0 = single save at the end)
// ----------------------------------------------------------------------------

// --- integer-exact formatting and mapping (no floating point anywhere) ---
// k is "cents": CGPA 0.07 -> k=7, CGPA 10.00 -> k=1000.
const fmtCents = (k) => `${Math.floor(k / 100)}.${String(k % 100).padStart(2, '0')}`;
// GPA hundredths for CGPA k/100: round(0.4 * k) done as floor((4k + 5) / 10).
const gpaCentsFor = (k) => Math.floor((4 * k + 5) / 10);

// Expected totals for EVERY possible CGPA 0.00 .. 10.00 (used by the
// pre-flight and final verification).
const EXPECTED_BY_CGPA = {};
for (let k = 0; k <= 1000; k++) {
  EXPECTED_BY_CGPA[fmtCents(k)] = fmtCents(gpaCentsFor(k));
}

// The pairs this run will insert.
const CGPA_TO_GPA = [];
for (let k = Math.round(START_CGPA * 100); k <= Math.round(END_CGPA * 100); k++) {
  CGPA_TO_GPA.push([fmtCents(k), fmtCents(gpaCentsFor(k))]);
}

test.setTimeout(28_800_000); // 8 hours — overnight-proof ceiling

test(`Populate "${TARGET_SCALE}" scale: ${fmtCents(Math.round(START_CGPA * 100))} -> ${fmtCents(Math.round(END_CGPA * 100))} with U.S. 4.0 GPA totals`, async ({ page }) => {
  const startedAt = Date.now();
  const elapsedMin = () => ((Date.now() - startedAt) / 60000).toFixed(1);

  // Auto-accept browser dialogs (e.g. "unsaved changes" prompt).
  page.on('dialog', (dialog) => dialog.accept());

  // 1. Log in.
  await page.goto(`${BASE_URL}/admin/login`);
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 30_000 });

  // 2. Open the GPA list and follow the Edit action of the "CGPA" row.
  await page.goto(`${BASE_URL}/admin/gpas`);
  const row = page.locator('tr', { hasText: TARGET_SCALE }).first();
  await expect(row, `Row "${TARGET_SCALE}" not found on /admin/gpas`).toBeVisible({ timeout: 20_000 });

  const editHref = await row.getByRole('link', { name: 'Edit' }).getAttribute('href');
  const editUrl = new URL(editHref, BASE_URL).toString();
  console.log(`[nav] Editing "${TARGET_SCALE}" -> ${editUrl}`);
  await page.goto(editUrl);

  const scoreInputs = page.locator('input[id$="gpa_score"]');
  const totalInputs = page.locator('input[id$="gpa_total"]');
  await scoreInputs.first().waitFor({ state: 'visible', timeout: 30_000 });

  // 3. One-shot scan of what is already on the form (scores AND totals).
  const initialScores = await scoreInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  const initialTotals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  let count = initialScores.length;

  const existing = new Set();
  const emptyRows = [];
  const preflightProblems = [];

  initialScores.forEach((s, i) => {
    if (s === '') {
      emptyRows.push(i);
      return;
    }
    const cgpaKey = parseFloat(s).toFixed(2);
    existing.add(cgpaKey);

    // PRE-FLIGHT: every already-entered CGPA must match the x0.4 mapping.
    const expectedGpa = EXPECTED_BY_CGPA[cgpaKey];
    if (expectedGpa !== undefined) {
      const t = (initialTotals[i] ?? '').trim();
      const actualGpa = t === '' ? '(empty)' : parseFloat(t).toFixed(2);
      if (actualGpa !== expectedGpa) {
        preflightProblems.push(`row ${i + 1}: CGPA ${s} has total ${actualGpa}, but CGPA x 0.4 (2 dp) = ${expectedGpa}`);
      }
    } else {
      console.log(`[preflight] row ${i + 1} has score "${s}" outside 0.00-10.00 — ignored.`);
    }
  });

  if (preflightProblems.length > 0) {
    throw new Error(
      'ABORTED BEFORE MAKING ANY CHANGES — the rows already entered do not match ' +
      'the CGPA x 0.4 (U.S. 4.0 GPA, 2 decimals) mapping:\n  - ' +
      preflightProblems.join('\n  - ') +
      '\nNothing was modified.',
    );
  }
  console.log(`[preflight] all ${existing.size} existing CGPA value(s) match the mapping ✓`);

  const plannedNew = CGPA_TO_GPA.filter(([c]) => !existing.has(c)).length;
  const firstMissing = CGPA_TO_GPA.find(([c]) => !existing.has(c));
  console.log(`[scan] ${count} existing rows, ${existing.size} CGPA value(s) already saved.`);
  console.log(`[scan] ${plannedNew} value(s) left to insert.${firstMissing ? ` Starting from CGPA ${firstMissing[0]}.` : ''}`);
  if (emptyRows.length) console.log(`[scan] ${emptyRows.length} empty row(s) found — they will be reused first.`);

  const addMoreButton = page.getByRole('button', { name: 'Add More' });

  // --- helper: click "Save changes" and confirm it actually saved ---
  async function saveChanges(label) {
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await saveButton.scrollIntoViewIfNeeded();

    const livewireDone = page.waitForResponse(
      (r) => r.url().includes('/livewire/') && r.request().method() === 'POST' && r.status() === 200,
      { timeout: 180_000 }, // saving ~1,000 rows can take a while on staging
    );
    await saveButton.click();
    await livewireDone;

    try {
      await page.getByText('Saved', { exact: true }).first().waitFor({ state: 'visible', timeout: 15_000 });
      console.log(`[saved] ${label}`);
    } catch {
      const hasValidationError = await page.getByText(/required/i).first().isVisible().catch(() => false);
      if (hasValidationError) {
        throw new Error(`Save FAILED at "${label}": a validation error is visible (an empty GPA Score/Total field blocks the save).`);
      }
      console.log(`[saved?] ${label} — no "Saved" toast detected, continuing anyway.`);
    }

    await page.waitForTimeout(800);
    count = await scoreInputs.count();
  }

  // --- helper: fill one row (score = CGPA, total = GPA) and verify ---
  async function fillRow(index, scoreValue, totalValue) {
    const score = scoreInputs.nth(index);
    const total = totalInputs.nth(index);

    await score.scrollIntoViewIfNeeded();
    await score.fill(scoreValue);
    await total.fill(totalValue);

    for (const [input, name, value] of [[score, 'score', scoreValue], [total, 'total', totalValue]]) {
      if ((await input.inputValue()) !== value) {
        console.log(`[retry] ${name} for CGPA ${scoreValue} did not stick — re-typing slowly`);
        await input.click();
        await input.clear();
        await input.pressSequentially(value, { delay: 40 });
        await input.dispatchEvent('blur');
        expect(await input.inputValue(), `Could not set ${name} to ${value}`).toBe(value);
      }
    }
  }

  // 4. Main loop over all 1,001 pairs.
  let added = 0;
  let unsaved = 0;
  console.log(`--- Target: CGPA ${CGPA_TO_GPA[0][0]} -> ${CGPA_TO_GPA[CGPA_TO_GPA.length - 1][0]} (${CGPA_TO_GPA.length} pairs, existing ones skipped) ---`);

  for (const [cgpa, gpa] of CGPA_TO_GPA) {
    if (existing.has(cgpa)) {
      continue; // already saved — silent skip to keep the overnight log readable
    }

    let rowIndex;
    if (emptyRows.length > 0) {
      rowIndex = emptyRows.shift();
      console.log(`[reuse] empty row ${rowIndex + 1} -> ${cgpa} / ${gpa}`);
    } else {
      await addMoreButton.scrollIntoViewIfNeeded();
      await addMoreButton.click();
      await expect(scoreInputs, 'New repeater row did not appear after "Add More"').toHaveCount(count + 1, { timeout: 60_000 });
      count += 1;
      rowIndex = count - 1;
    }

    await fillRow(rowIndex, cgpa, gpa);
    existing.add(cgpa);
    added += 1;
    unsaved += 1;
    console.log(`[ok] row ${rowIndex + 1}: CGPA ${cgpa} -> ${gpa}`);

    if (SAVE_EVERY > 0 && unsaved >= SAVE_EVERY) {
      const paceMs = (Date.now() - startedAt) / added;
      const etaMin = Math.round((paceMs * (plannedNew - added)) / 60000);
      await saveChanges(
        `checkpoint after CGPA ${cgpa} — progress ${added}/${plannedNew}, elapsed ${elapsedMin()} min, ` +
        `rough ETA ~${etaMin} min (lengthens as the form grows)`,
      );
      unsaved = 0;
    }
  }

  // 5. Final save (covers everything since the last checkpoint).
  if (unsaved > 0) {
    await saveChanges('final save');
  } else if (added === 0) {
    console.log('[done] Nothing to add — every CGPA already exists.');
  }

  // 6. Verify persistence: load the edit page FRESH (retried goto — immune to
  //    the "frame was detached" failure), then confirm every CGPA survived
  //    AND every total matches the mapping.
  let reloaded = false;
  for (let attempt = 1; attempt <= 3 && !reloaded; attempt++) {
    try {
      await page.goto(editUrl, { waitUntil: 'domcontentloaded' });
      reloaded = true;
    } catch (e) {
      if (page.isClosed()) {
        throw new Error(
          'Browser tab was closed during verification. All data up to the last "[saved]" log line ' +
          'is safely stored — re-run this test to finish the verification.',
        );
      }
      console.log(`[verify] page load attempt ${attempt} failed — retrying in 2s`);
      await page.waitForTimeout(2_000);
    }
  }
  if (!reloaded) throw new Error('Could not reload the edit page for verification after 3 attempts.');

  await scoreInputs.first().waitFor({ state: 'visible', timeout: 120_000 });
  await page.waitForTimeout(2_000); // ~1,000 rows take a moment to render

  const finalScores = await scoreInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  const finalTotals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));

  const persisted = new Set();
  const mismatched = [];
  finalScores.forEach((s, i) => {
    if (s === '') return;
    const cgpaKey = parseFloat(s).toFixed(2);
    persisted.add(cgpaKey);

    const expectedGpa = EXPECTED_BY_CGPA[cgpaKey];
    if (expectedGpa !== undefined) {
      const t = (finalTotals[i] ?? '').trim();
      const actualGpa = t === '' ? '(empty)' : parseFloat(t).toFixed(2);
      if (actualGpa !== expectedGpa) {
        mismatched.push(`row ${i + 1}: CGPA ${s} has total ${actualGpa}, expected ${expectedGpa}`);
      }
    }
  });

  expect(mismatched, `GPA Total does not match CGPA x 0.4 on: ${mismatched.join('; ')}`).toHaveLength(0);

  const missing = CGPA_TO_GPA
    .filter(([c]) => !persisted.has(c))
    .map(([c]) => c);
  expect(missing, `CGPAs missing on the server after save: ${missing.join(', ')}`).toHaveLength(0);

  console.log(`--- DONE in ${elapsedMin()} min. Added ${added} new row(s). All ${CGPA_TO_GPA.length} CGPA->GPA pairs (0.00 -> 10.00) verified on the server. ---`);
});