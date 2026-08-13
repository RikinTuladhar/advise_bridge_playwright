// populate-letter-grade-scale-F-to-Aplus.spec.js
//
// Full run for the "Letter Grade" scale on staging.advisebridge.com:
//   GPA Score = U.S. letter grade (F, D-, D, D+, C, C+, B-, B, B+, A-, A, A+)
//   GPA Total = the GPA value, 0.00 .. 4.00 in 0.01 steps (401 rows)
//
// Grade bands (verified contiguous with no gaps/overlaps, and consistent with
// all 101 rows of GPA_Comparison.xlsx):
//   F  0.00-1.59   D- 1.60-1.71   D  1.72-1.87   D+ 1.88-1.99
//   C  2.00-2.39   C+ 2.40-2.67   B- 2.68-2.91   B  2.92-3.31
//   B+ 3.32-3.59   A- 3.60-3.71   A  3.72-3.87   A+ 3.88-4.00
//
// KEY DIFFERENCE from the other scales: letters repeat (160 rows say "F"),
// so the UNIQUE KEY here is the GPA TOTAL, not the score. All duplicate
// detection, resume logic, empty-row pickup and verification are keyed on
// the total. The row that already exists (F / 0.00) is detected and skipped;
// the run starts at F / 0.01.
//
// Same self-healing architecture as the CGPA v2 script:
// retrying "Add More", dynamic empty-row pickup, unexpected-refresh recovery,
// save retries, checkpoint every 10 rows, fully resumable, headless.

const { test, expect } = require('@playwright/test');

// No visible browser window -> nothing to accidentally close mid-run.
test.use({ headless: true });

// ------------------------------ configuration ------------------------------
const BASE_URL     = 'https://staging.advisebridge.com';
const EMAIL        = 'admin@advisebridge.com';
const PASSWORD     = 'admin@advisebridge.com';
const TARGET_SCALE = 'Letter Grade'; // substring of the row text on /admin/gpas
const SAVE_EVERY   = 10;             // checkpoint-save every N new rows
// ----------------------------------------------------------------------------

// --- grade bands in GPA "cents" (integer-exact, no floating point) ---
const GRADE_BANDS = [
  ['F', 0, 159], ['D-', 160, 171], ['D', 172, 187], ['D+', 188, 199],
  ['C', 200, 239], ['C+', 240, 267], ['B-', 268, 291], ['B', 292, 331],
  ['B+', 332, 359], ['A-', 360, 371], ['A', 372, 387], ['A+', 388, 400],
];

// Self-check: bands must cover 0..400 exactly once. Aborts before the browser
// even opens if the table above is ever edited into an inconsistent state.
{
  let pos = 0;
  for (const [letter, start, end] of GRADE_BANDS) {
    if (start !== pos || end < start) throw new Error(`GRADE_BANDS broken at "${letter}": expected start ${pos}, got ${start}-${end}`);
    pos = end + 1;
  }
  if (pos !== 401) throw new Error(`GRADE_BANDS must end at 4.00 (401 cents), ends at ${pos}`);
}

const fmtCents = (k) => `${Math.floor(k / 100)}.${String(k % 100).padStart(2, '0')}`;

// letter for a given total (in cents)
const letterForCents = (k) => GRADE_BANDS.find(([, a, b]) => k >= a && k <= b)?.[0];

// Expected letter for EVERY possible total 0.00 .. 4.00 (keyed on the total).
const EXPECTED_LETTER_BY_TOTAL = {};
for (let k = 0; k <= 400; k++) {
  EXPECTED_LETTER_BY_TOTAL[fmtCents(k)] = letterForCents(k);
}

// The 401 pairs to insert: [letter, total]
const PAIRS = [];
for (let k = 0; k <= 400; k++) {
  PAIRS.push([letterForCents(k), fmtCents(k)]);
}

test.setTimeout(28_800_000); // 8 hours — far more than needed, but crash-proof

