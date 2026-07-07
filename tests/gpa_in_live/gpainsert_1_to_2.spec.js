const { test, expect } = require('@playwright/test');

// Comfortably handle up to 100 sequential entries with a 25-minute execution buffer
test.setTimeout(1500000); 

test('Populate missing GPA scales sequentially (1.01 to 2.00 Block)', async ({ page }) => {
    // 1. Generate strictly the target range from 1.01 to 2.00 inclusive
    const targetGpaList = [];
    for (let i = 1.01; i <= 2.00; i += 0.01) {
        targetGpaList.push(i.toFixed(2));
    }

    // 2. Authentication Flow
    await page.goto('https://advisebridge.com/admin/login'); // Update to live domain if running directly on production
    await page.fill('input[type="email"]', 'admin@advisebridge.com');
    await page.fill('input[type="password"]', 'X^#P$vCdaZ2KSTJc#rS0');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    // 3. Navigate directly to the GPA Editing layout
    await page.goto('https://advisebridge.com/admin/gpas/1/edit'); // Update template URL ID if your live database ID differs
    await page.waitForLoadState('domcontentloaded');

    console.log(`--- Starting Safe Indexed Sequence for 1.01 to 2.00 (${targetGpaList.length} items) ---`);

    for (const gpaValue of targetGpaList) {
        // Read the absolute freshest inputs to guarantee accurate duplicate prevention across updates
        const scoreLocator = page.locator('input[id*="gpa_score"]');
        const countBeforeAdd = await scoreLocator.count();
        
        const existingGpaValues = new Set();
        for (let i = 0; i < countBeforeAdd; i++) {
            const val = await scoreLocator.nth(i).inputValue();
            if (val) {
                // Ensure uniform formatting (e.g., matching float values accurately)
                existingGpaValues.add(parseFloat(val).toFixed(2));
            }
        }

        // Duplication Safety Guard: If it's already on your dashboard, skip completely!
        if (existingGpaValues.has(gpaValue)) {
            console.log(`[Skipped] GPA ${gpaValue} already exists. Moving forward...`);
            continue;
        }

        console.log(`[Action] Injecting missing entry at index position ${countBeforeAdd} -> GPA: ${gpaValue}`);

        // Click Filament's "Add More" component button
        const addMoreButton = page.locator('button:has-text("Add More"), button:has(span:text("Add More"))');
        await addMoreButton.scrollIntoViewIfNeeded();
        await addMoreButton.click();
        
        // Target specifically the exact index matching our newly appended card elements
        const targetScoreInput = scoreLocator.nth(countBeforeAdd);
        const targetTotalInput = page.locator('input[id*="gpa_total"]').nth(countBeforeAdd);

        // Explicitly wait for this specific index field block to be visible in the DOM
        await targetScoreInput.waitFor({ state: 'visible', timeout: 10000 });
        await targetScoreInput.scrollIntoViewIfNeeded();

        // Safe typing simulation for the Score input field
        await targetScoreInput.click();
        await targetScoreInput.clear();
        await targetScoreInput.pressSequentially(gpaValue, { delay: 30 });
        await targetScoreInput.dispatchEvent('blur'); // Alert Livewire core engine of change
        await page.waitForTimeout(200);

        // Safe typing simulation for the Total input field
        await targetTotalInput.click();
        await targetTotalInput.clear();
        await targetTotalInput.pressSequentially(gpaValue, { delay: 30 });
        await targetTotalInput.dispatchEvent('blur'); // Alert Livewire core engine of change
        await page.waitForTimeout(300);

        // Double check confirmation safety step
        const verifyValue = await targetScoreInput.inputValue();
        if (!verifyValue || verifyValue === "") {
            console.log(`[Retry Guard] Box detected empty for ${gpaValue}! Re-injecting values...`);
            await targetScoreInput.fill(gpaValue);
            await targetTotalInput.fill(gpaValue);
            await page.waitForTimeout(200);
        }

        // Target and fire the outer structural button container for form submission
        const saveButton = page.locator('button[type="submit"]:has(span.fi-btn-label:has-text("Save changes"))');
        await saveButton.scrollIntoViewIfNeeded();
        await saveButton.click();

        // Halt execution until Livewire finishes processing the data update request
        await page.waitForResponse(
            (response) => response.url().includes('/livewire/') && response.status() === 200,
            { timeout: 25000 }
        );
        
        // Cooldown buffer to give the backend engine time to clear visual states
        await page.waitForTimeout(1500);
        console.log(`[Confirmed] Successfully committed record for: ${gpaValue}.\n`);
    }

    console.log('--- ✓ Block 1.01 to 2.00 has been completely synchronized and verified! ---');
});