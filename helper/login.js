import { institutionData } from "../datas/institution_data";

export async function institutionLogin(page) {
  const insitution_data = institutionData;
  await page.goto("/institution/login");
  await page.getByRole("textbox", { name: "Email address*" }).fill(insitution_data.email);
  await page.getByRole("textbox", { name: "Password*" }).fill(insitution_data.password);
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
  await page.fill("#email","teamadvisebridge@gmail.com");
  await page.fill("#password", "teamadvisebridge@gmail.com");
  await page.click("//button[normalize-space()='Log in as student']");
  await page.waitForURL("/student");
}


export async function agentLogin(page) {
  await page.goto("/login?tab=student");
  await page.fill("#email", "teamadvisebridge@gmail.com");
  await page.fill("#password", "Teamadvisebridge00");
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


