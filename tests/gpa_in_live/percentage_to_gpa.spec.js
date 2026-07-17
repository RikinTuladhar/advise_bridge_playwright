// populate-percentage-scale-0-100.spec.js
//
// Populates the "Percentage" scale on staging.advisebridge.com:
//   GPA Score = percentage (0 .. 100)
//   GPA Total = the equivalent U.S. 4.0 GPA from GPA_Comparison.xlsx
//
// The comparison sheet ("Comparison 0-100") was verified to be perfectly
// linear: U.S. 4.0 GPA = percentage x 0.04 for every one of its 101 rows
// (0% -> 0.00, 1% -> 0.04, 2% -> 0.08, ... 100% -> 4.00), so the mapping is
// generated below with exactly those values.
//
// SAFETY PRE-FLIGHT: before adding anything, the script compares the rows you
// already entered manually (0%, 1%, 2%) against this mapping. If any existing
// total does not match, it ABORTS without changing a single field and prints
// found-vs-expected — so if a different column of the sheet was intended
// (e.g. India 10-point CGPA), nothing wrong ever gets inserted.
//
// Same infrastructure as the script that already passed:
//  - Edit link resolved from the /admin/gpas row text (no hard-coded id).
//  - One-shot scan, duplicate skipping -> fully RESUMABLE after any crash.
//  - Empty leftover rows reused first (they block saving otherwise).
//  - Checkpoint save every 10 rows + final save.
//  - Reload-and-verify at the end: every percentage present AND every total
//    equals the sheet value.
//  - Headless: no browser window to accidentally close. Delete the test.use
//    line to watch it run.

const { test, expect } = require('@playwright/test');

// No visible browser window -> nothing to accidentally close mid-run.
test.use({ headless: true });

// ------------------------------ configuration ------------------------------
const BASE_URL     = 'https://staging.advisebridge.com';
const EMAIL        = 'admin@advisebridge.com';
const PASSWORD     = 'admin@advisebridge.com';
const TARGET_SCALE = 'Percentage';  // row text on /admin/gpas whose Edit we click
const SAVE_EVERY   = 10;            // checkpoint-save every N new rows (0 = single save at the end)
// ----------------------------------------------------------------------------

// Percentage -> U.S. 4.0 GPA, exactly as in GPA_Comparison.xlsx
// ("Comparison 0-100" sheet, columns "Percentage (%)" and "U.S. 4.0 GPA").
const PCT_TO_GPA = [];
for (let p = 0; p <= 100; p++) {
  PCT_TO_GPA.push([String(p), (p * 0.04).toFixed(2)]);
}

// Normalised lookup: '1.00' -> '0.04', '55.00' -> '2.20', ...
const EXPECTED_BY_PCT = Object.fromEntries(
  PCT_TO_GPA.map(([pct, gpa]) => [parseFloat(pct).toFixed(2), gpa]),
);

test.setTimeout(10_800_000); // 3 hours of headroom for ~98 rows

