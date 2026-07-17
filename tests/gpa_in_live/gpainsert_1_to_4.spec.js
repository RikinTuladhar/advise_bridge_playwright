// populate-gpas-resume-to-4.00.spec.js
//
// RESUME RUN — picks up exactly where the interrupted run left off.
//
// Nothing in the database was harmed by closing the tab: everything up to the
// last checkpoint save is already stored (with SAVE_EVERY=20 and a stop at
// 2.39, that is almost certainly 0.00–2.20). The rows filled after that
// checkpoint but never saved simply vanished with the tab, and this script
// re-detects and re-inserts them automatically:
//   scan form -> skip every value already saved -> continue adding -> 4.00.
//
// Changes vs the previous run, based on what went wrong:
//  1. Forced HEADLESS mode — no browser window opens, so there is no tab to
//     accidentally close. (Delete the test.use line below if you want to
//     watch it work.)
//  2. Checkpoint saves every 10 rows instead of 20 — any future interruption
//     can only ever cost ~10 rows of redo time.
//  3. The scan now logs the exact value it resumes from, so you can confirm
//     at a glance where the last run really stopped.

const { test, expect } = require('@playwright/test');

// No visible browser window -> nothing to accidentally close mid-run.
test.use({ headless: true });

// ------------------------------ configuration ------------------------------
const BASE_URL     = 'https://staging.advisebridge.com';
const EMAIL        = 'admin@advisebridge.com';
const PASSWORD     = 'admin@advisebridge.com';
const TARGET_SCALE = 'US 4.0 GPA'; // row text on /admin/gpas whose Edit we click
const START_GPA    = 0.00;         // full range: everything already saved is skipped
const END_GPA      = 4.00;         // last value to insert (inclusive)
const SAVE_EVERY   = 10;           // checkpoint-save every N new rows (0 = only one save at the very end)
// ----------------------------------------------------------------------------

test.setTimeout(10_800_000); // 3 hours — Livewire round trips get slower as
                             // the repeater grows toward ~401 rows.

