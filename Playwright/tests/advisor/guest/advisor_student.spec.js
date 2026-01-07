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
    
    // Profile Information
    await page.fill('#data\\.first_name', 'Rabina');
    await page.fill('#data\\.last_name', 'Chalaune');
    await page.fill('#data\\.email', 'chalaunrrabina1@gmail.com');
    await page.fill('#data\\.phone', '9812345678');
    
    // Date of Birth
    const dobInput = page.locator('#data\\.dob');
    await dobInput.click();
    
    // Use more specific selector for the datepicker panel
    const datepickerPanel = page.locator('.fi-fo-date-time-picker-panel');
    await expect(datepickerPanel).toBeVisible();
    
    // Set Year
    const yearInput = datepickerPanel.locator('input[type="number"]');
    await yearInput.fill('2000');
    
    // Set Month (January = 0)
    const monthSelect = datepickerPanel.locator('select');
    await monthSelect.selectOption('0');
    
    // Select Day - use within the datepicker panel context
    await datepickerPanel.locator('div[role="grid"] div').filter({ hasText: /^15$/ }).first().click();
    
    // Select Gender
    await page.check('input[type="radio"][value="female"]');
    
    // Click Next
    await page.click('button:has-text("Save")');
});