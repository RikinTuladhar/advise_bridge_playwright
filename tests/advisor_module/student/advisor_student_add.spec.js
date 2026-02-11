
// import { test, expect } from "@playwright/test";
// import login, { advisorLogin } from "../../../helper/login.js";

// test("Create Student", async ({ page }) => {
//   await advisorLogin(page);
//   await page.goto('/advisor/students');
//   await page.click("text=New Student");

// // Profile Information

// await page.getByRole('tab', { name: 'Profile Incomplete' }).click();
// await page.goto('https://staging.advisebridge.com/advisor/students/create?tab=-profile-tab');
// //await page.locator('div').filter({ hasText: /^Click here to upload image\.\.\.$/ }).click();
// //await page.getByRole('button', { name: 'Click here to upload image...' }).setInputFiles('21.jpg');
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

// // More specific selector for the month dropdown
// await page.getByRole('tabpanel', { name: 'Profile Information Profile' })
//   .getByRole('combobox')
//   .selectOption('1');

// await page.getByRole('option', { name: '15' }).click();

// await page.getByRole('textbox', { name: 'Birth place' }).click();
// await page.getByRole('textbox', { name: 'Birth place' }).fill('Kathmandu');
// await page.getByRole('radio', { name: 'Female' }).check();
// await page.getByRole('button', { name: 'Save' }).click();

// // Address
// await page.getByRole('tab', { name: 'Address Incomplete' }).click();
// await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-address-tab');
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

// // Open Language tab
// await page.getByRole('tab', { name: 'Language Incomplete' }).click();
// await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-language-tab');

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

// await page.getByRole('tab', { name: 'GPA & KSE Incomplete' }).click();
// await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-gpa-kse-tab');
// await page.locator('div').filter({ hasText: /^Select GPA Scale$/ }).first().click();
// await page.getByRole('option', { name: '-4' }).click();
// await page.getByText('Select GPA Score').click();
// await page.getByRole('textbox', { name: 'Select GPA Score' }).fill('3.25');
// await page.getByRole('option', { name: '3.25' }).click();
// await page.locator('div').filter({ hasText: /^Select Knowledge Skill Exam$/ }).first().click();
// await page.getByRole('option', { name: 'GRE' }).click();
// await page.getByRole('spinbutton', { name: 'Knowledge skill exam score*' }).click();
// await page.getByRole('spinbutton', { name: 'Knowledge skill exam score*' }).fill('350');
// await page.getByRole('button', { name: 'Save' }).click();

//   await page.getByRole('tab', { name: 'Academics Incomplete' }).click();
//   await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-academics-tab');
//   await page.getByRole('button', { name: 'Add More' }).click();
//   await page.getByRole('textbox', { name: 'Institution name*' }).click();
//   await page.getByRole('textbox', { name: 'Institution name*' }).fill('VR');
//   await page.getByRole('textbox', { name: 'Street' }).click();
//   await page.getByRole('textbox', { name: 'Street' }).fill('9087');
//   await page.getByText('Select Country').click();
//   await page.getByRole('textbox', { name: 'Select Country' }).fill('Nepal');
//   await page.getByRole('option', { name: 'Nepal' }).click();
//   await page.getByText('Select State').click();
//   await page.getByRole('option', { name: 'Bagmati' }).click();
//   await page.getByText('Select City').click();
//   await page.getByRole('option', { name: 'Kathmandu' }).click();
//   await page.getByRole('textbox', { name: 'Zip code' }).click();
//   await page.getByRole('textbox', { name: 'Zip code' }).fill('8097');
//   await page.getByText('Select level of study').click();
//   await page.getByRole('option', { name: 'High School' }).click();
//   await page.locator('div').filter({ hasText: /^Select passed year$/ }).first().click();
//   await page.getByRole('option', { name: '2025' }).click();
//   await page.getByRole('button', { name: 'Save' }).click();

