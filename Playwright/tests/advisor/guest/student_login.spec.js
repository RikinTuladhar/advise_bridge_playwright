import { expect, test } from "@playwright/test";

test("Student Login Page", async ({ page }) => {
  await page.goto("https://www.advisebridge.com/login?tab=student");

  await page.click("text=Student");
  await page.fill("#email", "mamatakhanal08@gmail.com");
  await page.fill("#password", "mamatakhanal08@gmail.com");
  await page.click("//button[normalize-space()='Log in as student']");

  await expect(page).toHaveURL("https://www.advisebridge.com/student");

  await page.waitForTimeout(5000);

  // Wait for the element to be visible first
  await page.locator(".fi-avatar").first().waitFor({
    state: "visible",
  });

  // Then click
  await page.locator(".fi-avatar").first().click();

  const signOut = page.locator("span.fi-dropdown-list-item-label", { hasText: "Sign out" });
  await signOut.waitFor({ state: "visible" });

  // Click Sign out
  await signOut.click();
});