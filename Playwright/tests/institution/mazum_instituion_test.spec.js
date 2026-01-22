// import { test, expect } from "@playwright/test";

// test("Institution Login Test - Fill Only", async ({ page }) => {
//   // Step 1: Go to the login page
//   await page.goto("https://advisebridge.com/institution/login");

//   // Step 2: Wait for the email field to appear
//   await page.waitForSelector('input[placeholder="Email address"]');

//   // Step 3: Fill in the email
//   await page.fill('input[placeholder="Email address"]', "mazumpaudel02@gmail.com");

//   // Step 4: Fill in the password
//   await page.fill('input[placeholder="Password"]', "advisebridge@123");

//   // Step 5: Wait for 5 seconds to observe the filled fields
//   await page.waitForTimeout(5000);
// });


import { test, expect } from "@playwright/test";

test("Institution Login Test - Fill Only", async ({ page }) => {
  await page.goto("https://advisebridge.com/institution/login");
  await page.waitForLoadState("domcontentloaded");

  // Try using label-based selectors
  await page.getByLabel("Email address").fill("mazumpaudel02@gmail.com");
  await page.getByLabel("Password").fill("advisebridge@123");

  await page.waitForTimeout(5000);
});
