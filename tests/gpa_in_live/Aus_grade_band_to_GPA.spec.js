// populate-australia-grade-band-scale.spec.js
//
// Full run for the "Grade Band (HD-F) — Australia" scale:
//   GPA Score = Australian grade band label (repeats within its band)
//   GPA Total = U.S. 4.0 GPA, 0.00 .. 4.00 in 0.01 steps (401 rows)
//
// Bands (verified contiguous and consistent with ALL 101 rows of
// GPA_Comparison.xlsx, boundaries exactly as you specified). Labels use the
// SHORT codes, matching the "N/F" entered in the existing 0.00 row:
//   N/F   0.00 - 1.96   (197 rows)   = Fail
//   P     1.97 - 2.56   ( 60 rows)   = Pass
//   CR    2.57 - 2.96   ( 40 rows)   = Credit
//   D     2.97 - 3.36   ( 40 rows)   = Distinction
//   HD    3.37 - 4.00   ( 64 rows)   = High Distinction
//
// If you ever prefer the long sheet strings ("N/F - Fail", ...) instead,
// edit GRADE_LABELS below AND the existing rows to match — the pre-flight
// enforces consistency either way.
//
// Like the Letter Grade scale, labels repeat, so the UNIQUE KEY is the GPA
// TOTAL: all duplicate detection, resume, empty-row pickup and verification
// are keyed on the total. The existing N/F / 0.00 row is detected and
// skipped; the run starts at 0.01.
//
// Uses the FAST engine (batched Livewire adds, 25 per commit) with full
// automatic fallback to the proven one-click path — worst case it behaves
// exactly like the Letter Grade run that passed. Saves are checkpointed
// every 25 rows and only ever fire with zero outstanding adds, so an empty
// row can never be present at save time.
//
// EXTRA SAFETY: this scale's scores must be TEXT labels, so the pre-flight
// aborts if any existing score is numeric — protecting you from ever
// running this against a numeric scale by accident.

const { test, expect } = require('@playwright/test');

// Headless + all recording off.
test.use({ headless: true, video: 'off', trace: 'off', screenshot: 'off' });

// ------------------------------ configuration ------------------------------
const BASE_URL     = 'https://staging.advisebridge.com';
const EMAIL        = 'admin@advisebridge.com';
const PASSWORD     = 'admin@advisebridge.com';
const TARGET_SCALE = 'Grade Band'; // substring of the row text on /admin/gpas
                                   // (deliberately NOT "Australia" — that now
                                   // matches TWO scales in your admin)
const BATCH_ADD    = 25;           // add-actions fired per Livewire commit
const SAVE_EVERY   = 25;           // checkpoint-save every N filled rows

// Short codes, matching the "N/F" you entered in the existing 0.00 row
// (and the short-code style of your Letter Grade scale). Edit here if you
// ever change the convention (the pre-flight will tell you on mismatch).
const GRADE_LABELS = {
  NF: 'N/F',
  P:  'P',
  CR: 'CR',
  D:  'D',
  HD: 'HD',
};
// ----------------------------------------------------------------------------

// --- bands in GPA cents ---
const GRADE_BANDS = [
  [GRADE_LABELS.NF, 0, 196],
  [GRADE_LABELS.P, 197, 256],
  [GRADE_LABELS.CR, 257, 296],
  [GRADE_LABELS.D, 297, 336],
  [GRADE_LABELS.HD, 337, 400],
];

// Self-check: bands must cover 0..400 exactly once.
{
  let pos = 0;
  for (const [label, start, end] of GRADE_BANDS) {
    if (start !== pos || end < start) throw new Error(`GRADE_BANDS broken at "${label}": expected start ${pos}, got ${start}-${end}`);
    pos = end + 1;
  }
  if (pos !== 401) throw new Error(`GRADE_BANDS must end at 4.00 (401 cents), ends at ${pos}`);
}

const fmtCents = (k) => `${Math.floor(k / 100)}.${String(k % 100).padStart(2, '0')}`;
const labelForCents = (k) => GRADE_BANDS.find(([, a, b]) => k >= a && k <= b)?.[0];

const EXPECTED_LABEL_BY_TOTAL = {};
for (let k = 0; k <= 400; k++) EXPECTED_LABEL_BY_TOTAL[fmtCents(k)] = labelForCents(k);

