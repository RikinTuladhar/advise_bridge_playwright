import test, { expect } from "@playwright/test";
import { adminLogin } from "../../../utils/adminUtils";

test("Admin Advisor Register", async ({ page }) => {
  const advisor_detials = {
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
  await adminLogin(page, "admin@advisebridge.com", "X^#P$vCdaZ2KSTJc#rS0");
  await page.getByRole("link", { name: "Advisors" }).click();
  await page.getByRole("link", { name: "New advisor" }).click();
  await page.waitForURL(/.*\/admin\/advisors\/create.*/);
  await expect(page.getByRole("heading", { name: "Login Details" })).toBeVisible();
  await page.getByRole("textbox", { name: "Name* Company Name" }).fill(advisor_detials.company_name);
  await page.getByRole("textbox", { name: "Email*" }).fill(advisor_detials.email);
  await page.getByRole("textbox", { name: "Password*" }).fill(advisor_detials.password);

  const [response] = await Promise.all([
    page.waitForURL(/.*\/admin\/advisors\/.+\/edit\?tab=-company-details-tab.*/, {
      timeout: 60000,
    }),
    page.getByRole("button", { name: "Save" }).click(),
  ]);

  await expect(page.getByRole("heading", { name: "Company Details" })).toBeVisible();
  await page.getByText("Select Country").click();
  await page.getByRole("textbox", { name: "Select Country" }).click();
  // Assuming 'page' is your Playwright Page object
  const dropdownLocator = page.locator(".choices__list.choices__list--dropdown.is-active");
  const maxWaitTimeMs = 100000; // 10 seconds

  await dropdownLocator.waitFor({
    state: "visible",
    timeout: maxWaitTimeMs,
  });

  console.log("The dropdown list with class 'is-active' is now visible.");
  const countryInput = await page.getByRole("textbox", { name: "Select Country" });
  await countryInput.click();
  await page.waitForSelector("#choices--datacountry_id-item-choice-1");
  expect(page.locator("#choices--datacountry_id-item-choice-1")).toBeVisible();
  //   await countryInput.pressSequentially("Nepal", { timeout: 10000 });
  await page.locator("#choices--datacountry_id-item-choice-1").click();
  await page.getByRole("textbox", { name: "Address" }).fill(advisor_detials.address);
  const selectYear = await page.getByText("Select Year");
  await selectYear.click();
  await page.waitForSelector("#choices--dataestablished_year-item-choice-1");
  expect(page.locator("#choices--dataestablished_year-item-choice-1")).toBeVisible();
  await page.locator("#choices--dataestablished_year-item-choice-1").click();
  await page.getByRole("textbox", { name: "Owner name" }).fill(advisor_detials.owner_name);
  await page.getByRole("textbox", { name: "Phone" }).fill(advisor_detials.phone);
  await page.getByRole("textbox", { name: "Mobile" }).fill(advisor_detials.mobile);
  await page.getByRole("button", { name: "Save" }).click();
  console.log("✅ Company details filled successfully");

  await page.getByRole("tab", { name: "Contact Details" }).click();
  await expect(page.getByRole("heading", { name: "Contact Details" })).toBeVisible();
  await page.getByRole("textbox", { name: "Contact Person" }).fill(advisor_detials.contact_person);
  await page.getByRole("textbox", { name: "Contact Email" }).fill(advisor_detials.contanct_email);
  await page.getByRole("textbox", { name: "Contact Phone" }).fill(advisor_detials.contact_phone);
  await page.getByRole("button", { name: "Save" }).click();
  console.log("✅ Contact details filled successfully");

  await page.getByRole("tab", { name: "Bank Details" }).click();
  await expect(page.getByRole("heading", { name: "Bank Details" })).toBeVisible();
  await page.getByRole("textbox", { name: "Bank name" }).fill(advisor_detials.bank_name);
  await page.getByRole("textbox", { name: "Bank branch" }).fill(advisor_detials.bank_branch);
  await page.getByRole("textbox", { name: "Bank account", exact: true }).fill(advisor_detials.bank_account);
  await page.getByRole("textbox", { name: "Bank account name" }).fill(advisor_detials.bank_account_name);
  await page.getByRole("textbox", { name: "Bank routing" }).fill(advisor_detials.bank_routing);
  await page.getByRole("textbox", { name: "Bank swift code" }).fill(advisor_detials.bank_swift_code);
  await page.getByRole("button", { name: "Save" }).click();
  console.log("✅ Bank details filled successfully");
  console.log("✅ Advisor registered successfully");
});