//   await page.getByRole('tab', { name: 'Documents Incomplete' }).click();
//   await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-documents-tab');
//   await page.getByRole('button', { name: 'Drag & Drop or Click Here .' }).first().click();
//   await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('4.jpg');
//   await page.getByRole('button', { name: 'Drag & Drop or Click Here .' }).nth(1).click();
//   await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('28.jpg');
//   await page.getByRole('button', { name: 'Drag & Drop or Click Here .' }).nth(2).click();
//   await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('17.jpg');
//   await page.getByRole('button', { name: 'Drag & Drop or Click Here .' }).nth(3).click();
//   await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('17.jpg');
//   await page.getByRole('button', { name: 'Drag & Drop or Click Here .' }).nth(4).click();
//   await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('38.jpg');
//   await page.getByRole('button', { name: 'Drag & Drop or Click Here .' }).nth(5).click();
//   await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('32.jpg');
//   await page.locator('div:nth-child(7) > .fi-fo-field-wrp > div > .grid.auto-cols-fr > .grid > .wm-json-media-dropzone').click();
//   await page.getByRole('tabpanel', { name: 'Document Uploads Passport*' }).setInputFiles('25.jpg');
//   await page.getByRole('button', { name: 'Save' }).click();

//   await page.getByRole('tab', { name: 'Emergency Incomplete' }).click();
//   await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-emergency-tab');
//   await page.getByRole('button', { name: 'Add More' }).click();
//   await page.getByRole('textbox', { name: 'Contact name' }).click();
//   await page.getByRole('textbox', { name: 'Contact name' }).fill('ram');
//   await page.getByRole('textbox', { name: 'Relationship' }).click();
//   await page.getByRole('textbox', { name: 'Relationship' }).fill('brother');
//   await page.getByRole('textbox', { name: 'Telephone number' }).click();
//   await page.getByRole('textbox', { name: 'Telephone number' }).fill('9807654321');
//   await page.getByRole('textbox', { name: 'Email address' }).click();
//   await page.getByRole('textbox', { name: 'Email address' }).fill('ramaabb@gmail.com');
//   await page.getByRole('button', { name: 'Save' }).click();

//   await page.getByRole('tab', { name: 'Consent' }).click();
//   await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-consent-tab');
//   await page.getByRole('button', { name: 'Save' }).click();
// });



import { test, expect } from "@playwright/test";
import login, { advisorLogin } from "../../../helper/login.js";
//import { selectDropdown } from "./Helper/selectDropdown.js";