test(`Populate "${TARGET_SCALE}" scale: 0% -> 100% with U.S. 4.0 GPA totals`, async ({ page }) => {
  const startedAt = Date.now();
  const elapsedMin = () => ((Date.now() - startedAt) / 60000).toFixed(1);

  // Auto-accept browser dialogs (e.g. "unsaved changes" prompt on reload).
  page.on('dialog', (dialog) => dialog.accept());

  // 1. Log in.
  await page.goto(`${BASE_URL}/admin/login`);
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 30_000 });

  // 2. Open the GPA list and follow the Edit action of the "Percentage" row.
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
    const pctKey = parseFloat(s).toFixed(2);
    existing.add(pctKey);

    // PRE-FLIGHT: every already-entered percentage must match the sheet.
    const expectedGpa = EXPECTED_BY_PCT[pctKey];
    if (expectedGpa !== undefined) {
      const t = (initialTotals[i] ?? '').trim();
      const actualGpa = t === '' ? '(empty)' : parseFloat(t).toFixed(2);
      if (actualGpa !== expectedGpa) {
        preflightProblems.push(`row ${i + 1}: ${s}% has total ${actualGpa}, but the sheet's U.S. 4.0 GPA column says ${expectedGpa}`);
      } else {
        console.log(`[preflight] ${s}% -> ${actualGpa} matches the sheet ✓`);
      }
    }
  });

  if (preflightProblems.length > 0) {
    throw new Error(
      'ABORTED BEFORE MAKING ANY CHANGES — the rows already entered manually do not match ' +
      'the "U.S. 4.0 GPA" column of GPA_Comparison.xlsx:\n  - ' +
      preflightProblems.join('\n  - ') +
      '\nIf a different column of the sheet (e.g. India 10-Point CGPA) was intended for GPA Total, ' +
      'the mapping in this script needs to be changed first. Nothing was modified.',
    );
  }

  const plannedNew = PCT_TO_GPA.filter(([pct]) => !existing.has(parseFloat(pct).toFixed(2))).length;
  const firstMissing = PCT_TO_GPA.find(([pct]) => !existing.has(parseFloat(pct).toFixed(2)));
  console.log(`[scan] ${count} existing rows, ${existing.size} percentage value(s) already saved.`);
  console.log(`[scan] ${plannedNew} value(s) left to insert.${firstMissing ? ` Resuming from ${firstMissing[0]}%.` : ''}`);
  if (emptyRows.length) console.log(`[scan] ${emptyRows.length} empty row(s) found — they will be reused first.`);

  const addMoreButton = page.getByRole('button', { name: 'Add More' });

  // --- helper: click "Save changes" and confirm it actually saved ---
  async function saveChanges(label) {
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await saveButton.scrollIntoViewIfNeeded();

    const livewireDone = page.waitForResponse(
      (r) => r.url().includes('/livewire/') && r.request().method() === 'POST' && r.status() === 200,
      { timeout: 120_000 },
    );
    await saveButton.click();
    await livewireDone;

    try {
      await page.getByText('Saved', { exact: true }).first().waitFor({ state: 'visible', timeout: 10_000 });
      console.log(`[saved] ${label} (elapsed ${elapsedMin()} min)`);
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

  // --- helper: fill one row (score = percentage, total = GPA) and verify ---
  async function fillRow(index, scoreValue, totalValue) {
    const score = scoreInputs.nth(index);
    const total = totalInputs.nth(index);

    await score.scrollIntoViewIfNeeded();
    await score.fill(scoreValue);
    await total.fill(totalValue);

    for (const [input, name, value] of [[score, 'score', scoreValue], [total, 'total', totalValue]]) {
      if ((await input.inputValue()) !== value) {
        console.log(`[retry] ${name} for ${scoreValue}% did not stick — re-typing slowly`);
        await input.click();
        await input.clear();
        await input.pressSequentially(value, { delay: 40 });
        await input.dispatchEvent('blur');
        expect(await input.inputValue(), `Could not set ${name} to ${value}`).toBe(value);
      }
    }
  }

  // 4. Main loop over the sheet mapping.
  let added = 0;
  let unsaved = 0;
  console.log(`--- Target: 0% -> 100% (${PCT_TO_GPA.length} pairs, existing ones skipped) ---`);

  for (const [pct, gpa] of PCT_TO_GPA) {
    const pctKey = parseFloat(pct).toFixed(2);
    if (existing.has(pctKey)) {
      continue; // already saved — silent skip
    }

    let rowIndex;
    if (emptyRows.length > 0) {
      rowIndex = emptyRows.shift();
      console.log(`[reuse] empty row ${rowIndex + 1} -> ${pct}% / ${gpa}`);
    } else {
      await addMoreButton.scrollIntoViewIfNeeded();
      await addMoreButton.click();
      await expect(scoreInputs, 'New repeater row did not appear after "Add More"').toHaveCount(count + 1, { timeout: 30_000 });
      count += 1;
      rowIndex = count - 1;
    }

    await fillRow(rowIndex, pct, gpa);
    existing.add(pctKey);
    added += 1;
    unsaved += 1;
    console.log(`[ok] row ${rowIndex + 1}: ${pct}% -> ${gpa}`);

    if (SAVE_EVERY > 0 && unsaved >= SAVE_EVERY) {
      await saveChanges(`checkpoint after ${pct}% — progress ${added}/${plannedNew}`);
      unsaved = 0;
    }
  }

  // 5. Final save (covers everything since the last checkpoint).
  if (unsaved > 0) {
    await saveChanges('final save');
  } else if (added === 0) {
    console.log('[done] Nothing to add — every percentage already exists.');
  }

  // 6. Verify persistence: reload so the form reflects the DATABASE, then
  //    confirm every percentage survived AND its total equals the sheet value.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await scoreInputs.first().waitFor({ state: 'visible', timeout: 60_000 });
  await page.waitForTimeout(1_000);

  const finalScores = await scoreInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  const finalTotals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));

  const persisted = new Set();
  const mismatched = [];
  finalScores.forEach((s, i) => {
    if (s === '') return;
    const pctKey = parseFloat(s).toFixed(2);
    persisted.add(pctKey);

    const expectedGpa = EXPECTED_BY_PCT[pctKey];
    if (expectedGpa !== undefined) {
      const t = (finalTotals[i] ?? '').trim();
      const actualGpa = t === '' ? '(empty)' : parseFloat(t).toFixed(2);
      if (actualGpa !== expectedGpa) {
        mismatched.push(`row ${i + 1}: ${s}% has total ${actualGpa}, expected ${expectedGpa}`);
      }
    }
  });

  expect(mismatched, `GPA Total does not match the sheet on: ${mismatched.join('; ')}`).toHaveLength(0);

  const missing = PCT_TO_GPA
    .filter(([pct]) => !persisted.has(parseFloat(pct).toFixed(2)))
    .map(([pct]) => `${pct}%`);
  expect(missing, `Percentages missing on the server after save: ${missing.join(', ')}`).toHaveLength(0);

  console.log(`--- DONE in ${elapsedMin()} min. Added ${added} new row(s). All ${PCT_TO_GPA.length} percentage->GPA pairs (0% -> 100%) verified against the sheet on the server. ---`);
});