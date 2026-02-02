import test, { expect } from "@playwright/test";
import { adminLogin } from "../../../utils/adminUtils";

test("Admin Advisor Delete", async ({ page }) => {
  const email = "testing.automation.playwright@gmail.com";
  await adminLogin(page, "admin@advisebridge.com", "X^#P$vCdaZ2KSTJc#rS0");
  await page.getByRole("link", { name: "Advisors" }).click();
  await expect(page.getByRole("heading", { name: "Advisors" })).toBeVisible();
  const searchBox = page.getByRole("searchbox", {
    name: "Search",
    exact: true,
  });
  await searchBox.fill("");
  await searchBox.pressSequentially(email, { delay: 100 });
  await searchBox.press("Enter");
  await page.waitForResponse((resp) => resp.url().includes("/livewire/update") && resp.status() === 200, {
    timeout: 15000,
  });
  const row = page.locator("tr", { has: page.locator(`text=${email}`) });
  await expect(row).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: "Delete" }).first().click();
  await page.getByRole("button", { name: "Confirm" }).click();
  await page.waitForResponse((resp) => resp.url().includes("/livewire/update") && resp.status() === 200, {
    timeout: 15000,
  });
  await expect(row).toBeHidden({ timeout: 10000 });
  await page.getByRole("link", { name: "Archived Advisors" }).click();
  const archive_table = page.locator("table > tbody > tr");
  const archived_email = await archive_table.filter({ has: page.locator(`text=${email}`) });
  const deleteBtn = archived_email.locator('[wire\\:click*="delete_permanently"]');
  await deleteBtn.click();
  await expect(archived_email).toBeHidden();
  console.log("✅Deleted successfully");
});
