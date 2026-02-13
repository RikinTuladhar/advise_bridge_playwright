import { test, expect } from '@playwright/test';
import login, { advisorLogin } from "../../../helper/login.js";

test('widgets create', async ({ page }) => {
    await advisorLogin(page);

  await page.getByRole('link', { name: 'Widgets' }).click();
  await page.waitForTimeout(3000);

  //await page.goto('https://staging.advisebridge.com/advisor/widgets');
  await page.getByRole('link', { name: 'New widget' }).click();
  await page.waitForTimeout(3000);

  //await page.goto('https://staging.advisebridge.com/advisor/widgets/create');
  await page.locator('div').filter({ hasText: /^Select an option$/ }).first().click();
  await page.waitForTimeout(3000);
  await page.getByRole('option', { name: 'Golden Purple' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await page.waitForTimeout(3000);
  //await page.goto('https://advisebridge.com/advisor/widgets/10/edit');
  await page.getByRole('button', { name: 'Save changes' }).click();

await page.goto('https://staging.advisebridge.com/advisor/widgets');

await page.waitForLoadState('networkidle');

const popupPromise = page.waitForEvent('popup');

await page.getByRole('link', { name: 'Preview', exact: true }).nth(0).click();


const newPage = await popupPromise;

await newPage.waitForLoadState('load');

await newPage.waitForTimeout(1000);

});