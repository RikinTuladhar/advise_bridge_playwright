// populate-australia-scale-FAST-0.00-to-7.00.spec.js
//
// FAST full run for the Australian 7.0 GPA scale (record row containing
// "Australia" on /admin/gpas):
//   GPA Score = Australian GPA, 0.00 .. 7.00 in 0.01 steps (701 rows)
//   GPA Total = U.S. 4.0 GPA = Aus x 4/7, rounded to 2 dp (verified, no ties)
//
// WHY THE OLD RUNS WERE SLOW: every "Add More" click is one Livewire round
// trip that ships the whole form and re-renders every existing row on the
// server. 700 rows = 700 increasingly expensive requests. Playwright's
// typing was never the bottleneck.
//
// WHAT THIS VERSION DOES DIFFERENTLY:
//  1. BATCHED ADDS: fires BATCH_ADD (25) add-actions through Livewire's JS
//     API in one tick. Livewire pools same-tick calls into a single commit,
//     so the server performs 25 adds and ONE re-render per request instead
//     of 25. If your Livewire build does not pool (calls land one by one),
//     the script detects it and still works — rows just trickle in and get
//     filled as they arrive. If the JS API is unavailable entirely, it
//     falls back to the proven one-click-per-row path automatically.
//     The log tells you which mode you got.
//  2. Checkpoint saves every 25 rows instead of 10 (fewer heavy saves), and
//     saves only happen when zero add-requests are outstanding, so a save
//     can never collide with an empty row.
//  3. Playwright recording overhead forced off (video/trace/screenshot) in
//     case your playwright.config has any of it enabled — on multi-hour
//     runs that alone is a real cost.
//
// Expected runtime: if batching pools (likely), roughly 30-60 minutes.
// If it falls back to one-click adds, expect the old pace (2-4 hours).
// Either way it is self-healing and resumable: interruptions cost at most
// one checkpoint of redo, and re-running the same command continues.

const { test, expect } = require('@playwright/test');

// Headless + all recording off: nothing to close, nothing slowing the run.
test.use({ headless: true, video: 'off', trace: 'off', screenshot: 'off' });

// ------------------------------ configuration ------------------------------
const BASE_URL     = 'https://staging.advisebridge.com';
const EMAIL        = 'admin@advisebridge.com';
const PASSWORD     = 'admin@advisebridge.com';
const TARGET_SCALE = 'Australia'; // substring of the row text on /admin/gpas
const START_AUS    = 0.00;
const END_AUS      = 7.00;
const BATCH_ADD    = 25;          // add-actions fired per Livewire commit
const SAVE_EVERY   = 25;          // checkpoint-save every N filled rows
// ----------------------------------------------------------------------------

// --- integer-exact mapping: US hundredths = round(4k/7) = floor((8k+7)/14) ---
const fmtCents = (k) => `${Math.floor(k / 100)}.${String(k % 100).padStart(2, '0')}`;
const usCentsFor = (k) => Math.floor((8 * k + 7) / 14);

const EXPECTED_BY_AUS = {};
for (let k = 0; k <= 700; k++) EXPECTED_BY_AUS[fmtCents(k)] = fmtCents(usCentsFor(k));

const AUS_TO_US = [];
for (let k = Math.round(START_AUS * 100); k <= Math.round(END_AUS * 100); k++) {
  AUS_TO_US.push([fmtCents(k), fmtCents(usCentsFor(k))]);
}

test.setTimeout(28_800_000); // 8 hours — covers even the full-fallback case

