// populate-gpas-0.11-to-1.00.spec.js
//
// Populates the "US 4.0 GPA" scale on staging.advisebridge.com with GPA values
// from START_GPA to END_GPA (GPA Score = GPA Total), skipping values that
// already exist on the form.
//
// Fixes vs the previous script:
//  1. NO hard-coded record URL. The old /admin/gpas/1/edit record was deleted
//     -> 404. We now open /admin/gpas and follow the Edit link of the row
//     whose Scale text matches TARGET_SCALE, whatever its id is.
//  2. Integer loop for value generation. The old `i += 0.01` float loop
//     accumulated drift and silently skipped 1.00.
//  3. Existing values are scanned ONCE and tracked in memory instead of
//     re-reading every input on every iteration (much faster).
//  4. After "Add More" we wait for the row count to actually increase,
//     instead of blind timeouts.
//  5. Leftover EMPTY rows (e.g. from a previously failed manual save) are
//     reused and filled first — an empty row makes the whole save fail with
//     "required" validation errors.
//  6. Checkpoint saves every SAVE_EVERY rows, so a crash can never lose more
//     than a few rows of work. Set SAVE_EVERY = 0 to save only once at the
//     very end, exactly like the manual workflow.
//  7. After the final save, the page is reloaded and every target value is
//     verified against what the server actually persisted.
//
// For the next batches (your final goal is 0.00–4.00) just change
// START_GPA / END_GPA, e.g. 1.01 -> 2.00, and re-run. Duplicates are always
// skipped automatically, so overlapping ranges are harmless.

const { test, expect } = require('@playwright/test');

// ------------------------------ configuration ------------------------------
const BASE_URL     = 'https://staging.advisebridge.com';
const EMAIL        = 'admin@advisebridge.com';
const PASSWORD     = 'admin@advisebridge.com';
const TARGET_SCALE = 'US 4.0 GPA'; // row text on /admin/gpas whose Edit we click
const START_GPA    = 0.11;         // first value to insert
const END_GPA      = 1.00;         // last value to insert (inclusive)
const SAVE_EVERY   = 20;           // checkpoint-save every N new rows (0 = only one save at the very end)
// ----------------------------------------------------------------------------

test.setTimeout(1_800_000); // 30 minutes, plenty of headroom for ~90 rows

test(`Populate "${TARGET_SCALE}" with ${START_GPA.toFixed(2)} -> ${END_GPA.toFixed(2)}`, async ({ page }) => {
  // Auto-accept browser dialogs (e.g. "unsaved changes" prompt on reload).
  page.on('dialog', (dialog) => dialog.accept());

  // 1. Build the target list with an integer (cents) loop — no float drift,
  //    so 1.00 is really included.
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
  //    This is what prevents the 404 — we never guess the record id.
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

  // 4. One-time scan of what is already on the form.
  let count = await scoreInputs.count();
  const existing = new Set();
  const emptyRows = []; // leftover empty rows from a previously failed save
  for (let i = 0; i < count; i++) {
    const v = (await scoreInputs.nth(i).inputValue()).trim();
    if (v === '') emptyRows.push(i);
    else existing.add(parseFloat(v).toFixed(2));
  }
  console.log(`[scan] ${count} existing rows. Values: ${[...existing].sort().join(', ') || '(none)'}`);
  if (emptyRows.length) console.log(`[scan] ${emptyRows.length} empty row(s) found — they will be reused first.`);

  const addMoreButton = page.getByRole('button', { name: 'Add More' });

  // --- helper: click "Save changes" and confirm it actually saved ---
  async function saveChanges(label) {
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await saveButton.scrollIntoViewIfNeeded();

    // Register the wait BEFORE clicking to avoid missing a fast response.
    const livewireDone = page.waitForResponse(
      (r) => r.url().includes('/livewire/') && r.request().method() === 'POST' && r.status() === 200,
      { timeout: 60_000 },
    );
    await saveButton.click();
    await livewireDone;

    // Filament shows a "Saved" toast on success, inline errors on failure.
    try {
      await page.getByText('Saved', { exact: true }).first().waitFor({ state: 'visible', timeout: 8_000 });
      console.log(`[saved] ${label}`);
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
  console.log(`--- Inserting ${targetGpaList[0]} -> ${targetGpaList[targetGpaList.length - 1]} (${targetGpaList.length} values, existing ones skipped) ---`);

  for (const gpaValue of targetGpaList) {
    if (existing.has(gpaValue)) {
      console.log(`[skip] ${gpaValue} already present`);
      continue;
    }

    let rowIndex;
    if (emptyRows.length > 0) {
      // Fill leftovers first — they would otherwise fail "required" validation.
      rowIndex = emptyRows.shift();
      console.log(`[reuse] empty row ${rowIndex + 1} -> ${gpaValue}`);
    } else {
      await addMoreButton.scrollIntoViewIfNeeded();
      await addMoreButton.click(); // Playwright auto-waits for it to be enabled
      await expect(scoreInputs, 'New repeater row did not appear after "Add More"').toHaveCount(count + 1, { timeout: 20_000 });
      count += 1;
      rowIndex = count - 1; // Filament appends new rows at the end
    }

    await fillRow(rowIndex, gpaValue);
    existing.add(gpaValue);
    added += 1;
    unsaved += 1;
    console.log(`[ok] row ${rowIndex + 1} = ${gpaValue}`);

    if (SAVE_EVERY > 0 && unsaved >= SAVE_EVERY) {
      await saveChanges(`checkpoint after ${gpaValue}`);
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
  //    confirm every target value survived and score === total for them.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await scoreInputs.first().waitFor({ state: 'visible', timeout: 30_000 });

  const persisted = new Set();
  const finalCount = await scoreInputs.count();
  for (let i = 0; i < finalCount; i++) {
    const s = (await scoreInputs.nth(i).inputValue()).trim();
    if (s === '') continue;
    const sFixed = parseFloat(s).toFixed(2);
    persisted.add(sFixed);

    if (targetGpaList.includes(sFixed)) {
      const t = (await totalInputs.nth(i).inputValue()).trim();
      expect(t === '' ? '(empty)' : parseFloat(t).toFixed(2), `Row ${i + 1}: GPA Total should equal GPA Score ${sFixed}`).toBe(sFixed);
    }
  }

  const missing = targetGpaList.filter((g) => !persisted.has(g));
  expect(missing, `Values missing on the server after save: ${missing.join(', ')}`).toHaveLength(0);

  console.log(`--- DONE. Added ${added} new row(s). All ${targetGpaList.length} values from ${targetGpaList[0]} to ${targetGpaList[targetGpaList.length - 1]} verified as saved on the server. ---`);
});