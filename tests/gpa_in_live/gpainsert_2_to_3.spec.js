const { test, expect } = require('@playwright/test');

// Set a safe 15-minute timeout for live production environments
test.setTimeout(900000); 

test('Populate missing GPA scales cleanly (2.01 to 3.00 Block - Live Fix)', async ({ page }) => {
    // 1. Generate target range from 2.01 to 3.00 inclusive
    const targetGpaList = [];
    for (let i = 2.01; i <= 3.00; i += 0.01) {
        targetGpaList.push(i.toFixed(2));
    }

    // 2. Authentication Flow (Updated for Live Environment)
    await page.goto('https://advisebridge.com/admin/login'); // Change to your live production domain if different [cite: 294]
    await page.fill('input[type="email"]', 'admin@advisebridge.com');
    await page.fill('input[type="password"]', 'X^#P$vCdaZ2KSTJc#rS0'); // Use secure password management in production
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    // 3. Navigate directly to your GPA configuration view
    await page.goto('https://advisebridge.com/admin/gpas/1/edit'); // Change to your live production ID if different [cite: 294]
    await page.waitForLoadState('domcontentloaded');

    console.log('--- Scanning existing layout values (ONE TIME ONLY) ---');
    
    // SCAN ONCE BEFORE THE LOOP: Read all existing GPAs to prevent lag [cite: 217, 229]
    const scoreLocator = page.locator('input[id*="gpa_score"]');
    let currentCount = await scoreLocator.count();
    const existingGpaValues = new Set();
    
    for (let i = 0; i < currentCount; i++) {
        const val = await scoreLocator.nth(i).inputValue();
        if (val) {
            existingGpaValues.add(parseFloat(val).toFixed(2));
        }
    }
    console.log(`Initial unique GPA values found: ${existingGpaValues.size}`);
    console.log(`Starting fast sequence loop for missing items...`);

    // 4. Run the insertion loop using our static local Set map
    for (const gpaValue of targetGpaList) {
        
        // Duplication Guard using local Set memory (Instant lookup) [cite: 223, 233]
        if (existingGpaValues.has(gpaValue)) {
            console.log(`[Skipped] GPA ${gpaValue} already populated.`);
            continue;
        }

        console.log(`[Action] Injecting missing entry at row index: ${currentCount} -> GPA: ${gpaValue}`);

        // Click Filament's "Add More" component action button [cite: 28, 135]
        const addMoreButton = page.locator('button:has-text("Add More"), button:has(span:text("Add More"))');
        
        // STABILITY WAITING: Ensure the button is fully attached and visible before scrolling or clicking
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
        
        // CRITICAL UPDATE FOR LIVE ENVIRONMENT:
        // Wait for the browser network stack to go entirely silent and settle layout shifts before loops reset
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // 2-second recovery window for heavy DOM rendering operations 

        // Update our structural index count tracking and tracking map locally
        existingGpaValues.add(gpaValue);
        currentCount++;
        
        console.log(`[Confirmed] Successfully saved row parameters for: ${gpaValue}.\n`);
    }

    console.log('--- ✓ Block 2.01 to 3.00 optimization run completed successfully! ---');
});