test(`Populate "${TARGET_SCALE}" scale: F/0.00 -> A+/4.00 (401 rows)`, async ({ page }) => {
  const startedAt = Date.now();
  const elapsedMin = () => ((Date.now() - startedAt) / 60000).toFixed(1);

  page.on('dialog', (dialog) => dialog.accept());

  // 1. Log in.
  await page.goto(`${BASE_URL}/admin/login`);
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 30_000 });

  // 2. Open the GPA list and follow the Edit action of the Letter Grade row.
  await page.goto(`${BASE_URL}/admin/gpas`);
  const row = page.locator('tr', { hasText: TARGET_SCALE }).first();
  await expect(row, `Row containing "${TARGET_SCALE}" not found on /admin/gpas`).toBeVisible({ timeout: 20_000 });

  const editHref = await row.getByRole('link', { name: 'Edit' }).getAttribute('href');
  const editUrl = new URL(editHref, BASE_URL).toString();
  console.log(`[nav] Editing "${TARGET_SCALE}" -> ${editUrl}`);
  await page.goto(editUrl);

  const scoreInputs = page.locator('input[id$="gpa_score"]');
  const totalInputs = page.locator('input[id$="gpa_total"]');
  await scoreInputs.first().waitFor({ state: 'visible', timeout: 30_000 });

  // 3. One-shot scan + pre-flight — keyed on TOTALS.
  const initialScores = await scoreInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  const initialTotals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  let count = initialTotals.length;

  const existing = new Set(); // totals already present, normalised "x.xx"
  let initialEmpties = 0;
  const preflightProblems = [];

  initialTotals.forEach((t, i) => {
    if (t === '') {
      initialEmpties += 1; // reusable row (score may or may not hold text)
      return;
    }
    const totalKey = parseFloat(t).toFixed(2);
    existing.add(totalKey);

    const expectedLetter = EXPECTED_LETTER_BY_TOTAL[totalKey];
    if (expectedLetter !== undefined) {
      const s = (initialScores[i] ?? '').trim();
      if (s !== expectedLetter) {
        preflightProblems.push(`row ${i + 1}: total ${t} has score "${s || '(empty)'}", but the band table says "${expectedLetter}"`);
      }
    } else {
      console.log(`[preflight] row ${i + 1} has total "${t}" outside 0.00-4.00 — ignored.`);
    }
  });

  if (preflightProblems.length > 0) {
    throw new Error(
      'ABORTED BEFORE MAKING ANY CHANGES — existing rows do not match the grade band table:\n  - ' +
      preflightProblems.join('\n  - ') +
      '\nNothing was modified.',
    );
  }
  console.log(`[preflight] all ${existing.size} existing row(s) match the band table ✓`);

  const plannedNew = PAIRS.filter(([, t]) => !existing.has(t)).length;
  const firstMissing = PAIRS.find(([, t]) => !existing.has(t));
  console.log(`[scan] ${count} existing rows, ${existing.size} total(s) already saved.`);
  console.log(`[scan] ${plannedNew} row(s) left to insert.${firstMissing ? ` Starting from ${firstMissing[0]} / ${firstMissing[1]}.` : ''}`);
  if (initialEmpties) console.log(`[scan] ${initialEmpties} empty row(s) found — they will be filled first.`);

  const addMoreButton = page.getByRole('button', { name: 'Add More' });

  // Detect unexpected page reloads so unsaved work is re-planned, not lost.
  let unexpectedNav = false;
  const navListener = (frame) => {
    if (frame === page.mainFrame()) unexpectedNav = true;
  };
  page.on('framenavigated', navListener);

  // --- helper: click "Save changes" (2 attempts) and confirm it saved ---
  async function saveChanges(label) {
    const saveButton = page.getByRole('button', { name: 'Save changes' });

    let responded = false;
    for (let attempt = 1; attempt <= 2 && !responded; attempt++) {
      const livewireDone = page.waitForResponse(
        (r) => r.url().includes('/livewire/') && r.request().method() === 'POST' && r.status() === 200,
        { timeout: 180_000 },
      );
      livewireDone.catch(() => {}); // mark handled in case the click itself throws
      try {
        await saveButton.scrollIntoViewIfNeeded();
        await saveButton.click();
        await livewireDone;
        responded = true;
      } catch (e) {
        if (attempt === 2) {
          throw new Error(`Save FAILED twice at "${label}". Everything up to the previous "[saved]" line is stored — re-run to resume.`);
        }
        console.log(`[retry-save] attempt ${attempt} at "${label}" got no response — retrying in 5s`);
        await page.waitForTimeout(5_000);
      }
    }

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
    count = await totalInputs.count();
  }

  // --- helper: return the index of a row ready to fill (empty TOTAL),
  //     creating one if needed, with retries for dropped round trips ---
  async function acquireRow(forLabel) {
    for (let attempt = 1; attempt <= 4; attempt++) {
      const totals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
      count = totals.length;
      const emptyIdx = totals.findIndex((v) => v === '');
      if (emptyIdx !== -1) {
        if (attempt > 1) console.log(`[recover] previous add landed late — using row ${emptyIdx + 1}`);
        return emptyIdx;
      }

      try {
        await addMoreButton.scrollIntoViewIfNeeded();
        await addMoreButton.click();
        await page.waitForFunction(
          (n) => document.querySelectorAll('input[id$="gpa_total"]').length > n,
          totals.length,
          { timeout: 45_000 },
        );
        count = await totalInputs.count();
        return count - 1;
      } catch (e) {
        console.log(`[retry-add] attempt ${attempt} for ${forLabel}: no new row within 45s — re-checking form and retrying`);
        await page.waitForTimeout(3_000);
      }
    }
    throw new Error(
      `"Add More" produced no new row after 4 attempts (while adding ${forLabel}). ` +
      'Everything up to the last "[saved]" line is stored — re-run this test to resume from there.',
    );
  }

  // --- helper: fill one row (score = letter, total = GPA) and verify ---
  async function fillRow(index, letter, totalValue) {
    const score = scoreInputs.nth(index);
    const total = totalInputs.nth(index);

    await score.scrollIntoViewIfNeeded();
    await score.fill(letter);
    await total.fill(totalValue);

    for (const [input, name, value] of [[score, 'score', letter], [total, 'total', totalValue]]) {
      if ((await input.inputValue()) !== value) {
        console.log(`[retry] ${name} for ${letter}/${totalValue} did not stick — re-typing slowly`);
        await input.click();
        await input.clear();
        await input.pressSequentially(value, { delay: 40 });
        await input.dispatchEvent('blur');
        expect(await input.inputValue(), `Could not set ${name} to ${value}`).toBe(value);
      }
    }
  }

  // 4. Main loop — live queue keyed on totals.
  let pending = PAIRS.filter(([, t]) => !existing.has(t));
  let added = 0;
  let unsaved = 0;
  console.log(`--- Target: F/0.00 -> A+/4.00 (${PAIRS.length} rows, existing ones skipped) ---`);

  while (pending.length > 0) {
    if (unexpectedNav) {
      unexpectedNav = false;
      console.log('[recover] the page reloaded unexpectedly — re-syncing with the saved form state');
      await totalInputs.first().waitFor({ state: 'visible', timeout: 60_000 });
      const totals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
      count = totals.length;
      existing.clear();
      totals.forEach((t) => { if (t !== '') existing.add(parseFloat(t).toFixed(2)); });
      pending = PAIRS.filter(([, t]) => !existing.has(t));
      added = plannedNew - pending.length;
      unsaved = 0;
      console.log(`[recover] ${pending.length} row(s) still to insert — continuing from ${pending.length ? `${pending[0][0]} / ${pending[0][1]}` : '(none)'}`);
      continue;
    }

    const [letter, totalValue] = pending[0];
    const rowIndex = await acquireRow(`${letter} / ${totalValue}`);
    await fillRow(rowIndex, letter, totalValue);
    existing.add(totalValue);
    pending.shift();
    added += 1;
    unsaved += 1;
    console.log(`[ok] row ${rowIndex + 1}: ${letter} / ${totalValue}`);

    if (SAVE_EVERY > 0 && unsaved >= SAVE_EVERY) {
      const paceMs = (Date.now() - startedAt) / Math.max(added, 1);
      const etaMin = Math.round((paceMs * pending.length) / 60000);
      await saveChanges(
        `checkpoint after ${letter} / ${totalValue} — progress ${added}/${plannedNew}, elapsed ${elapsedMin()} min, ` +
        `rough ETA ~${etaMin} min (lengthens as the form grows)`,
      );
      unsaved = 0;
    }
  }

  // 5. Final save (covers everything since the last checkpoint).
  if (unsaved > 0) {
    await saveChanges('final save');
  } else if (added === 0) {
    console.log('[done] Nothing to add — every total already exists.');
  }

  // 6. Verify persistence against a fresh page load.
  page.off('framenavigated', navListener); // the next navigation is intentional

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

  await totalInputs.first().waitFor({ state: 'visible', timeout: 120_000 });
  await page.waitForTimeout(2_000);

  const finalScores = await scoreInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  const finalTotals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));

  const persisted = new Set();
  const mismatched = [];
  finalTotals.forEach((t, i) => {
    if (t === '') return;
    const totalKey = parseFloat(t).toFixed(2);
    persisted.add(totalKey);

    const expectedLetter = EXPECTED_LETTER_BY_TOTAL[totalKey];
    if (expectedLetter !== undefined) {
      const s = (finalScores[i] ?? '').trim();
      if (s !== expectedLetter) {
        mismatched.push(`row ${i + 1}: total ${t} has score "${s || '(empty)'}", expected "${expectedLetter}"`);
      }
    }
  });

  expect(mismatched, `Letter grade does not match the band table on: ${mismatched.join('; ')}`).toHaveLength(0);

  const missing = PAIRS
    .filter(([, t]) => !persisted.has(t))
    .map(([l, t]) => `${l}/${t}`);
  expect(missing, `Rows missing on the server after save: ${missing.join(', ')}`).toHaveLength(0);

  console.log(`--- DONE in ${elapsedMin()} min. Added ${added} new row(s). All ${PAIRS.length} letter-grade rows (F/0.00 -> A+/4.00) verified on the server. ---`);
});