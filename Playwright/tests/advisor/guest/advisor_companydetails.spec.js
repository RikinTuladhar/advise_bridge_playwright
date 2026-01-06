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



/*import { test, expect } from "@playwright/test";
import{login} from"./Helper/advisor_login.js";

test("Advisor company details page", async ({ page }) => {
  await login(page);
   await page.goto('https://advisebridge.com/advisor/company-details');

  await expect(page).toHaveURL('https://advisebridge.com/advisor/company-details');

 await page.getByLabel('Company Name').fill('Esewa');
await page.getByLabel('Owner Name').fill('Rabina Chalaune');

// Established is a dropdown

await page
  .locator('#data.established_year')
  .locator('xpath=ancestor::div[contains(@class,"choices")]//div[contains(@class,"choices__inner")]')
  .click();

await page.getByText('2025', { exact: true }).click();


await page.getByLabel('Country').fill('Nepal');
await page.getByLabel('Address').fill('Kathmandu');
await page.getByLabel('Phone').fill('9803387207');
await page.getByLabel('Mobile').fill('9812345678');

await page.getByRole('button', { name: 'Save & Continue' }).click();

 
  /*await expect(page.getByText('Company Name')).toBeVisible({ timeout: 5000 });
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

});*/