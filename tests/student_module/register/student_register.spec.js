import test from "@playwright/test";
import { StudentRegisterPage } from "../../../pages/student/student_registerpage.js";
import { student_validregister } from '../../../datas/student_data.js';

test("Valid Register",async ({page}) => {
    const student_page = new StudentRegisterPage(page);
    await student_page.goToStudentRegisterPage();
    await student_page.registerStudent(student_validregister.firstname, student_validregister.lastname, 
        student_validregister.email, student_validregister.password, student_validregister.confirmpassword);
})

// test("White Space", async ({ page }) => {
//   const student_page = new StudentPage(page);
//   await student_page.goToStudentLoginGuest();
//   await student_page.invalidRegisterWhiteSpace();
// });

// test("Invalid First Name", async ({ page }) => {
//   const student_page = new StudentPage(page);
//   await student_page.goToStudentLoginGuest();
//   await student_page.register();
// });

// test("Invalid Last Name", async ({ page }) => {
//   const student_page = new StudentPage(page);
//   await student_page.goToStudentLoginGuest();
//   await student_page.register();
// });

// test("Invalid Email", async ({ page }) => {
//   const student_page = new StudentPage(page);
//   await student_page.goToStudentLoginGuest();
//   await student_page.register();
// });

// test("Invalid Password and Confirm Passoword", async ({ page }) => {
//   const student_page = new StudentPage(page);
//   await student_page.goToStudentLoginGuest();
//   await student_page.register();
// });


// import { expect, test } from "@playwright/test";
// test("Student Login Page", async ({ page }) => {
//   await page.goto(" /register?tab=student");
//   await page.click("text=Student");
//   await page.getByLabel("First name").fill("Mamata");
//   await page.getByLabel("Last name").fill("Khanal");
//   await page.getByLabel("Email").fill("mamatakhanal@gmail.com");
//   await page.locator('input[name="password"]').fill("Mamat@12");
//   await page.locator('input[name="password_confirmation"]').fill("Mamat@12");
//   await page.getByRole("button", { name: "Create account as student" }).click();
//   await expect(page).toHaveURL("/student/email-verification/prompt");
//   await page.waitForTimeout(5000);
// });


// import { expect, test } from "@playwright/test";
// test("Student Register-1", async ({ page }) => {
//   await page.goto(" https://advisebridge.com/register?tab=student");
//   await page.click("text=Student");
//   await page.getByLabel("First name").fill("Mamata");
//   await page.getByLabel("Last name").fill("Khanal");
//   await page.getByLabel("Email").fill("mamataaa@gmail.com");
//   await page.getByLabel("Password", { exact: true }).fill("Mamat@12");
//   await page.getByLabel("Confirm Password").fill("Mamat@12");
//   await page.getByRole("button", { name: "Create account as student" }).click();
//   await expect(page).toHaveURL("https://advisebridge.com/student/email-verification/prompt");
//   await page.waitForTimeout(5000);
// });
// test("Student Register-2", async ({ page }) => {
//   const student_details = {
//     first_name: "Muskan",
//     last_name: "Khanal",
//     email: "muskankhanal@gmail.com",
//     password: "Kh@n@l00",
//     confirm_password: "Kh@n@l00",
//   };
//   await page.goto("https://www.advisebridge.com/");
//   await page.waitForTimeout(2000);
//   // Student Register
//   await page.getByRole("link", { name: "Register" }).click();
//   await page.waitForURL(/^https:\/\/(?:www\.)?advisebridge\.com\/register\?tab=advisor/);
//   await page.waitForTimeout(2000);
//   await page.getByRole("link", { name: "Student" }).click();
//   await page.waitForURL(/^https:\/\/(?:www\.)?advisebridge\.com\/register\?tab=student/);
//   // Fill Data
//   await page.getByRole("textbox", { name: " First name" }).fill(student_details.first_name);
//   await page.getByRole("textbox", { name: "Last name" }).fill(student_details.last_name);
//   await page.getByRole("textbox", { name: "Email" }).fill(student_details.email);
//   await page.getByRole("textbox", { name: "Password", exact: true }).fill(student_details.password);
//   await page.getByRole("textbox", { name: "Confirm Password" }).fill(student_details.confirm_password);
//   await page.getByRole("button", { name: "Create account as student" }).click();
// });
