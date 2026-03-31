import { test } from "@playwright/test";
import { StudentLoginPage } from "../../../pages/student/student_loginpage.js";
import { student_login }from '../../../datas/student_data.js';

export async function studentLogin(page) {
  const student_page = new StudentLoginPage(page);
  await student_page.goToStudentLoginPage();
  await student_page.loginAsStudent(student_login.valid.email,student_login.valid.password);
  await student_page.successfulLogin();
}

test("Valid Login", async ({ page }) => {
  await studentLogin(page); 
});

// test("Blankfields", async ({ page }) => {
//   const student_page = new StudentLoginPage(page);
//   await student_page.goToStudentLoginPage();
//   await student_page.loginAsStudent(student_login.blankfields.email, student_login.blankfields.password);
//   await student_page.forTimeout();
// });

// test("Invalid Login", async ({ page }) => {
//   const student_page = new StudentLoginPage(page);
//   await student_page.goToStudentLoginPage();
//   await student_page.loginAsStudent(student_login.invalid.email, student_login.invalid.password);
//   await student_page.forTimeout();
// });
