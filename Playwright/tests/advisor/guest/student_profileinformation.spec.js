import { test, expect } from "@playwright/test";
import { login } from "./helper/stu_login.js";

test("Student Dashboard", async ({ page }) => {

    await login(page);

    await page.click("text=Profile Information");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-profile-tab");
    await page.waitForTimeout(3000);

    //Profile Information
    await page.fill("#data\\.first_name", "Akshata");
    await page.waitForTimeout(2000);
    await page.fill("#data\\.last_name", "nepal");
    await page.waitForTimeout(2000);
    await page.fill("#data\\.phone", "9744229321");
    await page.waitForTimeout(2000);

    // await page.locator('#data\\.dob');
    // await page.locator('input[x-model.debounce="focusedYear"]').fill('2005'); //Year
    // await page.waitForTimeout(2000);
    // await page.locator('select[x-model="focusedMonth"]').selectOption('5');  //Month
    // await page.waitForTimeout(2000);
    // await page.locator('[role="option"]', { hasText: '15' }).click(); //Day
    // await page.waitForTimeout(2000);

    await page.locator('input[name="data.gender"][value="female"]').check();
    await page.waitForTimeout(2000);
    await page.fill("#data\\.birth_place", "simara");
    await page.waitForTimeout(2000);
    await page.click("//button[normalize-space()='Save']");
    await page.waitForTimeout(5000);


    // Address
    await page.click("//button[normalize-space()='Address']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-address-tab");
    await page.waitForTimeout(3000);
    await page.locator('.choices__inner').click();
    await page.locator('.choices__list .choices__item', { hasText: 'Nepal' }).click();
    await expect(page.locator('.choices__item--selectable.is-selected')).toHaveText('Nepal');
    await page.waitForTimeout(5000);
   

    //Language
    await page.click("//button[normalize-space()='Language']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-language-tab");
    await page.waitForTimeout(2000);
    await page.locator('.choices__inner').click();
    await page.locator('.choices__list .choices__item', { hasText: 'IELTS' }).click();
    await expect(page.locator('.choices__item--selectable.is-selected')).toHaveText('IELTS');
    await page.waitForTimeout(1000);
    await page.fill('#data\\.speaking_score', '7');
    await page.waitForTimeout(1000);
    await page.fill('#data\\.reading_score', '7');
    await page.waitForTimeout(1000);
    await page.fill('#data\\.writing_score', '7');
    await page.waitForTimeout(1000);
    await page.fill('#data\\.listening_score', '7');
    await page.waitForTimeout(1000);
    await page.fill('#data\\.average_score', '7');
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Save")').nth(2).click();
    await page.waitForTimeout(5000);


    //GPA & KSE
    await page.click("//button[normalize-space()='GPA & KSE']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-gpa-kse-tab");
    await page.waitForTimeout(1000);
    await page.locator('.choices__inner', { has: page.locator('#data\\.gpa_id') }).click();
    await page.locator('.choices__list--dropdown .choices__item', { hasText: '1-100' }).click();
    await page.waitForTimeout(1000);

    await page.locator('button:has-text("Save")').nth(3).click();
    await page.waitForTimeout(5000);

    //Academics
    await page.click("//button[normalize-space()='Academics']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-address-tab");
    await page.waitForTimeout(5000);

    //Documents
    await page.click("//button[normalize-space()='Documents']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-address-tab");
    await page.waitForTimeout(5000);

});
