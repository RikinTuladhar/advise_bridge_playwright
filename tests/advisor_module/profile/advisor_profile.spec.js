import { test } from "@playwright/test";
import { advisor_details } from "../../../datas/advisor_data.js";
import { login } from "../../../helper/advisor_login.js";


test("Advisor company details page", async ({ page }) => {
  const data = advisor_details;
  await login(page);
  await page.goto("/advisor");

  await page.getByRole("link", { name: "Company Details" }).click();
  /*await page.locator('div').filter({hasText: /^Click here to upload image\.\.\.$/ }).click();
await page.getByRole('button', { name: 'Click here to upload image...' }).setInputFiles('13.jpg');*/

  await page.getByRole("textbox", { name: "Company name*" }).click();
  await page.getByRole("textbox", { name: "Company name*" }).fill("esewa");
  await page.locator(".grid.grid-cols-\\[--cols-default\\].lg\\:grid-cols-\\[--cols-lg\\]").click();
  await page.getByRole("textbox", { name: "Owner name*" }).click();
  await page.getByRole("textbox", { name: "Owner name*" }).fill(data.owner_name);
  await page.getByText("20252025Remove item").click();
  await page.getByRole("option", { name: "2025" }).click();
  await page.getByText("NepalNepalRemove item").click();
  await page.getByRole("textbox", { name: "Select Country" }).fill("Nepal");

  await page.getByRole("textbox", { name: "Address*" }).click();
  await page.getByRole("textbox", { name: "Address*" }).fill("kathmandu");
  await page.getByRole("textbox", { name: "Phone" }).click();
  await page.getByRole("textbox", { name: "Phone" }).fill(" 9744229321");
  await page.getByRole("textbox", { name: "Phone" }).click();
  await page.getByRole("textbox", { name: "Phone" }).fill("9744229321");
  await page.getByRole("textbox", { name: "Mobile*" }).click();
  await page.getByRole("textbox", { name: "Mobile*" }).fill("9803387207");
  await page.getByRole("button", { name: "Save & continue" }).click();

  //contact details
  await page.getByRole("textbox", { name: "Contact person*" }).click();
  await page.getByRole("textbox", { name: "Contact person*" }).fill("Rabina Chalaune");
  await page.getByRole("textbox", { name: "Contact email*" }).click();
  await page.getByRole("textbox", { name: "Contact email*" }).fill("chalaunrrabina@gmail.com");
  await page.getByRole("textbox", { name: "Contact phone*" }).click();
  await page.getByRole("textbox", { name: "Contact phone*" }).fill("9803387207");
  await page.getByRole("button", { name: "Save & continue" }).click();
  //Bank details
  await page.getByRole("textbox", { name: "Bank name*" }).click();
  await page.getByRole("textbox", { name: "Bank name*" }).fill("Global bank Ltd.");
  await page.getByRole("textbox", { name: "Bank branch*" }).click();
  await page.getByRole("textbox", { name: "Bank branch*" }).fill("Kamalpokhari");
  await page.getByRole("textbox", { name: "Bank account*" }).click();
  await page.getByRole("textbox", { name: "Bank account*" }).fill("12345678901234");
  await page.getByRole("textbox", { name: "Bank account name*" }).click();
  await page.getByRole("textbox", { name: "Bank account name*" }).fill("Rabina Chalaune");
  await page.getByRole("textbox", { name: "Bank routing*" }).click();
  await page.getByRole("textbox", { name: "Bank routing*" }).fill("00112233");
  await page.getByRole("textbox", { name: "Bank swift code*" }).click();
  await page.getByRole("textbox", { name: "Bank swift code*" }).fill("GLOBNEPKXX");
  await page.getByRole("button", { name: "Save changes" }).click();

  /*await expect(page.getByText('Company Name')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Owner Name')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Established')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Country')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Address')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Phone')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Mobile')).toBeVisible({ timeout: 5000 });

  await page.getByRole("button", { name: "Save & Continue" }).click();

  await expect(page.getByText('Contact person')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Contact email')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Contact phone')).toBeVisible({ timeout: 5000 });

  await page.getByRole("button", { name: "Save & Continue" }).click();

  await expect(page.getByText('Bank Name*')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Bank Branch*')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Bank account*')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Bank Account Name*')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Bank Routing*')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Bank Swift Code*')).toBeVisible({ timeout: 5000 });

  await page.getByRole("button", { name: "Save Change" }).click();*/
});
