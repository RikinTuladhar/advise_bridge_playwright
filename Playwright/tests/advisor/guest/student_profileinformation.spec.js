import { test, expect } from "@playwright/test";
import { login } from "./helper/stu_login.js";
import path from 'path';

test("Student Dashboard", async ({ page }) => {

    await login(page);
    const successMsg = page.locator('h3.fi-no-notification-title');

    await page.click("text=Profile Information");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-profile-tab");
    await page.waitForTimeout(2000);

    /* ---Profile Information--- [Date Incomplete]*/
    // await page.locator("#data\\.first_name").fill("Mamata"); // Enter First Name
    // await page.waitForTimeout(2000);
    // await page.locator("#data\\.last_name").fill("Khanal");  // Enter Last Name
    // await page.waitForTimeout(2000);
    // await page.locator("#data\\.phone").fill("9744229321"); // Enter Mobile Number
    // await page.waitForTimeout(2000);
    // // await page.locator('#data\\.dob');
    // // await page.locator('input[x-model.debounce="focusedYear"]').fill('2005'); //Year
    // // await page.waitForTimeout(2000);
    // // await page.locator('select[x-model="focusedMonth"]').selectOption('5');  //Month
    // // await page.waitForTimeout(2000);
    // // await page.locator('[role="option"]', { hasText: '15' }).click(); //Day
    // // await page.waitForTimeout(2000);
    // await page.locator('input[name="data.gender"][value="male"]').check();
    // await page.waitForTimeout(2000);
    // await page.locator('input[name="data.gender"][value="female"]').check();
    // await page.waitForTimeout(2000);
    // await page.fill("#data\\.birth_place", "Simara");  // Enter Birth Place 
    // await page.waitForTimeout(2000);
    // // Save Button & Verify Success Message 
    // await page.locator('button:has-text("Save")').nth(0).click();
    // await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    // await expect(successMsg).toHaveText('Saved Personal Information');
    // await page.waitForTimeout(3000);


    /* ---Address--- [Complete] */
    // await page.click("//button[normalize-space()='Address']");
    // await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-address-tab");
    // await page.waitForTimeout(3000);
    // // Select Country
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
    // // Enter Street
    // await page.locator("#data\\.street").fill("Chabahil");
    // await page.waitForTimeout(2000);
    // // Enter Zip Code
    // await page.locator("#data\\.zip_code").fill("0147");
    // await page.waitForTimeout(2000);
    // // Save Button & Verify Success Message 
    // await page.locator('button:has-text("Save")').nth(1).click();
    // await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    // await expect(successMsg).toHaveText('Saved Address Information');
    // await page.waitForTimeout(3000);


    /* ---Language--- [ Date Incomplete] */
    // await page.click("//button[normalize-space()='Language']");
    // await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-language-tab");
    // await page.waitForTimeout(2000);
    // // Open the English Exam dropdown
    // await page.locator('.choices__inner').nth(3).click();
    // // Option is visible
    // const langOption = page.locator('.choices__list .choices__item--choice', { hasText: 'Pearson' });
    // await langOption.waitFor({ state: 'visible',timeout: 5000  });
    // // Search Input
    // const engSearch = page.getByRole('textbox', { name: 'Select English Exam Type' });
    // await page.waitForTimeout(2000);
    // await engSearch.type('Pearson');
    // await page.waitForTimeout(3000);
    // await engSearch.press('Enter');
    // await expect(page.locator('.choices__inner .choices__item--selectable').nth(3)).toContainText('Pearson');
    // await page.waitForTimeout(1000);
    // // Enter Score
    // await page.locator("#data\\.speaking_score").fill("65");
    // await page.waitForTimeout(1000);
    // await page.locator("#data\\.reading_score").fill("50");
    // await page.waitForTimeout(1000);
    // await page.locator("#data\\.writing_score").fill("50");
    // await page.waitForTimeout(1000);
    // await page.locator("#data\\.listening_score").fill("75");
    // await page.waitForTimeout(1000);
    // await page.locator("#data\\.average_score").fill("80");
    // await page.waitForTimeout(1000);
    // // Exam Date
    // // Save Button & Verify Success Message 
    // await page.locator('button:has-text("Save")').nth(2).click();
    // await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    // await expect(successMsg).toHaveText('Saved Lingual Information');
    // await page.waitForTimeout(3000);


    /* ---GPA & KSE--- [Complete]*/
    // await page.click("//button[normalize-space()='GPA & KSE']");
    // await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-gpa-kse-tab");
    // await page.waitForTimeout(2000);
    // // GPA Scale
    // await page.locator('.choices__inner', { has: page.locator('#data\\.gpa_id') }).click();
    // await page.locator('.choices__list--dropdown .choices__item', { hasText: '0-4' }).click();
    // await page.waitForTimeout(2000);
    // // GPA Score
    // await page.locator('.choices__inner',{ has: page.locator('#data\\.gpa_score_id') }).click();
    // const gpaSearch = page.getByRole('textbox', { name: 'Select GPA Score' });
    // await page.waitForTimeout(1000);
    // await gpaSearch.type('2.5');
    // await page.waitForTimeout(1000);
    // await gpaSearch.press('Enter');
    // await page.waitForTimeout(1000);
    // // KSE
    // await page.locator('.choices__inner', { has: page.locator('#data\\.knowledge_skill_exam_id') }).click();
    // await page.locator('.choices__list--dropdown .choices__item', { hasText: 'GRE' }).click();
    // await page.waitForTimeout(2000);
    // // KSE Score
    // await page.getByRole('spinbutton', { name: 'Knowledge skill exam score' }).fill('350');
    // await page.waitForTimeout(2000);
    // // Save Button & Verify Success Message 
    // await page.locator('button:has-text("Save")').nth(3).click();
    // await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    // await expect(successMsg).toHaveText('Saved GPA & KSE Score Information');
    // await page.waitForTimeout(3000);


    /* ---Academics--- */
    await page.click("//button[normalize-space()='Academics']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-academics-tab");
    await page.waitForTimeout(5000);
    await page.getByRole('textbox', { name: 'Institution name*' }).fill('PadmaKanya Campus');
    await page.waitForTimeout(2000);
    await page.getByRole('textbox', { name: 'Street' }).fill('Bagbazae');
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
    await searchState.type('Madhesh');
    await page.waitForTimeout(3000);
    await searchState.press('Enter');
    await expect(page.locator('.choices__inner .choices__item--selectable').nth(1)).toContainText('Madhesh');
    await page.waitForTimeout(2000);
    // Open City dropdown
    await page.locator('.choices__inner').nth(2).click();
    const searchCity = page.getByRole('textbox', { name: 'Select City' });
    await page.waitForTimeout(2000);
    await searchCity.type('Bara');
    await page.waitForTimeout(3000);
    await searchCity.press('Enter');
    await expect(page.locator('.choices__inner .choices__item--selectable').nth(2)).toContainText('Bara');
    await page.waitForTimeout(2000);
    await page.getByRole('textbox', { name: 'Zip code' }).fill('04461');
    await page.waitForTimeout(2000);
    await page.locator('.choices__list--single').nth(3).click();
    await page.getByRole('option', { name: "Bachelor's Degree" }).click();
    await page.waitForTimeout(2000);
    await page.locator('.choices__list--single').nth(4).click();
    await page.getByRole('option', { name: "2025" }).click();
    await page.waitForTimeout(2000);
    // Save Button & Verify Success Message 
    await page.locator('button:has-text("Save")').nth(4).click();
    await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    await expect(successMsg).toHaveText('Saved Academics Information');
    await page.waitForTimeout(3000);


    /* ---Document--- [Error] */
    // await page.click("//button[normalize-space()='Documents']");
    // await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-documents-tab");
    // await page.waitForTimeout(5000);
    // const fileInputs = page.locator('input[type="file"]');
    // await fileInputs.nth(0).setInputFiles('tests/advisor/guest/upload/photo.jpg');
    // await fileInputs.nth(1).setInputFiles('tests/advisor/guest/upload/photo.jpg');
    // await fileInputs.nth(2).setInputFiles('tests/advisor/guest/upload/empty.pdf');
    // await fileInputs.nth(3).setInputFiles('tests/advisor/guest/upload/photo.jpg');
    // await fileInputs.nth(4).setInputFiles('tests/advisor/guest/upload/photo.jpg');
    // await fileInputs.nth(5).setInputFiles('tests/advisor/guest/upload/photo.jpg');
    // await fileInputs.nth(6).setInputFiles('tests/advisor/guest/upload/photo.jpg');
    // // Save Button & Verify Success Message 
    // await page.locator('button:has-text("Save")').nth(5).click();
    // await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    // await expect(successMsg).toHaveText('Saved Document Information');
    // await page.waitForTimeout(3000);

    /* ---Emergency Contact--- [Complete] */
    // await page.click("//button[normalize-space()='Emergency']");
    // await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-emergency-tab");
    // await page.waitForTimeout(5000);
    // await page.getByRole('textbox', { name: 'Contact name' }).fill('XYZ');
    // await page.waitForTimeout(2000);
    // await page.getByRole('textbox', { name: 'Relationship' }).fill('Bro');
    // await page.waitForTimeout(2000);
    // await page.getByRole('textbox', { name: 'Telephone number' }).fill('012354789');
    // await page.waitForTimeout(2000);
    // await page.getByRole('textbox', { name: 'Email address' }).fill('xyz@gmail.com');
    // await page.waitForTimeout(2000);
    // // Save Button & Verify Success Message 
    // await page.locator('button:has-text("Save")').nth(6).click();
    // await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    // await expect(successMsg).toHaveText('Saved Emergency Contact');
    // await page.waitForTimeout(3000);


    /* ---Consent--- [Complete] */
    // await page.click("//button[normalize-space()='Consent']");
    // await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-consent-tab");
    // await page.waitForTimeout(5000);
    // // Uncheck Consent Checkbox 
    // await page.locator('#data\\.consent_signature').uncheck();    
    // await expect(page.locator('#data\\.consent_signature')).not.toBeChecked(); 
    // await page.waitForTimeout(2000);
    // // Check Consent Checkbox
    // await page.locator('#data\\.consent_signature').check();      
    // await expect(page.locator('#data\\.consent_signature')).toBeChecked();
    // // // Save Button & Verify Success Message 
    // await page.locator('button:has-text("Save")').nth(7).click();
    // await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    // await expect(successMsg).toHaveText('Saved Consent Signature');
    // await page.waitForTimeout(3000);

});
