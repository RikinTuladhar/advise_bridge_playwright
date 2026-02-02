import test, { expect } from "@playwright/test";
import { adminLogin } from "../../../utils/adminUtils";

test("Admin Advisor Edit", async ({ page }) => {
  const previous_advisor_data = {
    company_name: "Test Company",
    email: "testing.automation.playwright@gmail.com",
    password: "testing.automation.playwright@gmail.com",
    address: "Test Address",
    phone: "9800000000",
    mobile: "9800000000",
    owner_name: "Test Owner",
    contact_person: "Contact Person",
    contanct_email: "contact-email@gmail.com",
    contact_phone: "9859849834",
    bank_name: "Test Bank",
    bank_branch: "Bank branch",
    bank_account: "1234567890",
    bank_account_name: "Suman",
    bank_routing: "9819823456",
    bank_swift_code: "WDBWDBWD",
  };

  const new_advisor_data = {
    company_name: "Test Company new",
    email: "testing.automation.playwright.new@gmail.com",
    password: "testing.automation.playwright.new@gmail.com",
    address: "Test Address new",
    phone: "9800000001",
    mobile: "9800000001",
    owner_name: "Test Owner new",
    contact_person: "Contact Person new",
    contanct_email: "contact-email.new@gmail.com",
    contact_phone: "981981981981",
    bank_name: "Test Bank new",
    bank_branch: "Bank branch new",
    bank_account: "981981981981",
    bank_account_name: "Suman new",
    bank_routing: "9819823457",
    bank_swift_code: "WDBWDBWD new",
  };

  await adminLogin(page, "admin@advisebridge.com", "X^#P$vCdaZ2KSTJc#rS0");
  await page.getByRole("link", { name: "Advisors" }).click();
  await expect(page.getByRole("heading", { name: "Advisors" })).toBeVisible();
  const searchBox = page.getByRole("searchbox", {
    name: "Search",
    exact: true,
  });
  await searchBox.fill("");
  await searchBox.pressSequentially(previous_advisor_data.email, { delay: 100 });
  await searchBox.press("Enter");
  await page.waitForResponse((resp) => resp.url().includes("/livewire/update") && resp.status() === 200, {
    timeout: 15000,
  });
  const row = await page.locator("tr", { has: page.locator(`text=${previous_advisor_data.email}`) });
  await expect(row).toBeVisible({ timeout: 10000 });
  await row.getByRole("link", { name: "Edit" }).first().click();
  await page.waitForURL(/.*\/admin\/advisors\/\d+\/edit.*/);

  await page.getByRole("tab", { name: "Company Details" }).click();
  await expect(page.getByRole("heading", { name: "Company Details" })).toBeVisible();

  const company_name = await page.getByRole("textbox", { name: "Company Name" });
  await expect(company_name).toHaveValue(previous_advisor_data.company_name);
  company_name.fill(new_advisor_data.company_name);

  const address = await page.getByRole("textbox", { name: "Address" });
  await expect(address).toHaveValue(previous_advisor_data.address);
  address.fill(new_advisor_data.address);

  const owner_name = await page.getByRole("textbox", { name: "Owner name" });
  await expect(owner_name).toHaveValue(previous_advisor_data.owner_name);
  owner_name.fill(new_advisor_data.owner_name);

  const phone = await page.getByRole("textbox", { name: "Phone" });
  await expect(phone).toHaveValue(previous_advisor_data.phone);
  phone.fill(new_advisor_data.phone);

  const mobile = await page.getByRole("textbox", { name: "Mobile" });
  await expect(mobile).toHaveValue(previous_advisor_data.mobile);
  mobile.fill(new_advisor_data.mobile);
  await page.getByRole("button", { name: "Save" }).click();
  console.log("✅ Edited Company details successfully");

  await page.getByRole("tab", { name: "Contact Details" }).click();
  await expect(page.getByRole("heading", { name: "Contact Details" })).toBeVisible();

  const contact_person = await page.getByRole("textbox", { name: "Contact Person" });
  await expect(contact_person).toHaveValue(previous_advisor_data.contact_person);
  contact_person.fill(new_advisor_data.contact_person);

  const contanct_email = await page.getByRole("textbox", { name: "Contact Email" });
  await expect(contanct_email).toHaveValue(previous_advisor_data.contanct_email);
  contanct_email.fill(new_advisor_data.contanct_email);

  const contact_phone = await page.getByRole("textbox", { name: "Contact Phone" });
  await expect(contact_phone).toHaveValue(previous_advisor_data.contact_phone);
  contact_phone.fill(new_advisor_data.contact_phone);
  await page.getByRole("button", { name: "Save" }).click();
  console.log("✅ Edited Contact details successfully");

  await page.getByRole("tab", { name: "Bank Details" }).click();
  await expect(page.getByRole("heading", { name: "Bank Details" })).toBeVisible();

  const bank_name = await page.getByRole("textbox", { name: "Bank name" });
  await expect(bank_name).toHaveValue(previous_advisor_data.bank_name);
  bank_name.fill(new_advisor_data.bank_name);

  const bank_branch = await page.getByRole("textbox", { name: "Bank branch" });
  await expect(bank_branch).toHaveValue(previous_advisor_data.bank_branch);
  bank_branch.fill(new_advisor_data.bank_branch);

  const bank_account = await page.getByRole("textbox", { name: "Bank account", exact: true });
  await expect(bank_account).toHaveValue(previous_advisor_data.bank_account);
  bank_account.fill(new_advisor_data.bank_account);

  const bank_account_name = await page.getByRole("textbox", { name: "Bank account name" });
  await expect(bank_account_name).toHaveValue(previous_advisor_data.bank_account_name);
  bank_account_name.fill(new_advisor_data.bank_account_name);

  const bank_routing = await page.getByRole("textbox", { name: "Bank routing" });
  await expect(bank_routing).toHaveValue(previous_advisor_data.bank_routing);
  bank_routing.fill(new_advisor_data.bank_routing);

  const bank_swift_code = await page.getByRole("textbox", { name: "Bank swift code" });
  await expect(bank_swift_code).toHaveValue(previous_advisor_data.bank_swift_code);
  bank_swift_code.fill(new_advisor_data.bank_swift_code);
  await page.getByRole("button", { name: "Save" }).click();
  console.log("✅ Edited Bank details successfully");
});
