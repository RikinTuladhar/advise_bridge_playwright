import test, { expect } from "playwright/test";
import { institutionData } from "../../datas/institution-data";

test("Login for institution", async ({ page }) => {
  const insitution_data = institutionData;
  await page.goto("https://advisebridge.com/institution/login");
  await page.getByRole("textbox", { name: "Email address*" }).fill(insitution_data.email);
  await page.getByRole("textbox", { name: "Password*" }).fill(insitution_data.password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(
    "https://advisebridge.com/institution/institutions/*?step=information&tab=-information-tab"
  );
});
