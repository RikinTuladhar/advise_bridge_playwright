import { expect, test } from "@playwright/test";

export async function login(page) {
  await page.goto("https://www.advisebridge.com/login?tab=student");

  await page.click("text=Student");
  await page.fill("#email", "mamatakhanal08@gmail.com");
  await page.fill("#password", "mamatakhanal08@gmail.com");
  await page.click("//button[normalize-space()='Log in as student']");

  await expect(page).toHaveURL("https://www.advisebridge.com/student");
  await page.waitForTimeout(3000);
  
};