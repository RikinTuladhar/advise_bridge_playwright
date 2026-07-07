const { test, expect } = require('@playwright/test');

// Keep a solid 15-minute execution limit
test.setTimeout(900000); 

test('Populate missing GPA scales cleanly with Auto-Refresh Strategy (3.01 to 4.00 Block)', async ({ page }) => {
    // 1. Generate target range from 3.01 to 4.00 inclusive (100 total items)
    const targetGpaList = [];
    for (let i = 3.01; i <= 4.00; i += 0.01) {
        targetGpaList.push(i.toFixed(2));
    }

    // Helper function to scan existing page values and return state metrics
    async function scanDashboard(scoreLocator) {
        let count = await scoreLocator.count();
        const foundValues = new Set();
        for (let i = 0; i < count; i++) {
            const val = await scoreLocator.nth(i).inputValue();
            if (val) {
                foundValues.add(parseFloat(val).toFixed(2));
            }
        }
        return { foundValues, count };
    }

    // 2. Authentication Flow
    await page.goto('https://advisebridge.com/admin/login'); 
    await page.fill('input[type="email"]', 'admin@advisebridge.com');
    await page.fill('input[type="password"]', 'X^#P$vCdaZ2KSTJc#rS0');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    // 3. Navigate directly to your GPA configuration view
    const targetEditUrl = 'https://advisebridge.com/admin/gpas/1/edit';
    await page.goto(targetEditUrl); 
    await page.waitForLoadState('domcontentloaded');

    console.log('--- Scanning existing layout values (Initial Scan) ---');
    const scoreLocator = page.locator('input[id*="gpa_score"]');
    let { foundValues: existingGpaValues, count: currentCount } = await scanDashboard(scoreLocator);
    
    console.log(`Initial unique GPA values found: ${existingGpaValues.size}`);
    console.log(`Starting fast sequence loop with dynamic refresh buffer...`);

    let itemsAddedInSession = 0;

    // 4. Run the insertion loop
    for (const gpaValue of targetGpaList) {
        
        // Duplication Guard using local Set memory (Instant lookup) [cite: 223, 233]
        if (existingGpaValues.has(gpaValue)) {
            console.log(`[Skipped] GPA ${gpaValue} already populated.`);
            continue;
        }

        // TRIGGER REFRESH COMPONENT BUFFER: Clear DOM bloat every 15 saves
        if (itemsAddedInSession >= 15) {
            console.log(`\n🔄 [Memory Optimization] Refreshing page to wipe layout lag...`);
            await page.goto(targetEditUrl);
            await page.waitForLoadState('networkidle');
            
            // Re-evaluate the map and structural positions after reload
            const updateState = await scanDashboard(scoreLocator);
            existingGpaValues = updateState.foundValues;
            currentCount = updateState.count;
            itemsAddedInSession = 0; 
            console.log(`🔄 [Memory Optimization] Rescan complete. Clean row index tracking set to: ${currentCount}\n`);
            
            // Fallback check to verify the item wasn't accidentally committed prior to refresh
            if (existingGpaValues.has(gpaValue)) {
                continue;
            }
        }

        console.log(`[Action] Injecting missing entry at row index: ${currentCount} -> GPA: ${gpaValue}`);

        // Click Filament's "Add More" component action button [cite: 28, 135]
        const addMoreButton = page.locator('button:has-text("Add More"), button:has(span:text("Add More"))');
        await addMoreButton.waitFor({ state: 'visible', timeout: 15000 });
        await addMoreButton.scrollIntoViewIfNeeded();
        await addMoreButton.click();
        
        // Target fields exclusively via index calculation relative to when they were generated [cite: 182]
        const targetScoreInput = scoreLocator.nth(currentCount);
        const targetTotalInput = page.locator('input[id*="gpa_total"]').nth(currentCount);

        // Wait explicitly for the unique target index slots to be completely visible [cite: 180]
        await targetScoreInput.waitFor({ state: 'visible', timeout: 15000 });
        await targetScoreInput.scrollIntoViewIfNeeded();

        // Type values sequentially with slight delays to align with Livewire lifecycle events [cite: 183]
        await targetScoreInput.click();
        await targetScoreInput.clear();
        await targetScoreInput.pressSequentially(gpaValue, { delay: 10 });
        await targetScoreInput.dispatchEvent('blur'); // Alert Livewire to map the input data context [cite: 117]
        await page.waitForTimeout(150);

        await targetTotalInput.click();
        await targetTotalInput.clear();
        await targetTotalInput.pressSequentially(gpaValue, { delay: 10 });
        await targetTotalInput.dispatchEvent('blur'); // Alert Livewire to map the input data context [cite: 117]
        await page.waitForTimeout(200);

        // Fallback Retry Guard [cite: 125]
        const verifyValue = await targetScoreInput.inputValue();
        if (!verifyValue || verifyValue === "") {
            await targetScoreInput.fill(gpaValue);
            await targetTotalInput.fill(gpaValue);
            await page.waitForTimeout(150);
        }

        // Locate and click the parent button wrapper for "Save changes" [cite: 142]
        const saveButton = page.locator('button[type="submit"]:has(span.fi-btn-label:has-text("Save changes"))');
        await saveButton.scrollIntoViewIfNeeded();
        await saveButton.click();

        // Force execution pause until the system confirms a successful 200 state sync from Livewire [cite: 122, 123]
        await page.waitForResponse(
            (response) => response.url().includes('/livewire/') && response.status() === 200,
            { timeout: 35000 }
        );
        
        // Wait for the browser network stack to go entirely silent and settle layout shifts [cite: 301]
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); 

        // Update tracking states locally
        existingGpaValues.add(gpaValue);
        currentCount++;
        itemsAddedInSession++;
        
        console.log(`[Confirmed] Successfully saved row parameters for: ${gpaValue}.\n`);
    }

    console.log('--- ✓ Block 3.01 to 4.00 optimization run completed successfully! ---');
});