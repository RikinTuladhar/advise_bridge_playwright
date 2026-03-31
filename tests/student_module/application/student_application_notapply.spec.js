import { test } from "@playwright/test";
import { studentLogin } from "../../../helper/login.js";
import { StudentPage, UniversityPage } from "../../../pages/student/student_application_notapply.js";

test("Student Application Not Apply", async ({ page }) => {
   await studentLogin(page);
   const studentPage = new StudentPage(page);
   const popup = page.waitForEvent("popup");
   await studentPage.openNewPage();
   const newPage = await popup;
   // Naviagte to University
   const universityPage = new UniversityPage(newPage);
   await universityPage.selectUniversity();
   await universityPage.clickCoursesOffered();
   // Apply Bachelor
   await universityPage.applyBachelor();
   await universityPage.warningMessage();
   // Apply Master
   await universityPage.applyMaster();
   await universityPage.warningMessage();
});


// // Warning Message Function
// async function warningMessage(newPage) {
//     const warning = await newPage.locator('div.fl-flasher.fl-warning', { timeout: 15000 });
//     await expect(warning).toBeVisible();
//     await expect(warning.locator('.fl-title')).toHaveText('Warning');
//     // await expect(warning.locator('.fl-message')).toHaveText('You are not eligible for this program. GPA requirements not met!');
//     await expect(warning.locator('.fl-progress')).toBeVisible();
//     return warning;
// }
// test("Student Application Not Apply", async ({ page }) => {
//     await studentLogin(page);
//     await page.waitForTimeout(1000);
//     const popup = page.waitForEvent("popup");
//     await page.locator(".fi-btn-label", { hasText: "Apply Now" }).click();
//     await page.waitForTimeout(3000);
//     const newPage = await popup;

//     const scrollDown = newPage.locator("div.grid a").nth(0);
//     await scrollDown.scrollIntoViewIfNeeded();
//     await expect(scrollDown).toBeVisible();
//     await newPage.waitForTimeout(3000);

//     //Navigate to University
//     await newPage.locator("div.grid a").nth(0).click();
//     await newPage.waitForTimeout(2000);
//     await newPage.getByRole('link', { name: 'Courses offered' }).click();
//     // Apply for Bachelor Degree
//     await newPage.getByRole("button", { name: "Bachelor's Degree" }).click();
//     await newPage.waitForTimeout(2000);
//     const courseBachelor = newPage.locator("div.group").nth(1);
//     await courseBachelor.getByRole("button", { name: "Apply Now" }).click();
//     await newPage.waitForTimeout(2000);
//     await newPage.click("//button[normalize-space()='Save and Continue']");
//     await warningMessage(newPage);

//     // Apply for Master Degree
//     await newPage.getByRole("button", { name: "Master's Degree" }).click();
//     await newPage.waitForTimeout(2000);
//     const courseMaster = newPage.locator("div.group").nth(1);
//     await courseMaster.getByRole("button", { name: "Apply Now" }).click();
//     await newPage.waitForTimeout(2000);
//     await newPage.click("//button[normalize-space()='Save and Continue']");
//     await warningMessage(newPage);
// });


