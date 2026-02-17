import { institutionData } from "../datas/institution_data";

export async function institutionLogin(page) {
  const insitution_data = institutionData;
  await page.goto("/institution/login");
  await page.getByRole("textbox", { name: "Email address*" }).fill('teamadvisebridge@gmail.com');
  await page.getByRole("textbox", { name: "Password*" }).fill('teamadvisebridge@gmail.com');
  await page.getByRole("button", { name: "Sign in" }).click();
}


export async function advisorLogin(page) {

  await page.goto("/login?tab=advisor");
  await page.fill("#email", "chalaunrrabina@gmail.com");
  await page.fill("#password", "bestNepal@123");
  await page.click("//button[normalize-space()='Log in as advisor']");
  await page.waitForURL("/advisor");
}


export async function studentLogin(page) {

  await page.goto("/login?tab=student");
  await page.fill("#email", "chalaunrrabina@gmail.com");
  await page.fill("#password", "bestNepal@123");
  await page.click("//button[normalize-space()='Log in as student']");
  await page.waitForURL("/advisor");
}

export async function agentLogin(page) {

  await page.goto("/login?tab=student");
  await page.fill("#email", "chalaunrrabina@gmail.com");
  await page.fill("#password", "bestNepal@123");
  await page.click("//button[normalize-space()='Log in as student']");
  await page.waitForURL("/advisor");
}

export async function adminLogin(page, email, password) {
  await page.goto("/admin");
  await page.getByRole("textbox", { name: "Email address*" }).fill(email);
  await page.getByRole("textbox", { name: "Password*" }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/admin");
}

// import { test, expect } from "@playwright/test";
// import { StudentLoginPage } from "../pages/loginpage";
// // import { waitForSeconds } from "../helpers/commonHelper";

// test("Student Login Page", async ({ page }) => {
//   const studentLogin = new StudentLoginPage(page);

//   await studentLogin.goTo();
//   await studentLogin.loginAsStudent("mamatakhanal08@gmail.com", "mamatakhanal08@gmail.com");

//   await expect(page).toHaveURL("/student");

//   await waitForSeconds(page, 5);
// });

// export async function login(page) {
//   await page.goto("https://www.advisebridge.com/login?tab=student");

//   await page.click("text=Student");
//   await page.fill("#email", "mamatakhanal08@gmail.com");
//   await page.fill("#password", "mamatakhanal08@gmail.com");
//   await page.click("//button[normalize-space()='Log in as student']");

//   await expect(page).toHaveURL("https://www.advisebridge.com/student");
//   await page.waitForTimeout(3000);

// };