// The 401 pairs to insert: [label, total]
const PAIRS = [];
for (let k = 0; k <= 400; k++) PAIRS.push([labelForCents(k), fmtCents(k)]);

test.setTimeout(28_800_000); // 8 hours — covers even the full-fallback case

test(`FAST populate "${TARGET_SCALE}" scale: N/F 0.00 -> HD 4.00 (401 rows)`, async ({ page }) => {
  const startedAt = Date.now();
  const elapsedMin = () => ((Date.now() - startedAt) / 60000).toFixed(1);

  page.on('dialog', (dialog) => dialog.accept());

  // 1. Log in.
  await page.goto(`${BASE_URL}/admin/login`);
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 30_000 });

  // 2. Open the GPA list and follow the Edit action of the Grade Band row.
  await page.goto(`${BASE_URL}/admin/gpas`);
  const row = page.locator('tr', { hasText: TARGET_SCALE }).first();
  await expect(
    row,
    `Row containing "${TARGET_SCALE}" not found on /admin/gpas — change TARGET_SCALE to match part of the scale name.`,
  ).toBeVisible({ timeout: 20_000 });

  const editHref = await row.getByRole('link', { name: 'Edit' }).getAttribute('href');
  const editUrl = new URL(editHref, BASE_URL).toString();
  console.log(`[nav] Editing "${TARGET_SCALE}" -> ${editUrl}`);
  await page.goto(editUrl);

  const scoreInputs = page.locator('input[id$="gpa_score"]');
  const totalInputs = page.locator('input[id$="gpa_total"]');
  const addMoreButton = page.getByRole('button', { name: 'Add More' });
  await expect(addMoreButton, 'GPA Scores form did not load').toBeVisible({ timeout: 30_000 });

  // 3. One-shot scan + pre-flight (keyed on TOTALS).
  const initialScores = await scoreInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  const initialTotals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  let count = initialTotals.length;

  const existing = new Set();
  const preflightProblems = [];

  initialTotals.forEach((t, i) => {
    if (t === '') return; // reusable empty row
    const totalKey = parseFloat(t).toFixed(2);
    existing.add(totalKey);

    const s = (initialScores[i] ?? '').trim();
    // Numeric-score guard: on THIS scale, scores must be text labels.
    if (s !== '' && Number.isFinite(parseFloat(s)) && /^[\d.]+$/.test(s)) {
      preflightProblems.push(`row ${i + 1}: score "${s}" is numeric — this looks like the WRONG SCALE (did the row match another Australia scale?)`);
      return;
    }

    const expectedLabel = EXPECTED_LABEL_BY_TOTAL[totalKey];
    if (expectedLabel !== undefined) {
      if (s !== expectedLabel) {
        preflightProblems.push(`row ${i + 1}: total ${t} has score "${s || '(empty)'}", but the band table says "${expectedLabel}"`);
      }
    } else {
      console.log(`[preflight] row ${i + 1} has total "${t}" outside 0.00-4.00 — ignored.`);
    }
  });

  if (preflightProblems.length > 0) {
    throw new Error(
      'ABORTED BEFORE MAKING ANY CHANGES:\n  - ' + preflightProblems.join('\n  - ') +
      '\nIf your existing row simply uses different label text, edit GRADE_LABELS at the top of this file to match and re-run. Nothing was modified.',
    );
  }
  console.log(`[preflight] ${existing.size} existing row(s) match the band table ✓`);

  const plannedNew = PAIRS.filter(([, t]) => !existing.has(t)).length;
  console.log(`[scan] ${count} existing rows. ${plannedNew} row(s) left to insert.`);

  // ---------------- pipeline state ----------------
  let pending = PAIRS.filter(([, t]) => !existing.has(t));
  let added = 0;
  let unsaved = 0;
  let batchSupported = BATCH_ADD > 1;
  let batchProducedRows = false;
  let inflightAdds = 0;          // INVARIANT: inflightAdds <= pending.length
  let lastKnownCount = count;

  let unexpectedNav = false;
  const navListener = (frame) => { if (frame === page.mainFrame()) unexpectedNav = true; };
  page.on('framenavigated', navListener);

  async function scanForm() {
    const totals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
    count = totals.length;
    const arrived = Math.max(0, count - lastKnownCount);
    if (arrived > 0 && inflightAdds > 0) batchProducedRows = true;
    inflightAdds = Math.max(0, inflightAdds - arrived);
    lastKnownCount = count;
    return totals;
  }

  async function fillRow(index, label, totalValue) {
    const score = scoreInputs.nth(index);
    const total = totalInputs.nth(index);
    await score.fill(label);
    await total.fill(totalValue);
    for (const [input, name, value] of [[score, 'score', label], [total, 'total', totalValue]]) {
      if ((await input.inputValue()) !== value) {
        console.log(`[retry] ${name} for ${label}/${totalValue} did not stick — re-typing slowly`);
        await input.click();
        await input.clear();
        await input.pressSequentially(value, { delay: 40 });
        await input.dispatchEvent('blur');
        expect(await input.inputValue(), `Could not set ${name} to ${value}`).toBe(value);
      }
    }
  }

  async function fillEmpties(totals) {
    let filled = 0;
    for (let i = 0; i < totals.length && pending.length > 0; i++) {
      if (totals[i] !== '') continue;
      const [label, totalValue] = pending[0];
      await fillRow(i, label, totalValue);
      existing.add(totalValue);
      pending.shift();
      added += 1; unsaved += 1; filled += 1;
      console.log(`[ok] row ${i + 1}: ${label} / ${totalValue}`);
    }
    return filled;
  }

  async function drainInflight() {
    while (inflightAdds > 0) {
      try {
        await page.waitForFunction(
          (n) => document.querySelectorAll('input[id$="gpa_total"]').length > n,
          lastKnownCount,
          { timeout: 120_000 },
        );
      } catch {
        console.log(`[fast-add] ${inflightAdds} outstanding add(s) stalled — treating as lost, will re-request`);
        inflightAdds = 0;
        break;
      }
      const totals = await scanForm();
      await fillEmpties(totals);
    }
  }

  async function clickAddOnce(forLabel) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const before = await totalInputs.count();
      try {
        await addMoreButton.scrollIntoViewIfNeeded();
        await addMoreButton.click();
        await page.waitForFunction(
          (n) => document.querySelectorAll('input[id$="gpa_total"]').length > n,
          before,
          { timeout: 120_000 },
        );
        count = await totalInputs.count();
        lastKnownCount = count;
        return;
      } catch {
        console.log(`[retry-add] attempt ${attempt} for ${forLabel}: no new row within 120s — retrying`);
        await page.waitForTimeout(3_000);
        const now = await totalInputs.count();
        if (now > before) { count = now; lastKnownCount = now; return; }
      }
    }
    throw new Error(
      `"Add More" produced no new row after 3 attempts (while adding ${forLabel}). ` +
      'Everything up to the last "[saved]" line is stored — re-run to resume.',
    );
  }

  async function saveChanges(label) {
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    let responded = false;
    for (let attempt = 1; attempt <= 2 && !responded; attempt++) {
      const livewireDone = page.waitForResponse(
        (r) => r.url().includes('/livewire/') && r.request().method() === 'POST' && r.status() === 200,
        { timeout: 180_000 },
      );
      livewireDone.catch(() => {});
      try {
        await saveButton.scrollIntoViewIfNeeded();
        await saveButton.click();
        await livewireDone;
        responded = true;
      } catch (e) {
        if (attempt === 2) throw new Error(`Save FAILED twice at "${label}". Everything up to the previous "[saved]" line is stored — re-run to resume.`);
        console.log(`[retry-save] attempt ${attempt} at "${label}" got no response — retrying in 5s`);
        await page.waitForTimeout(5_000);
      }
    }
    try {
      await page.getByText('Saved', { exact: true }).first().waitFor({ state: 'visible', timeout: 20_000 });
      console.log(`[saved] ${label}`);
    } catch {
      const hasValidationError = await page.getByText(/required/i).first().isVisible().catch(() => false);
      if (hasValidationError) throw new Error(`Save FAILED at "${label}": a validation error is visible.`);
      console.log(`[saved?] ${label} — no "Saved" toast detected, continuing anyway.`);
    }
    await page.waitForTimeout(300);
    count = await totalInputs.count();
    lastKnownCount = count;
  }

  // 4. Main pipeline.
  console.log(`--- Target: N/F 0.00 -> HD 4.00 (${PAIRS.length} rows, existing ones skipped) | batch size ${BATCH_ADD} ---`);

  while (pending.length > 0) {
    if (unexpectedNav) {
      unexpectedNav = false;
      console.log('[recover] the page reloaded unexpectedly — re-syncing with the saved form state');
      await addMoreButton.waitFor({ state: 'visible', timeout: 60_000 });
      const totals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
      count = totals.length;
      existing.clear();
      totals.forEach((t) => { if (t !== '') existing.add(parseFloat(t).toFixed(2)); });
      pending = PAIRS.filter(([, t]) => !existing.has(t));
      added = plannedNew - pending.length;
      unsaved = 0;
      inflightAdds = 0;
      lastKnownCount = count;
      console.log(`[recover] ${pending.length} row(s) still to insert`);
      continue;
    }

    const totals = await scanForm();
    await fillEmpties(totals);

    if (SAVE_EVERY > 0 && unsaved >= SAVE_EVERY) {
      await drainInflight();
      const paceMs = (Date.now() - startedAt) / Math.max(added, 1);
      const etaMin = Math.round((paceMs * pending.length) / 60000);
      await saveChanges(`checkpoint — progress ${added}/${plannedNew}, elapsed ${elapsedMin()} min, rough ETA ~${etaMin} min`);
      unsaved = 0;
    }

    if (pending.length === 0) break;

    if (batchSupported) {
      const want = Math.min(BATCH_ADD, pending.length) - inflightAdds;
      if (want > 0) {
        const fired = await page.evaluate((n) => {
          try {
            const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Add More'));
            const root = btn && btn.closest('[wire\\:id]');
            if (!root || !window.Livewire) return 0;
            const comp = window.Livewire.find(root.getAttribute('wire:id'));
            if (!comp) return 0;
            for (let i = 0; i < n; i++) comp.call('mountFormComponentAction', 'data.gpaScores', 'add');
            return n;
          } catch {
            return 0;
          }
        }, want);

        if (fired === 0) {
          batchSupported = false;
          console.log('[fallback] Livewire JS API unavailable — switching to one-click adds');
        } else {
          inflightAdds += fired;
          if (!batchProducedRows) console.log(`[fast-add] requested ${fired} rows in one commit — waiting for them to land`);
        }
      }

      if (batchSupported) {
        try {
          await page.waitForFunction(
            (n) => document.querySelectorAll('input[id$="gpa_total"]').length > n,
            lastKnownCount,
            { timeout: 150_000 },
          );
        } catch {
          if (!batchProducedRows) {
            batchSupported = false;
            inflightAdds = 0;
            console.log('[fallback] batched adds produced no rows — switching to one-click adds');
          } else if (inflightAdds > 0) {
            console.log('[fast-add] outstanding adds stalled — treating as lost, will re-request');
            inflightAdds = 0;
          }
        }
        continue;
      }
    }

    await clickAddOnce(pending[0][0]);
  }

  // 5. Final save.
  if (unsaved > 0) {
    await saveChanges('final save');
  } else if (added === 0) {
    console.log('[done] Nothing to add — every total already exists.');
  }

  // 6. Verify persistence against a fresh page load.
  page.off('framenavigated', navListener);

  let reloaded = false;
  for (let attempt = 1; attempt <= 3 && !reloaded; attempt++) {
    try {
      await page.goto(editUrl, { waitUntil: 'domcontentloaded' });
      reloaded = true;
    } catch (e) {
      if (page.isClosed()) {
        throw new Error('Browser tab was closed during verification. All data up to the last "[saved]" line is safe — re-run to finish verification.');
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
    const expectedLabel = EXPECTED_LABEL_BY_TOTAL[totalKey];
    if (expectedLabel !== undefined) {
      const s = (finalScores[i] ?? '').trim();
      if (s !== expectedLabel) mismatched.push(`row ${i + 1}: total ${t} has score "${s || '(empty)'}", expected "${expectedLabel}"`);
    }
  });

  expect(mismatched, `Grade label does not match the band table on: ${mismatched.join('; ')}`).toHaveLength(0);

  const missing = PAIRS.filter(([, t]) => !persisted.has(t)).map(([l, t]) => `${l}/${t}`);
  expect(missing, `Rows missing on the server after save: ${missing.join(', ')}`).toHaveLength(0);

  console.log(`--- DONE in ${elapsedMin()} min. Added ${added} new row(s). All ${PAIRS.length} band rows (N/F 0.00 -> HD 4.00) verified on the server. ---`);
});