import { test, expect } from "@playwright/test";
import { login } from "./helper/stu_login.js";

test("Student Apply Now", async ({ page }) => {

    await login(page);
    await page.click("text=Profile Information");
    await expect(page).toHaveURL("https://www.advisebridge.com/student/students/1478?tab=-profile-tab");
    await page.waitForTimeout(1000);

});
