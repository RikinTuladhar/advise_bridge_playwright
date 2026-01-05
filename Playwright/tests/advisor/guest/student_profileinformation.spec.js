import { test, expect } from "@playwright/test";
import { login } from "./helper/stu_login.js";

test("Student Dashboard", async ({ page }) => {
    await login(page);  // call the helper function

    await page.click("text=Profile Information");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-profile-tab");
    await page.waitForTimeout(3000);

    //Profile
    await page.fill("#data\\.first_name", "mamata");
    await page.waitForTimeout(2000);
    await page.fill("#data\\.last_name", "khanal");
    await page.waitForTimeout(2000);
    await page.fill("#data\\.phone", "9744229321");
    await page.waitForTimeout(2000);

    /*
    await page.locator('#data\\.dob');
    await page.locator('input[x-model.debounce="focusedYear"]').fill('2005'); //Year
    await page.waitForTimeout(2000);
    await page.locator('select[x-model="focusedMonth"]').selectOption('5');  //Month
    await page.waitForTimeout(2000);
    await page.locator('[role="option"]', { hasText: '15' }).click(); //Day
    await page.waitForTimeout(2000);
    */

    // Select Female
    await page.locator('input[name="data.gender"][value="female"]').check();
    await page.waitForTimeout(2000);
    await page.fill("#data\\.birth_place", "simara");
    await page.waitForTimeout(2000);
    await page.click("//button[normalize-space()='Save']");

    //Address
    await page.click("//button[normalize-space()='Address']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-address-tab");
    await page.waitForTimeout(5000);


    // Click the dropdown to open it
    await page.locator('.choices__inner').click();
    await page.selectOption('#data.country_id', { label: 'Nepal' });




    /*
    //Language
    await page.click("//button[normalize-space()='Language']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-address-tab");
    await page.waitForTimeout(5000);

    //GPA & KSE
    await page.click("//button[normalize-space()='GPA & KSE']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-address-tab");
    await page.waitForTimeout(5000);

    //Academics
    await page.click("//button[normalize-space()='Academics']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-address-tab");
    await page.waitForTimeout(5000);

    //Documents
    await page.click("//button[normalize-space()='Documents']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-address-tab");
    await page.waitForTimeout(5000);

    */


});
