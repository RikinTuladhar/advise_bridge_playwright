import { test, expect } from "@playwright/test";
import { studentLogin } from "../../../helper/login.js";
import { student_data } from '../../../datas/student_data.js';

test("Student Application Not Apply", async ({ page }) => {
    await studentLogin(page);
    await page.waitForTimeout(1000);
    const popup = page.waitForEvent("popup");
    await page.locator(".fi-btn-label", { hasText: "Apply Now" }).click();
    await page.waitForTimeout(3000);
    const newPage = await popup;

    const scrollDown = newPage.locator("div.grid a").nth(0);
    await scrollDown.scrollIntoViewIfNeeded();
    await expect(scrollDown).toBeVisible();
    await newPage.waitForTimeout(3000);

    //Navigate to University
    await newPage.locator("div.grid a").nth(0).click();
    await newPage.waitForTimeout(2000);
    await newPage.getByRole('link', { name: 'Courses offered' }).click();
    // Apply for Bachelor Degree
    await newPage.getByRole("button", { name: "Bachelor's Degree" }).click();
    await newPage.waitForTimeout(2000);
    const courseBachelor = newPage.locator("div.group").nth(1);
    await courseBachelor.getByRole("button", { name: "Apply Now" }).click();
    await newPage.waitForTimeout(2000);
    await newPage.click("//button[normalize-space()='Save and Continue']");
    await newPage.waitForTimeout(5000);
    // Apply for Master Degree
    await newPage.getByRole("button", { name: "Master's Degree" }).click();
    await newPage.waitForTimeout(2000);
    const courseMaster = newPage.locator("div.group").nth(1);
    await courseMaster.getByRole("button", { name: "Apply Now" }).click();
    await newPage.waitForTimeout(2000);
    await newPage.click("//button[normalize-space()='Save and Continue']");
    await newPage.waitForTimeout(5000);
});
