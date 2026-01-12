import { test, expect } from "@playwright/test";
import { login } from "./helper/stu_login.js";
import path from 'path';

test("Student Dashboard", async ({ page }) => {

    await login(page);

    await page.click("text=Profile Information");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-profile-tab");
    await page.waitForTimeout(3000);

    // //Profile Information
    // await page.locator("#data\\.first_name").fill("Mamata");
    // await page.waitForTimeout(2000);
    // await page.locator("#data\\.last_name").fill("Khanal");
    // await page.waitForTimeout(2000);
    // await page.locator("#data\\.phone").fill("9744229321");
    // await page.waitForTimeout(2000);
    // // await page.locator('#data\\.dob');
    // // await page.locator('input[x-model.debounce="focusedYear"]').fill('2005'); //Year
    // // await page.waitForTimeout(2000);
    // // await page.locator('select[x-model="focusedMonth"]').selectOption('5');  //Month
    // // await page.waitForTimeout(2000);
    // // await page.locator('[role="option"]', { hasText: '15' }).click(); //Day
    // // await page.waitForTimeout(2000);
    // await page.locator('input[name="data.gender"][value="female"]').check();
    // await page.waitForTimeout(2000);
    // await page.fill("#data\\.birth_place", "simara");
    // await page.waitForTimeout(2000);

    // await page.locator('button:has-text("Save")').nth(0).click();
    // const successMsg = page.locator('h3.fi-no-notification-title');
    // await successMsg.waitFor({ state: 'visible', timeout: 50000 });
    // await expect(successMsg).toHaveText('Saved Personal Information');

    // await page.locator('button:has-text("Save")').nth(0).click();
    // await page.waitForTimeout(5000);


    // Address
    // await page.click("//button[normalize-space()='Address']");
    // await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-address-tab");
    // await page.waitForTimeout(3000);

    // // Locate the country dropdown
    // const countryDropdown = page.locator('.choices', {
    //     has: page.locator('#data\\.country_id')
    // });

    // // Click to open the dropdown
    // await countryDropdown.locator('.choices__inner').click();

    // // Type "Nepal" in the search box
    // const searchInput = countryDropdown.locator('input.choices__input--cloned');
    // await searchInput.fill('Nepal');

    // // Wait for the "Nepal" option to appear and click it
    // const nepalOption = countryDropdown.locator(
    //     '.choices__list--dropdown .choices__item',
    //     { hasText: 'Nepal' }
    // );
    // await expect(nepalOption).toBeVisible();
    // await nepalOption.click();

    // // Assert Nepal is selected
    // const selectedItem = countryDropdown.locator('.choices__list--single .choices__item');
    // await expect(selectedItem).toHaveText('Nepal');
    // await page.waitForTimeout(5000);

    // await page.locator('button:has-text("Save")').nth(1).click();
    // await page.waitForTimeout(5000);


    // Language
    await page.click("//button[normalize-space()='Language']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-language-tab");
    await page.waitForTimeout(2000);
    
    await page.locator('.choices__inner').click();
    await page.locator('.choices__list .choices__item', { hasText: 'IELTS' }).click();
    await expect(page.locator('.choices__item--selectable.is-selected')).toHaveText('IELTS');
    await page.waitForTimeout(1000);
    await page.locator("#data\\.speaking_score").fill("7");
    await page.waitForTimeout(1000);
    await page.locator("#data\\.reading_score").fill("7");
    await page.waitForTimeout(1000);
    await page.locator("#data\\.writing_score").fill("7");
    await page.waitForTimeout(1000);
    await page.locator("#data\\.listening_score").fill("7");
    await page.waitForTimeout(1000);
    await page.locator("#data\\.average_score").fill("7");
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Save")').nth(2).click();
    await page.waitForTimeout(5000);


    // // GPA & KSE
    // await page.click("//button[normalize-space()='GPA & KSE']");
    // await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-gpa-kse-tab");
    // await page.waitForTimeout(2000);
    // await page.locator('.choices__inner', { has: page.locator('#data\\.gpa_id') }).click();
    // await page.locator('.choices__list--dropdown .choices__item', { hasText: '0-4' }).click();
    // await page.waitForTimeout(2000);
    // await page.locator('.choices__inner', { has: page.locator('#data\\.knowledge_skill_exam_id') }).click();
    // await page.locator('.choices__list--dropdown .choices__item', { hasText: 'GRE' }).click();
    // await page.waitForTimeout(2000);
    // await page.getByRole('spinbutton', { name: 'Knowledge skill exam score' }).fill('150');
    // await page.waitForTimeout(2000);
    // await page.locator('button:has-text("Save")').nth(3).click();
    // await page.waitForTimeout(5000);

    // //Academics
    // await page.click("//button[normalize-space()='Academics']");
    // await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-academics-tab");
    // await page.waitForTimeout(5000);

    // await page.getByRole('textbox', { name: 'Institution name*' }).fill('PadmaKanya Campus');
    // await page.waitForTimeout(2000);

    // await page.getByRole('textbox', { name: 'Street' }).fill('Bagbazae');
    // await page.waitForTimeout(2000);

    // await page.locator('.choices__list--single').nth(0).click();
    // await page.getByRole('option', { name: "Iran" }).click();

    // await page.locator('.choices__list--single').nth(1).click();
    // await page.getByRole('option', { name: "Fars" }).click();

    // await page.locator('.choices__list--single').nth(2).click();
    // await page.getByRole('option', { name: "Ahel" }).click();

    // await page.getByRole('textbox', { name: 'Zip code' }).fill('0451');
    // await page.waitForTimeout(2000);

    // await page.locator('.choices__list--single').nth(3).click();
    // await page.getByRole('option', { name: "Bachelor's Degree" }).click();

    // await page.locator('.choices__list--single').nth(4).click();
    // await page.getByRole('option', { name: "2025" }).click();

    // await page.locator('button:has-text("Save")').nth(4).click();
    // await page.waitForTimeout(5000);

    // Document 
    // await page.click("//button[normalize-space()='Documents']");
    // await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-documents-tab");
    // await page.waitForTimeout(5000);
    //const fileInputs = page.locator('input[type="file"]');
    //  await fileInputs.nth(0).setInputFiles('tests/advisor/guest/upload/photo.jpg');
    //  await fileInputs.nth(1).setInputFiles('tests/advisor/guest/upload/photo.jpg');
    //  await fileInputs.nth(2).setInputFiles('tests/advisor/guest/upload/empty.pdf');
    //  await fileInputs.nth(3).setInputFiles('tests/advisor/guest/upload/photo.jpg');
    //  await fileInputs.nth(4).setInputFiles('tests/advisor/guest/upload/photo.jpg');
    //  await fileInputs.nth(5).setInputFiles('tests/advisor/guest/upload/photo.jpg');
    // await fileInputs.nth(6).setInputFiles('tests/advisor/guest/upload/photo.jpg');
    // await page.locator('button:has-text("Save")').nth(5).click();
    // await page.waitForTimeout(5000);

    // // Emergency Contact
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
    // await page.locator('button:has-text("Save")').nth(6).click();
    // await page.waitForTimeout(5000);

    // // Consent
    // await page.click("//button[normalize-space()='Consent']");
    // await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-consent-tab");
    // await page.waitForTimeout(5000);
    // await page.getByRole('checkbox', { name: 'Consent Signature' }).check();
    // await page.locator('button:has-text("Save")').nth(7).click();
    // await page.waitForTimeout(5000);

});
