import { test, expect } from "@playwright/test";
import{login} from"./Helper/advisor_login.js";

test("Advisor company details page", async ({ page }) => {
  await login(page);
   await page.goto('https://advisebridge.com/advisor/company-details');

  await expect(page).toHaveURL('https://advisebridge.com/advisor/company-details');

 
  await expect(page.getByText('Company Name')).toBeVisible();
  await expect(page.getByText('Owner Name')).toBeVisible();
  await expect(page.getByText('Established')).toBeVisible();
  await expect(page.getByText('Country')).toBeVisible();
  await expect(page.getByText('Address')).toBeVisible();
  await expect(page.getByText('Phone')).toBeVisible();
  await expect(page.getByText('Mobile')).toBeVisible();
});