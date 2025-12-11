import test from "playwright/test";

test("Register for insitution", async ({ page }) => {
  const insitution_data = institutionData;

  await page.goto("https://advisebridge.com/institution/register");
  await page.getByRole("textbox", { name: "Institution Name*" }).fill(insitution_data.institution_name);
  await page.getByRole("textbox", { name: "Email address*" }).fill(insitution_data.email);
  await page.getByRole("textbox", { name: "Password*", exact: true }).fill(insitution_data.password);
  await page.getByRole("textbox", { name: "Confirm password*" }).fill(insitution_data.confirm_password);
  await page.getByRole("button", { name: "Sign up" }).click();
});
