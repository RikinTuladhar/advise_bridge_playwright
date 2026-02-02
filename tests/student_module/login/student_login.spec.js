import test from "@playwright/test";
import { StudentPage } from "../../../pages/StudentPage";

test("Valid Login", async ({ page }) => {
  const student_page = new StudentPage(page);
  await student_page.goToStudentLoginGuest();
  await student_page.login();
});

test("Invalid Login Email", async ({ page }) => {
  const student_page = new StudentPage(page);
  await student_page.goToStudentLoginGuest();
  await student_page.register();
});

test("Invalid Login Password", async ({ page }) => {
  const student_page = new StudentPage(page);
  await student_page.goToStudentLoginGuest();
  await student_page.register();
});
