import test from "@playwright/test";
import { StudentLoginPage } from "../../../pages/student/loginpage";
import { student_blankfields, student_invalidlogin, student_validlogin }from '../../../datas/student_data.js';

test("Blankfields", async ({ page }) => {
  const student_page = new StudentLoginPage(page);
  await student_page.goToStudentLoginPage();
  await student_page.loginAsStudent(student_blankfields.email, student_blankfields.password);
  await student_page.forTimeout();
});

test("Invalid Login", async ({ page }) => {
  const student_page = new StudentLoginPage(page);
  await student_page.goToStudentLoginPage();
  await student_page.loginAsStudent(student_invalidlogin.email, student_invalidlogin.password);
  await student_page.forTimeout();
});

test("Valid Login", async ({ page }) => {
  const student_page = new StudentLoginPage(page);
  await student_page.goToStudentLoginPage();
  await student_page.loginAsStudent(student_validlogin.email, student_validlogin.password);
  await student_page.successfulLogin();
});


// test("Invalid Login Email", async ({ page }) => {
//   const student_page = new StudentPage(page);
//   await student_page.goToStudentLoginGuest();
//   await student_page.register();
// });

// test("Invalid Login Password", async ({ page }) => {
//   const student_page = new StudentPage(page);
//   await student_page.goToStudentLoginGuest();
//   await student_page.register();
// });
