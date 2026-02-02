import { expect } from "@playwright/test";

/**
 * Impersonates an advisor given their email.
 * @param {import('@playwright/test').Page} page
 * @param {string} email
 */

export async function adminLogin(page, email, password) {
  await page.goto("/admin");
  await page.getByRole("textbox", { name: "Email address*" }).fill(email);
  await page.getByRole("textbox", { name: "Password*" }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/admin");
}

export async function impersonateAdvisor(page, email) {
  // Step 1: Login
  await page.goto("/admin/login");
  await page.fill("#data\\.email", "admin@advisebridge.com");
  await page.fill("#data\\.password", "X^#P$vCdaZ2KSTJc#rS0");
  await page.click('button[type="submit"]');
  await page.waitForURL("/admin");

  // Step 2: Go to Advisors
  await page.getByRole("link", { name: "Advisors" }).click();

  await expect(page.getByRole("heading", { name: "Advisors" })).toBeVisible();

  // Step 3: Type search value and wait for response
  const searchBox = page.getByRole("searchbox", {
    name: "Search",
    exact: true,
  });

  await searchBox.fill("");

  await searchBox.pressSequentially(email, { delay: 100 });

  await searchBox.press("Enter");

  // Wait for Livewire response
  await page.waitForResponse((resp) => resp.url().includes("/livewire/update") && resp.status() === 200, {
    timeout: 15000,
  });

  // Step 4: Find the <tr> row that contains the email
  const row = page.locator("tr", { has: page.locator(`text=${email}`) });

  // Verify that row appears
  await expect(row).toBeVisible({ timeout: 10000 });

  // Step 5: Inside that row, find the Impersonate button
  const impersonateButton = row.getByRole("button", { name: "Impersonate" });

  // Ensure it's visible before clicking
  await impersonateButton.waitFor({ state: "visible", timeout: 10000 });

  // Step 6: Click the button
  await impersonateButton.click();

  // Step 7: Optional — wait for next page or state change
  await page.waitForLoadState("networkidle");

  console.log(`✅ Successfully impersonated ${email}`);
}

export async function impersonateStudent(page, email) {
  // Step 1: Login
  await page.goto("/admin/login");
  await page.fill("#data\\.email", "admin@advisebridge.com");
  await page.fill("#data\\.password", "X^#P$vCdaZ2KSTJc#rS0");
  await page.click('button[type="submit"]');
  await page.waitForURL("/admin");

  // Step 2: Go to Advisors
  await page.getByRole("link", { name: "Students" }).click();
  await expect(page.getByRole("heading", { name: "Students" })).toBeVisible();

  // Step 3: Type search value and wait for response
  const searchBox = page.getByRole("searchbox", {
    name: "Search",
    exact: true,
  });
  await searchBox.fill("");
  await searchBox.pressSequentially(email, { delay: 100 });
  await searchBox.press("Enter");

  // Wait for Livewire response
  await page.waitForResponse((resp) => resp.url().includes("/livewire/update") && resp.status() === 200, {
    timeout: 15000,
  });

  // Step 4: Find the <tr> row that contains the email
  const row = page.locator("tr", { has: page.locator(`text=${email}`) });

  // Verify that row appears
  await expect(row).toBeVisible({ timeout: 10000 });

  // Step 5: Inside that row, find the Impersonate button
  const impersonateButton = row.getByRole("button", { name: "Impersonate" });

  // Ensure it's visible before clicking
  await impersonateButton.waitFor({ state: "visible", timeout: 10000 });

  // Step 6: Click the button
  await impersonateButton.click();

  // Step 7: Optional — wait for next page or state change
  await page.waitForLoadState("networkidle");

  console.log(`✅ Successfully impersonated ${email}`);
}
