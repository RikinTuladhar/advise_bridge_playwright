import { test, expect } from "@playwright/test";
import { login } from "./helper/stu_login.js";

test("Student Profile Information", async ({ page }) => {

    await login(page);
    // const successMsg = page.locator('h3.fi-no-notification-title'); // Success Message
    await page.click("text=Profile Information");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-profile-tab");
    await page.waitForTimeout(1000);

    /* ---Profile Information--- */
    // Upload Profile 
    // await page
    //     .locator('label:has-text("Click here to upload image...")').
    //     setInputFiles('Playwright/tests/advisor/guest/upload/profile.jpg');
    await page.waitForTimeout(1000);
    await page.locator("#data\\.first_name").fill("Mamata");
    await page.waitForTimeout(1000);
    await page.locator("#data\\.last_name").fill("khanal");
    await page.waitForTimeout(1000);
    await page.locator("#data\\.phone").fill("9744558236");
    await page.waitForTimeout(1000);
    // DOB
    await page.locator('#data\\.dob').click();
    const calendar = page.locator('.fi-fo-date-time-picker');
    await calendar.getByRole('spinbutton').fill('2001');
    await page.waitForTimeout(1000);
    await calendar.locator('select[x-model="focusedMonth"]:visible').selectOption({ label: 'June' });
    await page.waitForTimeout(1000);
    await calendar.locator('[role="option"]', { hasText: '12' }).click();
    await page.waitForTimeout(1000);
    // Choose Gender 
    await page.locator('input[name="data.gender"][value="male"]').check();
    await page.waitForTimeout(1000);
    await page.locator('input[name="data.gender"][value="female"]').check();
    await page.waitForTimeout(1000);
    await page.fill("#data\\.birth_place", "Simara");
    await page.waitForTimeout(1000);
    // Save Button & Verify Success Message 
    await page.locator('button:has-text("Save")').nth(0).click();
    // await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    // await expect(successMsg).toHaveText('Saved Personal Information');
    await page.waitForTimeout(4000);


    /* ---Address--- [Complete] */
    await page.click("//button[normalize-space()='Address']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-address-tab");
    await page.waitForTimeout(2000);
    // Select Country
    await page.locator('.choices__inner').nth(0).click();
    const countrySearch = page.getByRole('textbox', { name: 'Select Country' });
    await page.waitForTimeout(1000);
    await countrySearch.type('Nepal');
    await countrySearch.press('Enter');
    // await expect(page.locator('.choices__inner .choices__item--selectable').nth(0)).toContainText('Nepal');
    await page.waitForTimeout(1000);
    // Select State
    await page.locator('.choices__inner').nth(1).click();
    const stateSearch = page.getByRole('textbox', { name: 'Select State' });
    await page.waitForTimeout(1000);
    await stateSearch.type('Bagmati');
    await stateSearch.press('Enter');
    // await expect(page.locator('.choices__inner .choices__item--selectable').nth(1)).toContainText('Bagmati');
    await page.waitForTimeout(1000);
    // Select City
    await page.locator('.choices__inner').nth(2).click();
    const citySearch = page.getByRole('textbox', { name: 'Select City' });
    await page.waitForTimeout(1000);
    await citySearch.type('Kathmandu');
    await citySearch.press('Enter');
    await page.waitForTimeout(1000);
    // Enter Street
    await page.locator("#data\\.street").fill("Chabahil");
    await page.waitForTimeout(1000);
    // Enter Zip Code
    await page.locator("#data\\.zip_code").fill("0147");
    await page.waitForTimeout(1000);
    // Save Button & Verify Success Message 
    await page.locator('button:has-text("Save")').nth(1).click();
    // await successMsg.waitFor({ state: 'visible'});
    // await expect(successMsg).toHaveText('Saved Address Information');
    await page.waitForTimeout(4000);


    /* ---Language--- [Complete] */
    await page.click("//button[normalize-space()='Language']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-language-tab");
    await page.waitForTimeout(2000);
    // Open the English Exam dropdown
    await page.locator('.choices__inner').nth(3).click();
    // Option is visible
    const langOption = page.locator('.choices__list .choices__item--choice', { hasText: 'Pearson' });
    await langOption.waitFor({ state: 'visible', timeout: 5000 });
    // Search Input
    const engSearch = page.getByRole('textbox', { name: 'Select English Exam Type' });
    await page.waitForTimeout(1000);
    await engSearch.type('Pearson');
    await page.waitForTimeout(1000);
    await engSearch.press('Enter');
    await expect(page.locator('.choices__inner .choices__item--selectable').nth(3)).toContainText('Pearson');
    await page.waitForTimeout(1000);
    // Enter Score
    await page.locator("#data\\.speaking_score").fill("55");
    await page.locator("#data\\.reading_score").fill("55");
    await page.locator("#data\\.writing_score").fill("59");
    await page.locator("#data\\.listening_score").fill("56");
    await page.locator("#data\\.average_score").fill("75");
    // Exam Date
    await page.locator('#data\\.exam_date').click();
    const date = page.locator('.fi-fo-date-time-picker-panel');
    await date.getByRole('spinbutton').fill('2005');
    await page.waitForTimeout(1000);
    await date.locator('select[x-model="focusedMonth"]:visible').selectOption({ label: 'July' });
    await page.waitForTimeout(1000);
    await date.locator('[role="option"]:visible', { hasText: '27' }).click();
    await page.waitForTimeout(1000);
    // Save Button & Verify Success Message 
    await page.locator('button:has-text("Save")').nth(2).click();
    // await successMsg.waitFor({ state: 'visible'});
    // await expect(successMsg).toHaveText('Saved Lingual Information');
    await page.waitForTimeout(4000);


    /* ---GPA & KSE--- [Complete]*/
    await page.click("//button[normalize-space()='GPA & KSE']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-gpa-kse-tab");
    await page.waitForTimeout(2000);
    // GPA Scale
    await page.locator('.choices__inner', { has: page.locator('#data\\.gpa_id') }).click();
    await page.locator('.choices__list--dropdown .choices__item', { hasText: '0-4' }).click();
    await page.waitForTimeout(1000);
    // GPA Score
    await page.locator('.choices__inner', { has: page.locator('#data\\.gpa_score_id') }).click();
    const gpaSearch = page.getByRole('textbox', { name: 'Select GPA Score' });
    await page.waitForTimeout(1000);
    await gpaSearch.type('2.5');
    await gpaSearch.press('Enter');
    await page.waitForTimeout(1000);
    // KSE
    await page.locator('.choices__inner', { has: page.locator('#data\\.knowledge_skill_exam_id') }).click();
    await page.locator('.choices__list--dropdown .choices__item', { hasText: 'GRE' }).click();
    await page.waitForTimeout(1000);
    // KSE Score
    await page.getByRole('spinbutton', { name: 'Knowledge skill exam score' }).fill('350');
    await page.waitForTimeout(1000);
    // Save Button & Verify Success Message 
    await page.locator('button:has-text("Save")').nth(3).click();
    // await successMsg.waitFor({ state: 'visible'});
    // await expect(successMsg).toHaveText('Saved GPA & KSE Score Information');
    await page.waitForTimeout(4000);


    /* ---Academics--- [Complete] */
    await page.click("//button[normalize-space()='Academics']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-academics-tab");
    await page.waitForTimeout(2000);
    await page.getByRole('textbox', { name: 'Institution name*' }).fill('PadmaKanya Campus');
    await page.waitForTimeout(1000);
    await page.getByRole('textbox', { name: 'Street' }).fill('Bagbazae');
    await page.waitForTimeout(1000);
    // Open Country dropdown
    await page.locator('.choices__inner').nth(7).click();
    const searchCountry = page.getByRole('textbox', { name: 'Select Country' });
    await page.waitForTimeout(1000);
    await searchCountry.type('Nepal');
    await searchCountry.press('Enter');
    await expect(page.locator('.choices__inner .choices__item--selectable').nth(7)).toContainText('Nepal');
    await page.waitForTimeout(1000);
    // Open State dropdown
    await page.locator('.choices__inner').nth(8).click();
    const searchState = page.getByRole('textbox', { name: 'Select State' });
    await page.waitForTimeout(1000);
    await searchState.type('Madhesh');
    await searchState.press('Enter');
    await expect(page.locator('.choices__inner .choices__item--selectable').nth(8)).toContainText('Madhesh');
    await page.waitForTimeout(1000);
    // Open City dropdown
    await page.locator('.choices__inner').nth(9).click();
    const searchCity = page.getByRole('textbox', { name: 'Select City' });
    await page.waitForTimeout(1000);
    await searchCity.type('Bara');
    await searchCity.press('Enter');
    await expect(page.locator('.choices__inner .choices__item--selectable').nth(9)).toContainText('Bara');
    await page.waitForTimeout(1000);
    await page.getByRole('textbox', { name: 'Zip code' }).fill('04461');
    await page.waitForTimeout(1000);
    await page.locator('.choices__list--single').nth(10).click();
    await page.waitForTimeout(1000);
    await page.getByRole('option', { name: "Bachelor's Degree" }).click();
    await page.locator('.choices__list--single').nth(11).click();
    await page.getByRole('option', { name: "2020" }).click();
    // Save Button & Verify Success Message 
    await page.locator('button:has-text("Save")').nth(4).click();
    // await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    // await expect(successMsg).toHaveText('Saved Academics Information');
    await page.waitForTimeout(4000);


    /* ---Document--- [Complete] */
    await page.click("//button[normalize-space()='Documents']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-documents-tab");
    await page.waitForTimeout(2000);
    const fileInputs = page.locator('input[type="file"]');
    await fileInputs.nth(0).setInputFiles('Playwright/tests/advisor/guest/upload/Empty.pdf');
    await fileInputs.nth(1).setInputFiles('Playwright/tests/advisor/guest/upload/photo.jpg');
    await fileInputs.nth(2).setInputFiles('Playwright/tests/advisor/guest/upload/photo.jpg');
    await fileInputs.nth(3).setInputFiles('Playwright/tests/advisor/guest/upload/Empty.pdf');
    await fileInputs.nth(4).setInputFiles('Playwright/tests/advisor/guest/upload/photo.jpg');
    await fileInputs.nth(5).setInputFiles('Playwright/tests/advisor/guest/upload/Empty.pdf');
    await fileInputs.nth(6).setInputFiles('Playwright/tests/advisor/guest/upload/photo.jpg');
    await fileInputs.nth(7).setInputFiles('Playwright/tests/advisor/guest/upload/photo.jpg');
    await page.waitForTimeout(1000);
    // Save Button & Verify Success Message 
    await page.locator('button:has-text("Save")').nth(5).click();
    // await successMsg.waitFor({ state: 'visible' });
    // await expect(successMsg).toHaveText('Saved Documents ');
    await page.waitForTimeout(4000);


    /* ---Emergency Contact--- [Complete] */
    await page.click("//button[normalize-space()='Emergency']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-emergency-tab");
    await page.waitForTimeout(2000);
    await page.getByRole('textbox', { name: 'Contact name' }).fill('ABCDEFG');
    await page.getByRole('textbox', { name: 'Relationship' }).fill('Brother');
    await page.getByRole('textbox', { name: 'Telephone number' }).fill('012354789');
    await page.getByRole('textbox', { name: 'Email address' }).fill('abc@gmail.com');
    // Save Button & Verify Success Message 
    await page.locator('button:has-text("Save")').nth(6).click();
    // await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    // await expect(successMsg).toHaveText('Saved Emergency Contact');
    await page.waitForTimeout(4000);


    /* ---Consent--- [Complete] */
    await page.click("//button[normalize-space()='Consent']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-consent-tab");
    await page.waitForTimeout(2000);
    // Uncheck Consent Checkbox 
    await page.locator('#data\\.consent_signature').uncheck();
    await expect(page.locator('#data\\.consent_signature')).not.toBeChecked();
    // Check Consent Checkbox
    await page.locator('#data\\.consent_signature').check();
    await expect(page.locator('#data\\.consent_signature')).toBeChecked();
    // Save Button & Verify Success Message 
    await page.locator('button:has-text("Save")').nth(7).click();
    // await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    // await expect(successMsg).toHaveText('Saved Consent Signature');
    await page.waitForTimeout(4000);

});
