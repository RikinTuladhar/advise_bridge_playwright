/*import { test, expect } from "@playwright/test";
import{login} from"./Helper/advisor_login.js";

test("Create Student using helper", async ({ page }) => {
    await login(page);
    await page.goto('https://advisebridge.com/advisor/students');
    await page.click("text=New Student");
    
    //*Profile Information
    
  await page.fill('#data\\.first_name', 'Rabina');await page.waitForTimeout(2000);
  await page.fill('#data\\.last_name', 'Chalaune');await page.waitForTimeout(2000);
  await page.fill('#data\\.email', 'chalaunrrabina@gmail.com');await page.waitForTimeout(2000);
  await page.fill('#data\\.phone', '9812345678');await page.waitForTimeout(2000);
    await page.getByLabel('DOB').fill('');await page.waitForTimeout(2000);
    await page.getByLabel('Gender').fill('');await page.waitForTimeout(2000);

    await page.getByRole("button", { name: " " }).click();



  });*/

import { test, expect } from "@playwright/test";
import { login } from "./Helper/advisor_login.js";

test("Create Student using helper", async ({ page }) => {
  await login(page);
  await page.goto('https://advisebridge.com/advisor/students');
  await page.click("text=New Student");

  /*
  // Profile Information
  await page.fill('#data\\.first_name', 'Rabina');
  await page.fill('#data\\.last_name', 'Chalaune');
  await page.fill('#data\\.email', 'chmmhgjgvhchjrrab@gmail.com');
  await page.fill('#data\\.phone', '9812345678');
  
  // Date of Birth - Wait for the date picker to be ready
  await page.waitForSelector('.fi-fo-date-time-picker');
  
  // Click the button to open datepicker
  const dateButton = page.locator('.fi-fo-date-time-picker button[x-ref="button"]');
  await dateButton.click();
  
  // Wait for panel to appear (not hidden)
  await page.waitForSelector('.fi-fo-date-time-picker-panel:not([x-cloak])', { 
      state: 'visible',
      timeout: 10000 
  });
  
  const datepickerPanel = page.locator('.fi-fo-date-time-picker-panel');
  
  // Set Year
  await datepickerPanel.locator('input[type="number"]').fill('2000');
  await page.waitForTimeout(300); // Small wait for Alpine.js to process
  
  // Set Month
  await datepickerPanel.locator('select').selectOption('0');
  await page.waitForTimeout(300);
  
  // Select Day
  await datepickerPanel.locator('div[role="grid"] div').filter({ hasText: /^15$/ }).first().click();
  
  // Select Gender
  await page.check('input[type="radio"][value="female"]');
  
  // Click Save
  await page.click('button:has-text("Save")');
await page.waitForTimeout(5000);
   */
  

  // Address
  await page.click("text=Address");
  await page.waitForTimeout(5000);

  
  await page.fill('#data\\.street', '98128');
  await page.fill('#data\\.street', '9809');

  await page.click('button:has-text("Save")');


});