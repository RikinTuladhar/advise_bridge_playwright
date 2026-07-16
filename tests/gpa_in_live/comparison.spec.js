const { test, expect } = require('@playwright/test');

// Set a comfortable timeout since creating 7 scales will take a minute
test.setTimeout(120000); 

test('Step 1: Create Base GPA Scales Sequentially', async ({ page }) => {
    
    // The exact scales based on your Excel sheet headers
    const scalesToCreate = [
        "U.S. 4.0 GPA",
        "Percentage (%)",
        "India 10-Point CGPA",
        "U.S. Letter Grade",
        "Australia 7.0 GPA",
        "Australia Grade",
        "UK Classification"
    ];

    console.log('--- Starting Staging Authentication Flow ---');
    
    // 1. Login using your verified locators for STAGING
    await page.goto('https://staging.advisebridge.com/admin/login');
    await page.fill('input[type="email"]', 'admin@advisebridge.com');
    await page.fill('input[type="password"]', 'admin@advisebridge.com');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');
    console.log('✓ Login Successful');

    // 2. Loop through the array and create each scale
    for (const scale of scalesToCreate) {
        
        // Always start from the main list page to ensure a clean state
        await page.goto('https://staging.advisebridge.com/admin/gpas');
        await page.waitForLoadState('domcontentloaded');
        
        console.log(`[Action] Creating new scale: ${scale}`);

        // Target the specific span label you provided for the "New gpa" CTA
        await page.locator('.fi-btn-label', { hasText: 'New gpa' }).click();
        
        // Wait for Filament to route to the creation form
        await page.waitForURL('**/admin/gpas/create');

        // Target the exact scale input ID you provided from the DOM
        const scaleInput = page.locator('input[id="data.scale"]');
        await scaleInput.waitFor({ state: 'visible' });
        
        // Safe typing simulation
        await scaleInput.click();
        await scaleInput.fill(scale);
        
        // Filament's default form submission button (usually "Create")
        // We use the first submit button on the page
        await page.locator('button[type="submit"]').first().click();

        // Wait for Livewire to process the creation request
        await page.waitForResponse(
            (response) => response.url().includes('/livewire/message') && response.status() === 200
        );
    }

    console.log('✓ All GPA scales created successfully');
});

test('Step 2: Populate 0.00 to 4.00 GPA score/total pairs using Add More', async ({ page }) => {
    const targetGpaList = [];
    for (let i = 0.00; i <= 4.00; i += 0.01) {
        targetGpaList.push(i.toFixed(2));
    }

    console.log('--- Starting GPA mapping flow for 0.00 to 4.00 ---');

    await page.goto('https://staging.advisebridge.com/admin/login');
    await page.fill('input[type="email"]', 'admin@advisebridge.com');
    await page.fill('input[type="password"]', 'admin@advisebridge.com');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');

    await page.goto('https://staging.advisebridge.com/admin/gpas/1/edit');
    await page.waitForLoadState('domcontentloaded');

    const addMoreButton = page.locator('button:has-text("Add More"), button:has(span:text("Add More"))');
    const scoreLocator = page.locator('input[id*="data.gpaScores."][id$=".gpa_score"]');
    const totalLocator = page.locator('input[id*="data.gpaScores."][id$=".gpa_total"]');
    const saveButton = page.locator('button[type="submit"]:has(span.fi-btn-label:has-text("Save changes"))');

    const existingValues = new Set();
    const initiallyPresent = await scoreLocator.count();
    for (let i = 0; i < initiallyPresent; i++) {
        const value = (await scoreLocator.nth(i).inputValue()).trim();
        if (value) existingValues.add(value);
    }

    for (const gpaValue of targetGpaList) {
        if (existingValues.has(gpaValue)) {
            continue;
        }

        await addMoreButton.waitFor({ state: 'visible', timeout: 15000 });
        await addMoreButton.scrollIntoViewIfNeeded();
        await addMoreButton.click();

        const rowIndex = await scoreLocator.count() - 1;
        const targetScoreInput = scoreLocator.nth(rowIndex);
        const targetTotalInput = totalLocator.nth(rowIndex);

        await targetScoreInput.waitFor({ state: 'visible', timeout: 15000 });
        await targetScoreInput.scrollIntoViewIfNeeded();
        await targetScoreInput.fill(gpaValue);
        await targetScoreInput.dispatchEvent('blur');

        await targetTotalInput.waitFor({ state: 'visible', timeout: 15000 });
        await targetTotalInput.fill(gpaValue);
        await targetTotalInput.dispatchEvent('blur');

        await saveButton.scrollIntoViewIfNeeded();
        await saveButton.click();

        await page.waitForResponse(
            (response) => response.url().includes('/livewire/') && response.status() === 200,
            { timeout: 25000 }
        );

        existingValues.add(gpaValue);
        await page.waitForTimeout(300);
    }

    console.log('✓ Completed populating 0.00 to 4.00 GPA entries successfully');
});