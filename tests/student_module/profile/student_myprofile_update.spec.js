import { test, expect } from "@playwright/test";
import { studentLogin } from "../../../helper/login.js";
import { student_profile } from '../../../datas/student_data.js';

test("Student My-Profile", async ({ page }) => {
    await studentLogin(page);
    await page.locator(".fi-avatar").click();
    await page.waitForTimeout(1000);
    await page.locator('a[href$="/student/my-profile"]').click();
    await expect(page).toHaveURL(/\/student\/my-profile$/);
    await page.locator(".fi-avatar").click();
    // My-Profile
    // await page.locator('label:has-text("Click here to upload image...")').setInputFiles(student_profile.profile.image);
    await page.locator("#data\\.first_name").fill(student_profile.profile.firstName);
    await page.waitForTimeout(1000);
    await page.locator("#data\\.last_name").fill(student_profile.profile.lastName);
    await page.waitForTimeout(1000);
    await page.locator("#data\\.email").fill(student_profile.profile.email);
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Update")').nth(0).click();
    // Password 
    await page.locator("#data\\.current_password").fill(student_profile.password.currentpwd);
    await page.waitForTimeout(1000);
    await page.locator("#data\\.new_password").fill(student_profile.password.newpwd);
    await page.waitForTimeout(1000);
    await page.locator("#data\\.new_password_confirmation").fill(student_profile.password.confirmpwd);
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Update")').nth(1).click();
});
