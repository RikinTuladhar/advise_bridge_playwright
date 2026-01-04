import { expect, test } from "@playwright/test";

test("Advisor Login Page", async ({ page }) => 
    {
  await page.goto("https://advisebridge.com/login?tab=advisor");

  await page.click("text=Advisor");
  await page.fill("#email", "chalaunrrabina@gmail.com");
  await page.fill("#password", "bestNepal@123");
  await page.click("//button[normalize-space()='Log in as advisor']");

  await expect(page).toHaveURL("https://advisebridge.com/advisor");

  await page.waitForTimeout(5000);

  // Wait for the element to be visible first
  await page.locator(".fi-avatar").first().waitFor({
    state: "visible",
  })
});
