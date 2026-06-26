const { test, expect } = require('@playwright/test');

test.setTimeout(900000); // 15-minute execution limit

test('Populate missing GPA scales cleanly via Save State Tracing (0.00 to 1.00 Block)', async ({ page }) => {
    // 1. Generate strictly the 0.00 to 1.00 array
    const targetGpaList = [];
    for (let i = 0.00; i <= 1.00; i += 0.01) {
        targetGpaList.push(i.toFixed(2));
    }

    // 2. Authentication setup
    await page.goto('https://staging.advisebridge.com/admin/login');
    await page.fill('input[type="email"]', 'admin@advisebridge.com');
    await page.fill('input[type="password"]', 'admin@advisebridge.com');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    // 3. Navigate straight to the GPA edit form
    await page.goto('https://staging.advisebridge.com/admin/gpas/1/edit'); 
    await page.waitForLoadState('domcontentloaded');

    console.log('--- Initiating State-Aware Injection Pipeline ---');

    for (const gpaValue of targetGpaList) {
        // Read from the live DOM inside the loop to avoid stale layout conflicts
        const existingInputs = page.locator('input[wire\\:model*="gpa_score"]');
        const count = await existingInputs.count();
        const existingGpaValues = new Set();

        for (let i = 0; i < count; i++) {
            const val = await existingInputs.nth(i).inputValue();
            if (val) {
                existingGpaValues.add(parseFloat(val).toFixed(2));
            }
        }

        // Avoid duplication collisions
        if (existingGpaValues.has(gpaValue)) {
            console.log(`[Skipped] GPA ${gpaValue} already populated.`);
            continue;
        }

        console.log(`[Processing] Injecting missing GPA: ${gpaValue}`);

        // Click "Add More" to instantiate the fields
        const addMoreButton = page.locator('button:has-text("Add More"), button:has(span:text("Add More"))');
        await addMoreButton.scrollIntoViewIfNeeded();
        await addMoreButton.click();
        
        // Give the frontend container a moment to render the card
        await page.waitForTimeout(500); 

        // Target the newly appended inputs
        const lastScoreInput = page.locator('input[wire\\:model*="gpa_score"]').last();
        const lastTotalInput = page.locator('input[wire\\:model*="gpa_total"]').last();

        // Focus and fill elements
        await lastScoreInput.scrollIntoViewIfNeeded();
        await lastScoreInput.click();
        await lastScoreInput.fill(gpaValue);
        
        // Blurring the field (clicking outside or pressing Tab) forces Livewire to register the input data sync
        await lastScoreInput.press('Tab');
        await page.waitForTimeout(150);

        await lastTotalInput.fill(gpaValue);
        await lastTotalInput.press('Tab');
        await page.waitForTimeout(300);

        console.log(`[Processed] Added GPA row for ${gpaValue}`);
    }

    // Save everything in one batch and verify backend persistence.
    const saveBtnSpan = page.locator('span.fi-btn-label:has-text("Save changes")');
    const saveButtonWrapper = page.locator('button:has(span.fi-btn-label:has-text("Save changes"))');

    console.log('--- Saving all GPA rows now ---');
    await saveButtonWrapper.scrollIntoViewIfNeeded();
    await saveButtonWrapper.click();

    // Wait for the Livewire save request to complete.
    await page.waitForResponse(
        (resp) => resp.url().includes('/livewire/update') && resp.status() === 200,
        { timeout: 20000 }
    );

    try {
        await saveBtnSpan.waitFor({ state: 'hidden', timeout: 2000 });
        console.log('...Save button entered processing state');
    } catch (e) {
        // Some builds may not hide the text before finishing.
    }

    await saveBtnSpan.waitFor({ state: 'visible', timeout: 10000 });
    console.log('...Save button returned to ready state');

    await page.waitForLoadState('networkidle');

    // Reload and verify the values actually persisted.
    await page.goto('https://staging.advisebridge.com/admin/gpas/1/edit');
    await page.waitForLoadState('domcontentloaded');

    const persistedInputs = page.locator('input[wire\:model*="gpa_score"]');
    const persistedCount = await persistedInputs.count();
    const persistedValues = new Set();

    for (let i = 0; i < persistedCount; i++) {
        const value = await persistedInputs.nth(i).inputValue();
        if (value) {
            persistedValues.add(parseFloat(value).toFixed(2));
        }
    }

    for (const gpaValue of targetGpaList) {
        expect(persistedValues.has(gpaValue)).toBeTruthy();
    }

    console.log('✓ Success! The entire 0.00 - 1.00 sequence has been persisted and verified.');
});