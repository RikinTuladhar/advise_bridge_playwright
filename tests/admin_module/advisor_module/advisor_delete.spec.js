import test, { expect } from "@playwright/test";
import { admin_data } from "../../../datas/admin_data";
import { advisor_student_delete } from "../../../datas/advisor_data";
import { adminLogin } from "../../../helper/login";


test("Admin Advisor Delete", async ({ page }) => {
  const admin_data_copy = admin_data;
  const advisor_student_delete_copy = advisor_student_delete;
  const email = advisor_student_delete_copy.email;
  await adminLogin(page, admin_data_copy.email, admin_data_copy.password);
  await page.getByRole("link", { name: "Advisors" }).click();
  await page.waitForURL("/admin/advisors");
  await page.getByRole("link", { name: "New advisor" }).click();
  await page.getByRole("textbox", { name: "Name* Company Name" }).fill(advisor_student_delete_copy.company_name);
  await page.getByRole("textbox", { name: "Email*" }).fill(advisor_student_delete_copy.email);
  await page.getByRole("textbox", { name: "Password*" }).fill(advisor_student_delete_copy.password);
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(5000);
  await expect(page.getByRole("heading", { name: "Saved Login Information" })).toBeVisible();
  await page.waitForTimeout(5000);
  await page.getByRole("link", { name: "Advisors" }).click();
  const searchBox = await page.getByRole("searchbox", {
    name: "Search",
    exact: true,
  });
  await searchBox.fill("");
  await page.waitForTimeout(5000);
  await searchBox.pressSequentially(email, { delay: 100 });
  await searchBox.press("Enter");
  await page.waitForResponse((resp) => resp.url().includes("/livewire/update") && resp.status() === 200, {
    timeout: 15000,
  });
  const row = await page.locator("tr", { has: page.locator(`text=${email}`) });
  await expect(row).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: "Delete" }).first().click();
  await page.waitForTimeout(5000);
  await page.getByRole("button", { name: "Delete" }).last().click();
  await page.waitForResponse((resp) => resp.url().includes("/livewire/update") && resp.status() === 200, {
    timeout: 15000,
  });
  // await expect(row).toBeHidden({ timeout: 10000 });
  await page.getByRole("link", { name: "Archived Advisors" }).click();
  await page.getByRole("button").nth(3).click();
  console.log("✅Deleted successfully");
});
