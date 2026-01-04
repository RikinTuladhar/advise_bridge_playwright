import { test, expect } from "@playwright/test";

export async function login(page) {
  

  await page.goto("https://advisebridge.com/login?tab=advisor");
  await page.fill("#email", "chalaunrrabina@gmail.com");
  await page.fill("#password", "bestNepal@123");
  await page.click("//button[normalize-space()='Log in as advisor']");

  await page.waitForURL("https://advisebridge.com/advisor");
};