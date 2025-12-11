import test from "playwright/test";

test("Register for insitution", async ({ page }) => {
  await page.goto("https://advisebridge.com/institution/register");
  await page.getByRole("textbox", { name: "Institution Name*" }).fill("Testing University");
  await page.getByRole("textbox", { name: "Email address*" }).fill("testing.automation.playwright@gmail.com");
  await page.getByRole("textbox", { name: "Password*", exact: true }).fill("testing.automation.playwright@gmail.com");
  await page.getByRole("textbox", { name: "Confirm password*" }).fill("testing.automation.playwright@gmail.com");
  await page.getByRole("button", { name: "Sign up" }).click();
});
