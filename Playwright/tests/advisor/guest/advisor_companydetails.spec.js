import { test, expect } from "@playwright/test";
import{login} from"./Helper/advisor_login.js";

test("Advisor company details page", async ({ page }) => {
  await login(page);
   await page.goto('https://advisebridge.com/advisor/company-details');

  await expect(page).toHaveURL('https://advisebridge.com/advisor/company-details');

 
  await expect(page.getByText('Company Name')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Owner Name')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Established')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Country')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Address')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Phone')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Mobile')).toBeVisible({ timeout: 5000 });

  await page.getByRole("button", { name: "Save & Continue" }).click();

  await expect(page.getByText('Contact person')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Contact email')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Contact phone')).toBeVisible({ timeout: 5000 });

  await page.getByRole("button", { name: "Save & Continue" }).click();

  await expect(page.getByText('Bank Name*')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Bank Branch*')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Bank account*')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Bank Account Name*')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Bank Routing*')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Bank Swift Code*')).toBeVisible({ timeout: 5000 });

  await page.getByRole("button", { name: "Save Change" }).click();

});