import { test } from "@playwright/test";
import { studentLogin } from "../../../helper/login.js";
import { StudentApplicationDelete } from "../../../pages/student/student_application_delete.js";

test("Student Application Delete", async ({ page }) => {
  await studentLogin(page);
  const applicationPage = new StudentApplicationDelete(page);
  await applicationPage.goToApplication();
  await applicationPage.scrollToLastActivity();
  await applicationPage.deleteApplication();
  await applicationPage.confirmDeleteApplication();
  // await applicationPage.cancelApplication();
  await applicationPage.deleteSuccess();
});


// test("Student Application Delete ", async ({ page }) => {
//   await studentLogin(page);
//   await page.waitForTimeout(1000);
//   await page.getByRole("link", { name: "Applications" }).click();
//   await expect(page).toHaveURL("/student/applications");
//   await page.waitForTimeout(2000);
//   // Delete Application
//   const scroll = page.locator('th:has-text("Last Activity")');
//   await scroll.scrollIntoViewIfNeeded();
//   await expect(scroll).toBeVisible();
//   await page.waitForTimeout(2000);
//   await page.getByRole("button", { name: "Delete" }).nth(0).click();
//   await page.waitForTimeout(1000);
//   // await page.getByRole('button', { name: 'Cancel' }).click();
//   await page.getByRole("button", { name: "Delete" }).nth(1).click();
//   await page.waitForTimeout(1000);
//   // Delete Message
//   const deleteMsg = page.locator("h3.fi-no-notification-title");
//   await deleteMsg.waitFor({ state: "visible", timeout: 50000 });
//   await expect(deleteMsg).toHaveText("Deleted");
//   await page.waitForTimeout(3000);
// });
