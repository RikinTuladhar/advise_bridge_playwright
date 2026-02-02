import { expect, test } from "@playwright/test";

test("Google Login", async ({ page }) => {
  await page.goto("https://accounts.google.com/");
  await page.locator("input[type='email']").fill("testing.automation.playwright@gmail.com");
  await page.getByRole("button", { name: "Next" }).click();
  await page.locator("input[type='password']").fill("testingautomationplaywright");
  await page.getByRole("button", { name: "Next" }).click();

  const verify_message = page.getByText("Verify it’s you", { exact: true });
  if (expect(verify_message).toBeVisible()) {
    console.log("here");
  }

  // await page.goto("https://mail.google.com/mail/u/0/#inbox");
  // await page.waitForURL("https://mail.google.com/mail/u/0/#inbox");

  await page.waitForURL("https://myaccount.google.com/*");
  await page.goto("https://mail.google.com/mail/u/0/#inbox");
});