test(`FAST populate "${TARGET_SCALE}" scale: 0.00 -> 7.00 with U.S. 4.0 GPA totals`, async ({ page }) => {
  const startedAt = Date.now();
  const elapsedMin = () => ((Date.now() - startedAt) / 60000).toFixed(1);

  page.on('dialog', (dialog) => dialog.accept());

  // 1. Log in.
  await page.goto(`${BASE_URL}/admin/login`);
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 30_000 });

  // 2. Open the GPA list and follow the Edit action of the Australia row.
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

  // 3. One-shot scan + pre-flight.
  const initialScores = await scoreInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  const initialTotals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  let count = initialScores.length;

  const existing = new Set();
  const preflightProblems = [];
  initialScores.forEach((s, i) => {
    if (s === '') return;
    const ausKey = parseFloat(s).toFixed(2);
    existing.add(ausKey);
    const expectedUs = EXPECTED_BY_AUS[ausKey];
    if (expectedUs !== undefined) {
      const t = (initialTotals[i] ?? '').trim();
      const actualUs = t === '' ? '(empty)' : parseFloat(t).toFixed(2);
      if (actualUs !== expectedUs) {
        preflightProblems.push(`row ${i + 1}: Aus ${s} has total ${actualUs}, but Aus x 4/7 (2 dp) = ${expectedUs}`);
      }
    }
  });
  if (preflightProblems.length > 0) {
    throw new Error(
      'ABORTED BEFORE MAKING ANY CHANGES — existing rows do not match the Aus x 4/7 mapping:\n  - ' +
      preflightProblems.join('\n  - ') + '\nNothing was modified.',
    );
  }
  console.log(`[preflight] ${existing.size} existing value(s) checked against the mapping ✓`);

  const plannedNew = AUS_TO_US.filter(([a]) => !existing.has(a)).length;
  console.log(`[scan] ${count} existing rows. ${plannedNew} value(s) left to insert.`);

  // ---------------- pipeline state ----------------
  let pending = AUS_TO_US.filter(([a]) => !existing.has(a));
  let added = 0;
  let unsaved = 0;
  let batchSupported = BATCH_ADD > 1;
  let batchProducedRows = false; // has batching ever yielded a row?
  let inflightAdds = 0;          // add-actions requested but not yet visible
  let lastKnownCount = count;    // INVARIANT: inflightAdds <= pending.length

  let unexpectedNav = false;
  const navListener = (frame) => { if (frame === page.mainFrame()) unexpectedNav = true; };
  page.on('framenavigated', navListener);

  // --- scan the form, settle arrivals into the bookkeeping, return values ---
  async function scanForm() {
    const values = await scoreInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
    count = values.length;
    const arrived = Math.max(0, count - lastKnownCount);
    if (arrived > 0 && inflightAdds > 0) batchProducedRows = true;
    inflightAdds = Math.max(0, inflightAdds - arrived);
    lastKnownCount = count;
    return values;
  }

  // --- fill one row and verify it stuck ---
  async function fillRow(index, scoreValue, totalValue) {
    const score = scoreInputs.nth(index);
    const total = totalInputs.nth(index);
    await score.fill(scoreValue);
    await total.fill(totalValue);
    for (const [input, name, value] of [[score, 'score', scoreValue], [total, 'total', totalValue]]) {
      if ((await input.inputValue()) !== value) {
        console.log(`[retry] ${name} for Aus ${scoreValue} did not stick — re-typing slowly`);
        await input.click();
        await input.clear();
        await input.pressSequentially(value, { delay: 40 });
        await input.dispatchEvent('blur');
        expect(await input.inputValue(), `Could not set ${name} to ${value}`).toBe(value);
      }
    }
  }

  // --- fill every empty row visible in this snapshot ---
  async function fillEmpties(values) {
    let filled = 0;
    for (let i = 0; i < values.length && pending.length > 0; i++) {
      if (values[i] !== '') continue;
      const [aus, us] = pending[0];
      await fillRow(i, aus, us);
      existing.add(aus);
      pending.shift();
      added += 1; unsaved += 1; filled += 1;
      console.log(`[ok] row ${i + 1}: Aus ${aus} -> ${us}`);
    }
    return filled;
  }

  // --- wait until every outstanding add has landed and is filled ---
  async function drainInflight() {
    while (inflightAdds > 0) {
      try {
        await page.waitForFunction(
          (n) => document.querySelectorAll('input[id$="gpa_score"]').length > n,
          lastKnownCount,
          { timeout: 120_000 },
        );
      } catch {
        console.log(`[fast-add] ${inflightAdds} outstanding add(s) stalled — treating as lost, will re-request`);
        inflightAdds = 0;
        break;
      }
      const values = await scanForm();
      await fillEmpties(values);
    }
  }

  // --- proven one-click add (fallback path) ---
  async function clickAddOnce(forValue) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const before = await scoreInputs.count();
      try {
        await addMoreButton.scrollIntoViewIfNeeded();
        await addMoreButton.click();
        await page.waitForFunction(
          (n) => document.querySelectorAll('input[id$="gpa_score"]').length > n,
          before,
          { timeout: 120_000 },
        );
        count = await scoreInputs.count();
        lastKnownCount = count;
        return;
      } catch {
        console.log(`[retry-add] attempt ${attempt} for Aus ${forValue}: no new row within 120s — retrying`);
        await page.waitForTimeout(3_000);
        const now = await scoreInputs.count();
        if (now > before) { count = now; lastKnownCount = now; return; }
      }
    }
    throw new Error(
      `"Add More" produced no new row after 3 attempts (while adding Aus ${forValue}). ` +
      'Everything up to the last "[saved]" line is stored — re-run to resume.',
    );
  }

  // --- save with retries; only ever called with zero outstanding adds ---
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
    count = await scoreInputs.count();
    lastKnownCount = count;
  }

  // 4. Main pipeline.
  console.log(`--- Target: Aus 0.00 -> 7.00 (${AUS_TO_US.length} pairs, existing ones skipped) | batch size ${BATCH_ADD} ---`);

  while (pending.length > 0) {
    if (unexpectedNav) {
      unexpectedNav = false;
      console.log('[recover] the page reloaded unexpectedly — re-syncing with the saved form state');
      await addMoreButton.waitFor({ state: 'visible', timeout: 60_000 });
      const vals = await scoreInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
      count = vals.length;
      existing.clear();
      vals.forEach((v) => { if (v !== '') existing.add(parseFloat(v).toFixed(2)); });
      pending = AUS_TO_US.filter(([a]) => !existing.has(a));
      added = plannedNew - pending.length;
      unsaved = 0;
      inflightAdds = 0; // any queued adds died with the page
      lastKnownCount = count;
      console.log(`[recover] ${pending.length} value(s) still to insert`);
      continue;
    }

    // Fill whatever empty rows exist right now.
    const values = await scanForm();
    await fillEmpties(values);

    // Checkpoint: drain outstanding adds first so no empty row can exist
    // at the moment of saving.
    if (SAVE_EVERY > 0 && unsaved >= SAVE_EVERY) {
      await drainInflight();
      const paceMs = (Date.now() - startedAt) / Math.max(added, 1);
      const etaMin = Math.round((paceMs * pending.length) / 60000);
      await saveChanges(`checkpoint — progress ${added}/${plannedNew}, elapsed ${elapsedMin()} min, rough ETA ~${etaMin} min`);
      unsaved = 0;
    }

    if (pending.length === 0) break;

    // Request more rows.
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
            (n) => document.querySelectorAll('input[id$="gpa_score"]').length > n,
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
        continue; // next cycle scans and fills whatever arrived
      }
    }

    // Fallback path: one proven click per cycle.
    await clickAddOnce(pending[0][0]);
  }

  // 5. Final save. (Loop invariant guarantees zero outstanding adds here.)
  if (unsaved > 0) {
    await saveChanges('final save');
  } else if (added === 0) {
    console.log('[done] Nothing to add — every Australian GPA already exists.');
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

  await scoreInputs.first().waitFor({ state: 'visible', timeout: 120_000 });
  await page.waitForTimeout(2_000);

  const finalScores = await scoreInputs.evaluateAll((els) => els.map((el) => el.value.trim()));
  const finalTotals = await totalInputs.evaluateAll((els) => els.map((el) => el.value.trim()));

  const persisted = new Set();
  const mismatched = [];
  finalScores.forEach((s, i) => {
    if (s === '') return;
    const ausKey = parseFloat(s).toFixed(2);
    persisted.add(ausKey);
    const expectedUs = EXPECTED_BY_AUS[ausKey];
    if (expectedUs !== undefined) {
      const t = (finalTotals[i] ?? '').trim();
      const actualUs = t === '' ? '(empty)' : parseFloat(t).toFixed(2);
      if (actualUs !== expectedUs) mismatched.push(`row ${i + 1}: Aus ${s} has total ${actualUs}, expected ${expectedUs}`);
    }
  });

  expect(mismatched, `GPA Total does not match Aus x 4/7 on: ${mismatched.join('; ')}`).toHaveLength(0);

  const missing = AUS_TO_US.filter(([a]) => !persisted.has(a)).map(([a]) => a);
  expect(missing, `Australian GPAs missing on the server after save: ${missing.join(', ')}`).toHaveLength(0);

  console.log(`--- DONE in ${elapsedMin()} min. Added ${added} new row(s). All ${AUS_TO_US.length} Aus->US pairs verified on the server. ---`);
});