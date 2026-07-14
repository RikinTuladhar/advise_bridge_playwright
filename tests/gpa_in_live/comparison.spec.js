const { test, expect } = require('@playwright/test');

test('Step 1: Login and verify GPA page access', async ({ page }) => {
    
    console.log('--- Starting Login Flow ---');
    
    // 1. Navigate to Live Login
    await page.goto('https://staging.advisebridge.com/admin/login');
    
    // 2. Inject Credentials (using your exact proven locators)
    await page.fill('input[type="email"]', 'admin@advisebridge.com');
    await page.fill('input[type="password"]', 'admin@advisebridge.com');
    
    // 3. Click and wait for dashboard routing
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');
    
    console.log('✓ Login Successful! Dashboard reached.');

    console.log('--- Navigating to Target GPA Page ---');
    
    // 4. Navigate directly to the GPA Edit Layout
    // Note: Update the "1" in the URL if the specific GPA scale you want has a different ID
    const targetUrl = 'https://staging.advisebridge.com/admin/gpas/1/edit';
    await page.goto(targetUrl);
    
    // Wait for the specific Livewire DOM to settle
    await page.waitForLoadState('domcontentloaded');
    
    // 5. Final check: Ensure the browser actually landed on an edit page
    await expect(page).toHaveURL(/.*\/gpas\/.*\/edit/);
    
    console.log(`✓ Success! Reached the target GPA page: ${page.url()}`);
});