import { test, expect } from "@playwright/test";
import { login } from "./helper/stu_login.js";

test("Student Dashboard", async ({ page }) => {
    await login(page);  // call the helper function

    await page.click("text=Profile Information");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-profile-tab");
    await page.waitForTimeout(4000);

    //Profile
    //await page.click("//button[normalize-space()='Profile']");
    await page.fill("#data\\.first_name", "Mamata");
    await page.fill("#data\\.last_name", "Khanal");
    await page.fill("#data\\.phone", "974422931");

    /*
    //Click DOB
    await page.click("#data\\.dob");
    await page.selectOption('select[x-model="focusedMonth"]', '2'); // Select month
    await page.click('input[x-model="focusedYear"]', '2005'); // Select year
    await page.locator('div[role="option"]', { hasText: '26' }).click(); //Select day
    */

    // Select Female
    await page.locator('input[name="data.gender"][value="female"]').check();
    await page.fill("#data\\.birth_place", "Kathmandu");
    await page.click("//button[normalize-space()='Save']");

    /*
    //Address
    await page.click("//button[normalize-space()='Address']");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-address-tab");
    await page.waitForTimeout(5000);

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
