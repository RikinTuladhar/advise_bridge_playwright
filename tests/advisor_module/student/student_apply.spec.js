
//   import { test, expect } from '@playwright/test';
//   import login, { advisorLogin } from "../../../helper/login.js";

// test('test', async ({ page }) => {
//     await advisorLogin(page);

//  await page.getByRole('link', { name: 'Apply Now' }).click();
//  //const page1 = await page1Promise;
//   await page1.getByRole('button', { name: 'Search by college name...' }).click();
//   await page1.getByText('AAuburn University Montgomery').click();
//   await page1.goto('https://staging.advisebridge.com/search');
//   await page1.getByRole('button', { name: 'Institution Types' }).click();
//   await page1.getByRole('listitem').filter({ hasText: 'University' }).click();
//   await page1.getByRole('button', { name: 'Countries' }).click();
//   await page1.getByText('United States', { exact: true }).click();
//   await page1.getByRole('button', { name: 'States', exact: true }).click();
//   await page1.getByRole('listitem').filter({ hasText: 'California' }).click();
//   await page1.getByRole('button', { name: 'Education Levels *' }).click();
//   await page1.locator('span').filter({ hasText: 'Bachelor\'s Degree' }).click();
//   await page1.getByRole('button', { name: 'Majors *' }).click();
//   await page1.getByRole('listitem').filter({ hasText: 'Actuarial ScienceSTEM (' }).getByRole('radio').check();
//   await page1.getByRole('button', { name: 'Apply' }).click();
//   await page1.getByRole('button', { name: 'Clear All' }).click();
//   await page1.getByRole('button', { name: 'Find based on eligibility' }).click();
//   await page1.getByText('akshata nepalComplete').click();
//   await page1.getByRole('link', { name: 'Private University William' }).click();
//   await page1.getByRole('button', { name: 'Bachelor\'s Degree' }).click();
//   await page1.getByRole('button', { name: 'Create Application' }).nth(1).click();
//   await page1.locator('.flex.gap-3.px-3').first().click();
//   await page1.getByRole('button', { name: 'Apply Now' }).click();
//   await page1.getByRole('button', { name: 'Save and Continue' }).click();
//   await page1.goto('https://staging.advisebridge.com/institutions/william-jessup-university');
// });


import { test, expect } from '@playwright/test';
import login, { advisorLogin } from "../../../helper/login.js";

test('test', async ({ page }) => {
    await advisorLogin(page);

    // Wait for navigation and get the new page context
    const [page1] = await Promise.all([
        page.waitForEvent('popup'), // Wait for new page/tab to open
        page.getByRole('link', { name: 'Apply Now' }).click()
    ]);

    // Now use page1 for subsequent actions
    await page1.getByRole('button', { name: 'Search by college name...' }).click();
    await page1.getByText('AAuburn University Montgomery').click();
    await page.waitForTimeout(6000);

    await page1.goto('https://staging.advisebridge.com/search');
    await page1.getByRole('button', { name: 'Institution Types' }).click();
    await page1.getByRole('listitem').filter({ hasText: 'University' }).click();
    await page1.getByRole('button', { name: 'Countries' }).click();
    await page1.getByText('United States', { exact: true }).click();
    await page1.getByRole('button', { name: 'States', exact: true }).click();
    await page1.getByRole('listitem').filter({ hasText: 'California' }).click();
    await page1.getByRole('button', { name: 'Education Levels *' }).click();
    await page1.locator('span').filter({ hasText: 'Bachelor\'s Degree' }).click();
    await page1.getByRole('button', { name: 'Majors *' }).click();
    await page1.getByRole('listitem').filter({ hasText: 'Actuarial ScienceSTEM (' }).getByRole('radio').check();
    await page1.getByRole('button', { name: 'Apply' }).click();
    await page1.getByRole('button', { name: 'Clear All' }).click();
    await page1.getByRole('button', { name: 'Find based on eligibility' }).click();
    await page1.getByText('akshata nepal').click();
    await page1.getByRole('link', { name: 'Private University William' }).click();
    await page1.getByRole('button', { name: 'Bachelor\'s Degree' }).click();
    await page1.getByRole('button', { name: 'Create Application' }).nth(1).click();
    await page1.locator('.flex.gap-3.px-3').first().click();
    await page1.getByRole('button', { name: 'Apply Now' }).click();
    await page1.getByRole('button', { name: 'Save and Continue' }).click();
    await page1.goto('https://staging.advisebridge.com/institutions/william-jessup-university');
    
    // Close the popup page if needed
    await page1.close();
});

