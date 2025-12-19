import { expect, test } from "@playwright/test";

let page;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto("https://advisebridge.com/widget/search/1");
});

test("Form fill up", async () => {
  const firstCard = page.locator("div.grid a").first();
  await firstCard.click();
  await expect(page).toHaveURL(/^https:\/\/advisebridge\.com\/widget\/institutions\/[a-z-]+\/\d+$/);

  const institution_card = await page
    .locator("div.grid.grid-cols-1.justify-center.w-full.sm\\:grid-cols-2.gap-6")
    .locator("div")
    .first();

  const submit_button = await institution_card.getByRole("button", { name: "Submit Information" });
  await institution_card.screenshot({ path: "./screenshots/element.png" });
  await submit_button.click();
  const modal = page.locator(
    ".bg-white.rounded-2xl.w-full.max-w-5xl.h-\\[85vh\\].flex.flex-col.md\\:flex-row.overflow-hidden.shadow-2xl.animate-fade-in"
  );

  await expect(modal).toBeVisible();

  const next_step = await page.getByRole("button", { name: "Next Step" });
  await expect(page.getByRole("heading", { name: "Personal Info" })).toBeVisible();
  await page.locator("input[name='first_name']").fill("First");
  await page.locator("input[name='last_name']").fill("Last");
  await page.locator("input[name='email']").fill("first_last@gmail.com");
  await page.locator("input[name='phone']").fill("9819829839845");
  await page.locator("input[name='dob']").fill("2025-12-18");
  await page.locator("select[name='gender']").selectOption("male");
  await page.locator("input[name='birth_place']").fill("Kathmandu");
  await page.locator("select[name='country_id']").selectOption("Nepal");
  await page.locator("select[name='state_id']").selectOption("Bagmati");
  await page.locator("select[name='city_id']").selectOption("Bhaktapur");
  await page.locator("input[name='zip_code']").fill("4123212");
  await page.locator("input[name='street']").fill("Street")
  await next_step.click();

  await expect(page.getByRole("heading", { name: "Language" })).toBeVisible();
  await page.locator("select[name='english_exam_id']").selectOption("IELTS")
  await page.locator("input[name='exam_date']").fill("2025-12-19");
  await page.locator("input[name='reading_score']").fill("10");
  await page.locator("input[name='listening_score']").fill("10");

  await page.locator("input[name='writing_score']").fill("10");

  await page.locator("input[name='speaking_score']").fill("10");

  await page.locator("input[name='average_score']").fill("10");
  await next_step.click();
  await expect(page.getByRole("heading", { name: "GPA & KSE Score" })).toBeVisible();
  await page.locator('select[name="gpa_id"]').selectOption("0-4");
  await page.locator('select[name="gpa_score_id"]').selectOption("4");
  await page.locator('select[name="knowledge_skill_exam_id"]').selectOption("GMAT");
  await page.locator('input[name="knowledge_skill_exam_score"]').fill("101");
  await next_step.click();
  await expect(page.getByRole("heading", { name: "Academic History" }).first()).toBeVisible();
  await page.getByRole("textbox", { name: "School / University" }).fill("Institution Name");
  await page.getByRole("textbox").nth(2).fill("Street");
  await page.getByRole("textbox").nth(3).fill("2024");
  await page.getByRole("combobox").first().selectOption("Nepal");
  await page.getByRole("combobox").nth(1).selectOption("High School");
  await page.getByRole("combobox").nth(2).selectOption("2025");
  await next_step.click();
});
