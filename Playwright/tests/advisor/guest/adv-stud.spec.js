import { test, expect } from "@playwright/test";
import { login } from "./Helper/advisor_login.js";

test("Create Student", async ({ page }) => {
  await login(page);
  await page.goto('https://advisebridge.com/advisor/students');
  await page.click("text=New Student");


  // Profile Information

  //await page.locator('div').filter({ hasText: /^Click here to upload image\.\.\.$/ }).click();
  //await page.getByRole('button', { name: 'Click here to upload image...' }).setInputFiles('4.jpg');
  // await page.getByRole('textbox', { name: 'First name*' }).click();
  // await page.getByRole('textbox', { name: 'First name*' }).fill('akshata');
  // await page.getByRole('textbox', { name: 'Last name*' }).click();
  // await page.getByRole('textbox', { name: 'Last name*' }).fill('nepal');
  // await page.getByRole('textbox', { name: 'Email*' }).click();
  // await page.getByRole('textbox', { name: 'Email*' }).fill('akshatanepal1@gmail.com');
  // await page.getByRole('textbox', { name: 'Mobile number' }).click();
  // await page.getByRole('textbox', { name: 'Mobile number' }).fill('9807654321');
  // await page.getByRole('textbox', { name: 'Date of birth*' }).click();
  // await page.getByRole('spinbutton').fill('2000');
  // await page.getByRole('combobox').selectOption('1');
  // await page.getByRole('option', { name: '15' }).click();
  // await page.getByRole('textbox', { name: 'Birth place' }).click();
  // await page.getByRole('textbox', { name: 'Birth place' }).fill('Kathmandu');
  // await page.getByRole('radio', { name: 'Female' }).check();
  // await page.getByRole('button', { name: 'Save' }).click();
  // Address
  // await page.getByRole('tab', { name: 'Address Incomplete' }).click();
  // await page.goto('https://advisebridge.com/advisor/students/1589/edit?tab=-address-tab');
  // await page.locator('.choices__inner').nth(0).click();
  // const countrySearch = page.getByRole('textbox', { name: 'Select Country' });
  // await page.waitForTimeout(2000);
  // await countrySearch.type('Nepal');
  // await page.waitForTimeout(3000);
  // await countrySearch.press('Enter');
  // await expect(page.locator('.choices__inner .choices__item--selectable').nth(0)).toContainText('Nepal');
  // await page.waitForTimeout(2000);
  // // Select State
  // await page.locator('.choices__inner').nth(1).click();
  // const stateSearch = page.getByRole('textbox', { name: 'Select State' });
  // await page.waitForTimeout(2000);
  // await stateSearch.type('Bagmati');
  // await page.waitForTimeout(3000);
  // await stateSearch.press('Enter');
  // await expect(page.locator('.choices__inner .choices__item--selectable').nth(1)).toContainText('Bagmati');
  // await page.waitForTimeout(2000);
  // // Select City
  // await page.locator('.choices__inner').nth(2).click();
  // const citySearch = page.getByRole('textbox', { name: 'Select City' });
  // await page.waitForTimeout(2000);
  // await citySearch.type('Kathmandu');
  // await page.waitForTimeout(3000);
  // await citySearch.press('Enter');
  // await page.waitForTimeout(2000);
  // await page.getByRole('textbox', { name: 'Street' }).click();
  // await page.getByRole('textbox', { name: 'Street' }).fill('0987');
  // await page.getByRole('textbox', { name: 'Zip code' }).click();
  // await page.getByRole('textbox', { name: 'Zip code' }).fill('7890');
  // await page.getByRole('button', { name: 'Save' }).click();
  // Open Language tab
// await page.getByRole('tab', { name: 'Language Incomplete' }).click();
// await page.goto('https://advisebridge.com/advisor/students/1589/edit?tab=-language-tab');

// // Wait for the dropdown to appear and click it
// const examDropdown = page.locator('.choices__inner').first();
// await examDropdown.waitFor({ state: 'visible', timeout: 15000 });
// await examDropdown.click();

// // Type IELTS in the real input
// const examInput = page.locator('.choices__input--cloned').last();
// await examInput.waitFor({ state: 'visible' });
// await examInput.fill('IELTS');
// await page.keyboard.press('Enter');

// // Scores
// await page.locator("#data\\.speaking_score").fill('6');
// await page.locator("#data\\.reading_score").fill('7');
// await page.locator("#data\\.writing_score").fill('7');
// await page.locator("#data\\.listening_score").fill('6');
// await page.locator("#data\\.average_score").fill('6');

// // Exam Date
// await page.getByRole('textbox', { name: 'Exam date*' }).click();
// await page.getByRole('spinbutton').nth(4).fill('2025');
// await page.getByRole('combobox').nth(1).selectOption('4');
// await page.getByRole('option', { name: '13' }).click();

// // Save
// await page.getByRole('button', { name: 'Save' }).click();

//  await page.getByRole('tab', { name: 'GPA & KSE Incomplete' }).click();
//   await page.goto('https://advisebridge.com/advisor/students/1589/edit?tab=-gpa-kse-tab');
//   await page.locator('div').filter({ hasText: /^Select GPA Scale$/ }).first().click();
//   await page.getByRole('option', { name: '-4' }).click();
//   await page.getByText('Select GPA Score').click();
//   await page.getByRole('textbox', { name: 'Select GPA Score' }).fill('3.25');
//   await page.getByRole('option', { name: '3.25' }).click();
//   await page.locator('div').filter({ hasText: /^Select Knowledge Skill Exam$/ }).first().click();
//   await page.getByRole('option', { name: 'GRE' }).click();
//   await page.getByRole('spinbutton', { name: 'Knowledge skill exam score*' }).click();
//   await page.getByRole('spinbutton', { name: 'Knowledge skill exam score*' }).fill('350');
//   await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole('tab', { name: 'Academics Incomplete' }).click();
  await page.goto('https://advisebridge.com/advisor/students/1589/edit?tab=-academics-tab');
  await page.getByRole('button', { name: 'Add More' }).click();
  await page.getByRole('textbox', { name: 'Institution name*' }).click();
  await page.getByRole('textbox', { name: 'Institution name*' }).fill('VR');
  await page.getByRole('textbox', { name: 'Street' }).click();
  await page.getByRole('textbox', { name: 'Street' }).fill('9087');
  await page.getByText('Select Country').click();
  await page.getByRole('textbox', { name: 'Select Country' }).fill('Nepal');
  await page.getByRole('option', { name: 'Nepal' }).click();
  await page.getByText('Select State').click();
  await page.getByRole('option', { name: 'Bagmati' }).click();
  await page.getByText('Select City').click();
  await page.getByRole('option', { name: 'Kathmandu' }).click();
  await page.getByRole('textbox', { name: 'Zip code' }).click();
  await page.getByRole('textbox', { name: 'Zip code' }).fill('8097');
  await page.getByText('Select level of study').click();
  await page.getByRole('option', { name: 'High School' }).click();
  await page.locator('div').filter({ hasText: /^Select passed year$/ }).first().click();
  await page.getByRole('option', { name: '2025' }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole('tab', { name: 'Documents Incomplete' }).click();
  await page.goto('https://advisebridge.com/advisor/students/1589/edit?tab=-documents-tab');
  await page.getByRole('button', { name: 'Drag & Drop or Click Here .' }).first().click();
  await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('4.jpg');
  await page.getByRole('button', { name: 'Drag & Drop or Click Here .' }).nth(1).click();
  await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('28.jpg');
  await page.getByRole('button', { name: 'Drag & Drop or Click Here .' }).nth(2).click();
  await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('17.jpg');
  await page.getByRole('button', { name: 'Drag & Drop or Click Here .' }).nth(3).click();
  await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('17.jpg');
  await page.getByRole('button', { name: 'Drag & Drop or Click Here .' }).nth(4).click();
  await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('38.jpg');
  await page.getByRole('button', { name: 'Drag & Drop or Click Here .' }).nth(5).click();
  await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('32.jpg');
  await page.locator('div:nth-child(7) > .fi-fo-field-wrp > div > .grid.auto-cols-fr > .grid > .wm-json-media-dropzone').click();
  await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('25.jpg');
  await page.getByRole('button', { name: 'Save' }).click();


  await page.getByRole('tab', { name: 'Emergency Incomplete' }).click();
  await page.goto('https://advisebridge.com/advisor/students/1589/edit?tab=-emergency-tab');
  await page.getByRole('button', { name: 'Add More' }).click();
  await page.getByRole('textbox', { name: 'Contact name' }).click();
  await page.getByRole('textbox', { name: 'Contact name' }).fill('ram');
  await page.getByRole('textbox', { name: 'Relationship' }).click();
  await page.getByRole('textbox', { name: 'Relationship' }).fill('brother');
  await page.getByRole('textbox', { name: 'Telephone number' }).click();
  await page.getByRole('textbox', { name: 'Telephone number' }).fill('9807654321');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('ramaabb@gmail.com');
  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole('tab', { name: 'Consent' }).click();
   await page.goto('https://advisebridge.com/advisor/students/1589/edit?tab=-consent-tab');
  await page.getByRole('button', { name: 'Save' }).click();
});
