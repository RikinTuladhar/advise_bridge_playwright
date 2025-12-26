import test from "@playwright/test";
import { StudentPage } from "../../../pages/StudentPage";

test("Valid Register",async ({page}) => {
    const student_page = new StudentPage(page);
    await student_page.goToStudentLoginGuest();
    await student_page.register();
})

test("White Space", async ({ page }) => {
  const student_page = new StudentPage(page);
  await student_page.goToStudentLoginGuest();
  await student_page.invalidRegisterWhiteSpace();
});

test("Invalid First Name", async ({ page }) => {
  const student_page = new StudentPage(page);
  await student_page.goToStudentLoginGuest();
  await student_page.register();
});

test("Invalid Last Name", async ({ page }) => {
  const student_page = new StudentPage(page);
  await student_page.goToStudentLoginGuest();
  await student_page.register();
});

test("Invalid Email", async ({ page }) => {
  const student_page = new StudentPage(page);
  await student_page.goToStudentLoginGuest();
  await student_page.register();
});

test("Invalid Password and Confirm Passoword", async ({ page }) => {
  const student_page = new StudentPage(page);
  await student_page.goToStudentLoginGuest();
  await student_page.register();
});