test("Create Student", async ({ page }) => {

  await advisorLogin(page);

  await page.goto('https://staging.advisebridge.com/advisor/students');
  await page.click("text=New Student");

  // ================= PROFILE =================
  await page.getByRole('textbox', { name: 'First name*' }).fill('akshata');
  await page.getByRole('textbox', { name: 'Last name*' }).fill('nepal');
  await page.getByRole('textbox', { name: 'Email*' }).fill('akshatanepal1@gmail.com');
  await page.getByRole('textbox', { name: 'Mobile number' }).fill('9807654321');

  await page.locator('#data\\.dob').click();
  const calendar = page.locator('.fi-fo-date-time-picker');
  await calendar.getByRole('spinbutton').fill('2000');
  await page.waitForTimeout(1000);
  await calendar.locator('select[x-model="focusedMonth"]:visible').selectOption({ label: 'December' });
  await page.waitForTimeout(1000);
  await calendar.locator('[role="option"]', { hasText: '12' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('textbox', { name: 'Birth place' }).fill('Kathmandu');
  await page.getByRole('radio', { name: 'Female' }).check();
  await page.getByRole('button', { name: 'Save' }).click();

  // ================= ADDRESS =================
  await page.getByRole('tab', { name: 'Address Incomplete' }).click();
  await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-address-tab');
  await page.locator('.choices__inner').nth(0).click();
  const countrySearch = page.getByRole('textbox', { name: 'Select Country' });
  await page.waitForTimeout(2000);
  await countrySearch.type('Nepal');
  await page.waitForTimeout(3000);
  await countrySearch.press('Enter');
  // await expect(page.locator('.choices__inner .choices__item--selectable').nth(0)).toContainText('Nepal');
  // await expect(page.locator('.choices is_open is__focused .choices__list choice__list--dropdown').nth(0)).listbox('Nepal');

  await page.waitForTimeout(2000);
  // Select State
  await page.locator('.choices__inner').nth(1).click();
  const stateSearch = page.getByRole('textbox', { name: 'Select State' });
  await page.waitForTimeout(2000);
  await stateSearch.type('Bagmati');
  await page.waitForTimeout(3000);
  await stateSearch.press('Enter');
  await expect(page.locator('.choices__inner .choices__item--selectable').nth(1)).toContainText('Bagmati');
  await page.waitForTimeout(2000);
  // Select City
  await page.locator('.choices__inner').nth(2).click();
  const citySearch = page.getByRole('textbox', { name: 'Select City' });
  await page.waitForTimeout(2000);
  await citySearch.type('Kathmandu');
  await page.waitForTimeout(3000);
  await citySearch.press('Enter');
  await page.waitForTimeout(2000);
  // Enter Street
  await page.locator("#data\\.street").fill("Bagbazar");
  await page.waitForTimeout(2000);
  // Enter Zip Code
  await page.locator("#data\\.zip_code").fill("0147");
  await page.waitForTimeout(2000);
  // Save Button & Verify Success Message 
  await page.locator('button:has-text("Save")').nth(1).click();

  await page.waitForTimeout(3000);


  // Go to Language tab
  await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-language-tab', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  // IELTS dropdown
  const englishExamDropdown = page.locator('.choices__inner').first();
  await englishExamDropdown.scrollIntoViewIfNeeded();
  await englishExamDropdown.click({ force: true });

  await page.locator('.choices__input--cloned').fill('IELTS');
  await page.getByRole('option', { name: 'IELTS' }).click();

  // Scores
  await page.locator('#data\\.speaking_score').fill('6');
  await page.locator('#data\\.reading_score').fill('7');
  await page.locator('#data\\.writing_score').fill('7');
  await page.locator('#data\\.listening_score').fill('6');
  await page.locator('#data\\.average_score').fill('6');

  // Exam Date
  await page.locator('#data\\.exam_date').click();
  const date = page.locator('.fi-fo-date-time-picker-panel');
  await date.getByRole('spinbutton').fill('2025');

  await date.locator('select[x-model="focusedMonth"]:visible').selectOption({ label: 'June' });
  await date.locator('[role="option"]:visible', { hasText: '13' }).click();

  // Save Button & Verify Success Message 
  await page.locator('button:has-text("Save")').nth(2).click();
  await page.waitForTimeout(4000);


  // ================= GPA & KSE =================
  // await page.getByRole('tab', { name: 'GPA & KSE Incomplete' }).click();
  await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-gpa-kse-tab');

  await page.waitForTimeout(2000);
  // GPA Scale
  // await page.locator(".choices__inner", { has: page.locator('#data\\.gpa_id') }).click();
  // await page.locator('.choices__list--dropdown.choices__item", { hasText: 0-4 }).click();
  // await page.waitForTimeout(1000); 

  // Click to open dropdown
  await page.locator('.choices__inner', { has: page.locator('#data\\.gpa_id') }).click();

  // Wait for dropdown to be visible
  await page.locator('.choices__list--dropdown[aria-expanded="true"]').waitFor();

  // Click the specific option
  await page.locator('.choices__item--choice', { hasText: '0-4' }).first().click();

  // GPA Score
  await page.locator('.choices__inner', { has: page.locator('#data\\.gpa_score_id') }).click();
  const gpaSearch = page.getByRole('textbox', { name: 'Select GPA Score' });
  await page.waitForTimeout(1000);
  await gpaSearch.type('2.5');
  await page.waitForTimeout(4000);
  await gpaSearch.press('Enter');
  await page.waitForTimeout(1000);
  // KSE
  await page.locator('.choices__inner', { has: page.locator('#data\\.knowledge_skill_exam_id')}).click();
  await page.locator('.choices__list--dropdown .choices__item', { hasText: 'GRE'}).click();
  await page.waitForTimeout(1000);

  // // Click option - try direct ID
  // await page.locator('#choices--dataknowledge_skill_exam_id-item-choice-2').click();

  // KSE Score
  await page.getByRole('spinbutton', { name: 'Knowledge skill exam score' }).fill('350');
  await page.waitForTimeout(1000);
  // Save Button & Verify Success Message 
  await page.locator('button:has-text("Save")').nth(3).click();
  // await successMsg.waitFor({ state: 'visible'});
  // await expect(successMsg).toHaveText('Saved GPA & KSE Score Information');
  await page.waitForTimeout(3000);

  /* ---Academics--- */
  await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-academics-tab');
  await page.getByRole('textbox', { name: 'Institution name*' }).fill('VR');
  await page.waitForTimeout(2000);
  await page.getByRole('textbox', { name: 'Street' }).fill('9087');
  await page.waitForTimeout(2000);

  // Open Country dropdown
  await page.locator('.choices__inner').nth(0).click();
  const searchCountry = page.getByRole('textbox', { name: 'Select Country' });
  await page.waitForTimeout(2000);
  await searchCountry.type('Nepal');
  await page.waitForTimeout(3000);
  await searchCountry.press('Enter');
  await expect(page.locator('.choices__inner .choices__item--selectable').nth(0)).toContainText('Nepal');
  await page.waitForTimeout(2000);
  // Open State dropdown
  await page.locator('.choices__inner').nth(1).click();
  const searchState = page.getByRole('textbox', { name: 'Select State' });
  await page.waitForTimeout(2000);
  await searchState.type('Bagmati');
  await page.waitForTimeout(3000);
  await searchState.press('Enter');
  await expect(page.locator('.choices__inner .choices__item--selectable').nth(1)).toContainText('Bagmati');
  await page.waitForTimeout(2000);
  // Open City dropdown
  await page.locator('.choices__inner').nth(2).click();
  const searchCity = page.getByRole('textbox', { name: 'Select City' });
  await page.waitForTimeout(2000);
  await searchCity.type('Kathmandu');
  await page.waitForTimeout(3000);
  await searchCity.press('Enter');
  await expect(page.locator('.choices__inner .choices__item--selectable').nth(2)).toContainText('Kathmandu');
  await page.waitForTimeout(2000);
  await page.getByRole('textbox', { name: 'Zip code' }).fill('8097');
  
  await page.locator('.choices__list--single').nth(3).click();
  await page.getByRole('option', { name: "High School" }).click();
 
  await page.locator('.choices__list--single').nth(4).click();
  await page.getByRole('option', { name: "2025" }).click();
  
  // Save Button & Verify Success Message 
  await page.locator('button:has-text("Save")').nth(4).click();

  // ================= DOCUMENTS =================
  await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-documents-tab');
  //await page.waitForLoadState('networkidle');
  const fileInputs = page.locator('Input[type="file"]');
  await fileInputs.nth(0).setInputFiles("files/advisor_images/34.jpg");
  await fileInputs.nth(1).setInputFiles("files/advisor_images/34.jpg");
  await fileInputs.nth(2).setInputFiles("files/advisor_images/34.jpg");
  await fileInputs.nth(3).setInputFiles("files/advisor_images/34.jpg");
  await fileInputs.nth(4).setInputFiles("files/advisor_images/34.jpg");
  await fileInputs.nth(5).setInputFiles("files/advisor_images/34.jpg");
  await fileInputs.nth(6).setInputFiles("files/advisor_images/34.jpg");
  await fileInputs.nth(6).setInputFiles("files/advisor_images/34.jpg");
  //await page.waitForTimeout(5000);
  await page.locator('button:has-text("Save")').nth(5).click();
  //await page.waitForTimeout(2000);
  // ================= EMERGENCY =================
  await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-emergency-tab');

  await page.getByRole('button', { name: 'Add More' }).click();
  await page.getByRole('textbox', { name: 'Contact name' }).fill('ram');
  await page.getByRole('textbox', { name: 'Relationship' }).fill('brother');
  await page.getByRole('textbox', { name: 'Telephone number' }).fill('9807654321');
  await page.getByRole('textbox', { name: 'Email address' }).fill('ramaabb@gmail.com');

  // await page.getByRole('button', { name: "Save" }).nth(6).click();
  await page.locator('button:has-text("Save")').nth(6).click();


  // ================= CONSENT =================
  await page.getByRole('tab', { name: 'Consent' }).click();
  await page.goto('https://staging.advisebridge.com/advisor/students/1606/edit?tab=-consent-tab');
  // await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('button:has-text("Save")').nth(7).click();

});
