import { test, expect } from "@playwright/test";
import { login } from "./Helper/advisor_login.js";

test("Create Student", async ({ page }) => {
  await login(page);
  await page.goto('https://advisebridge.com/advisor/students');
  await page.click("text=New Student");

  
  // Profile Information

  //await page.locator('div').filter({ hasText: /^Click here to upload image\.\.\.$/ }).click();
  //await page.getByRole('button', { name: 'Click here to upload image...' }).setInputFiles('4.jpg');
  await page.getByRole('textbox', { name: 'First name*' }).click();
  await page.getByRole('textbox', { name: 'First name*' }).fill('Rubi');
  await page.getByRole('textbox', { name: 'Last name*' }).click();
  await page.getByRole('textbox', { name: 'Last name*' }).fill('Chalaune');
  await page.getByRole('textbox', { name: 'Email*' }).click();
  await page.getByRole('textbox', { name: 'Email*' }).fill('rubichalaune10@gmail.com');
  await page.getByRole('textbox', { name: 'Mobile number' }).click();
  await page.getByRole('textbox', { name: 'Mobile number' }).fill('9803387207');
  await page.getByRole('textbox', { name: 'Date of birth*' }).click();
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
  await datepickerPanel.locator('select').selectOption('1');
  await page.waitForTimeout(300);
  
  // Select Day
  const day = datepickerPanel.locator('div[role="grid"] div').filter({ hasText: /^4$/ }).first();
  await expect(day).toBeVisible();
  // Select Gender
  await page.check('input[type="radio"][value="female"]');
  
  // Click Save
  await page.click('button:has-text("Save")');
await page.waitForTimeout(5000);
   
  




  /*await page.fill('#data\\.first_name', 'Rabina');
  await page.fill('#data\\.last_name', 'Chalaune');
  await page.fill('#data\\.email', 'chmgjgvhchjrr1@gmail.com');
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
   
  

  // Address
 await page.goto("https://advisebridge.com/advisor/students/1582/edit?tab=-profile-tab")
  await page.click("text=Address");
  await page.waitForTimeout(5000);*/

// Country Dropdown

// await page.waitForTimeout(500);
// //await page.locator('text=Nepal').click(); // Or use: 
// await page.selectOption('#data\\.country', 'Nepal');

// // Wait for State dropdown to load based on country
// await page.waitForTimeout(1000);

// // State/Province Dropdown
// await page.locator('#data\\.state').click();
// await page.waitForTimeout(500);
// //await page.locator('text=Bagmati').click(); // Or use: 
// await page.selectOption('#data\\.state', 'Bagmati');

// // Wait for City dropdown to load based on state
// await page.waitForTimeout(1000);

// // City Dropdown (if it's a dropdown, not text field)
// await page.locator('#data\\.city').click();
// await page.waitForTimeout(500);
// //await page.locator('text=Kathmandu').click();  Or use: 
// await page.selectOption('#data\\.city', 'Kathmandu');

// // Postal Code
//   await page.fill('#data\\.postal_code', '44600');
//   await page.fill('#data\\.street', '98128');
//   await page.fill('#data\\.street', '9809');

//   await page.click('button:has-text("Save")');

  // Language

    /*await page.click("text=Language");
await expect(page).toHaveURL("https://advisebridge.com/advisor/students/1582/edit?tab=-language-tab");
await page.waitForTimeout(2000);

// Click the dropdown to open it
await page.locator('.choices__inner').first().click();
await page.waitForTimeout(500);

// Select IELTS from the dropdown
await page.locator('.choices__list .choices__item').filter({ hasText: 'IELTS' }).click();
await page.waitForTimeout(1000);

// Verify IELTS is selected
await expect(page.locator('.choices__item--selectable.is-selected')).toHaveText('IELTS');

// Fill in the scores
await page.locator("#data\\.speaking_score").fill("7");
await page.waitForTimeout(500);

await page.locator("#data\\.reading_score").fill("6");
await page.waitForTimeout(500);

await page.locator("#data\\.writing_score").fill("7");
await page.waitForTimeout(500);

await page.locator("#data\\.listening_score").fill("6");
await page.waitForTimeout(500);

await page.locator("#data\\.average_score").fill("7");
await page.waitForTimeout(500);

// Click Save button
await page.locator('button:has-text("Save")').click();
await page.waitForTimeout(2000);*/

});