test(`Populate "${TARGET_SCALE}" with ${START_GPA.toFixed(2)} -> ${END_GPA.toFixed(2)}`, async ({ page }) => {
  const startedAt = Date.now();
  const elapsedMin = () => ((Date.now() - startedAt) / 60000).toFixed(1);

  // Auto-accept browser dialogs (e.g. "unsaved changes" prompt on reload).
  page.on('dialog', (dialog) => dialog.accept());

  // 1. Build the target list with an integer (cents) loop — no float drift,
  //    so 4.00 is really included.
  const targetGpaList = [];
  for (let c = Math.round(START_GPA * 100); c <= Math.round(END_GPA * 100); c++) {
    targetGpaList.push((c / 100).toFixed(2));
  }

  // 2. Log in.
  await page.goto(`${BASE_URL}/admin/login`);
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 30_000 });

  // 3. Open the GPA list and follow the Edit action of the target row.
  //    Never hard-code the record id — that is what caused the old 404.
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

  // 4. One-time scan of what is already saved — a single page call reads
  //    every score input at once. This is what makes the run resumable.
  const initialValues = await scoreInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  let count = initialValues.length;
  const existing = new Set();
  const emptyRows = []; // leftover empty rows from a previously failed save
  initialValues.forEach((v, i) => {
    if (v === '') emptyRows.push(i);
    else existing.add(parseFloat(v).toFixed(2));
  });

  const plannedNew = targetGpaList.filter((g) => !existing.has(g)).length;
  const firstMissing = targetGpaList.find((g) => !existing.has(g));
  console.log(`[scan] ${count} existing rows, ${existing.size} distinct values already saved.`);
  console.log(`[scan] ${plannedNew} value(s) left to insert.${firstMissing ? ` Resuming from ${firstMissing}.` : ''}`);
  if (emptyRows.length) console.log(`[scan] ${emptyRows.length} empty row(s) found — they will be reused first.`);

  const addMoreButton = page.getByRole('button', { name: 'Add More' });

  // --- helper: click "Save changes" and confirm it actually saved ---
  async function saveChanges(label) {
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await saveButton.scrollIntoViewIfNeeded();

    // Register the wait BEFORE clicking to avoid missing a fast response.
    const livewireDone = page.waitForResponse(
      (r) => r.url().includes('/livewire/') && r.request().method() === 'POST' && r.status() === 200,
      { timeout: 120_000 }, // saving hundreds of rows can take a while on staging
    );
    await saveButton.click();
    await livewireDone;

    // Filament shows a "Saved" toast on success, inline errors on failure.
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

    await page.waitForTimeout(800);            // let the toast/re-render settle
    count = await scoreInputs.count();         // re-sync after Livewire re-render
  }

  // --- helper: fill one row (score + total with the same value) and verify ---
  async function fillRow(index, value) {
    const score = scoreInputs.nth(index);
    const total = totalInputs.nth(index);

    await score.scrollIntoViewIfNeeded();
    await score.fill(value);
    await total.fill(value);

    // Verify the values stuck; Livewire morphs can occasionally clobber a
    // freshly added input. Retry once with slow human-like typing.
    for (const [input, name] of [[score, 'score'], [total, 'total']]) {
      if ((await input.inputValue()) !== value) {
        console.log(`[retry] ${name} for ${value} did not stick — re-typing slowly`);
        await input.click();
        await input.clear();
        await input.pressSequentially(value, { delay: 40 });
        await input.dispatchEvent('blur');
        expect(await input.inputValue(), `Could not set ${name} to ${value}`).toBe(value);
      }
    }
  }

  // 5. Main loop.
  let added = 0;
  let unsaved = 0;
  console.log(`--- Target range ${targetGpaList[0]} -> ${targetGpaList[targetGpaList.length - 1]} (${targetGpaList.length} values, existing ones skipped) ---`);

  for (const gpaValue of targetGpaList) {
    if (existing.has(gpaValue)) {
      continue; // already saved — silent skip to keep the log readable
    }

    let rowIndex;
    if (emptyRows.length > 0) {
      // Fill leftovers first — an empty row fails "required" validation and
      // would block every save.
      rowIndex = emptyRows.shift();
      console.log(`[reuse] empty row ${rowIndex + 1} -> ${gpaValue}`);
    } else {
      await addMoreButton.scrollIntoViewIfNeeded();
      await addMoreButton.click(); // Playwright auto-waits for it to be enabled
      await expect(scoreInputs, 'New repeater row did not appear after "Add More"').toHaveCount(count + 1, { timeout: 30_000 });
      count += 1;
      rowIndex = count - 1; // Filament appends new rows at the end
    }

    await fillRow(rowIndex, gpaValue);
    existing.add(gpaValue);
    added += 1;
    unsaved += 1;
    console.log(`[ok] row ${rowIndex + 1} = ${gpaValue}`);

    if (SAVE_EVERY > 0 && unsaved >= SAVE_EVERY) {
      await saveChanges(`checkpoint after ${gpaValue} — progress ${added}/${plannedNew}`);
      unsaved = 0;
    }
  }

  // 6. Final save (covers everything since the last checkpoint).
  if (unsaved > 0) {
    await saveChanges('final save');
  } else if (added === 0) {
    console.log('[done] Nothing to add — every target value already exists.');
  }

  // 7. Verify persistence: reload so the form reflects the DATABASE, then
  //    confirm every target value survived and Total === Score for them.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await scoreInputs.first().waitFor({ state: 'visible', timeout: 60_000 });
  await page.waitForTimeout(1_000); // give the large form a moment to finish rendering

  const finalScores = await scoreInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  const finalTotals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));

  const targetSet = new Set(targetGpaList);
  const persisted = new Set();
  const mismatched = [];
  finalScores.forEach((s, i) => {
    if (s === '') return;
    const sFixed = parseFloat(s).toFixed(2);
    persisted.add(sFixed);
    if (targetSet.has(sFixed)) {
      const t = (finalTotals[i] ?? '').trim();
      if (t === '' || parseFloat(t).toFixed(2) !== sFixed) {
        mismatched.push(`row ${i + 1}: score=${sFixed}, total=${t || '(empty)'}`);
      }
    }
  });

  expect(mismatched, `GPA Total does not match GPA Score on: ${mismatched.join('; ')}`).toHaveLength(0);

  const missing = targetGpaList.filter((g) => !persisted.has(g));
  expect(missing, `Values missing on the server after save: ${missing.join(', ')}`).toHaveLength(0);

  console.log(`--- DONE in ${elapsedMin()} min. Added ${added} new row(s). All ${targetGpaList.length} values from ${targetGpaList[0]} to ${targetGpaList[targetGpaList.length - 1]} verified as saved on the server. ---`);
});