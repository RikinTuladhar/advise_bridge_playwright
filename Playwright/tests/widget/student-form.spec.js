import { expect, test } from "@playwright/test";

let page;
const URL = "https://advisebridge.com/widget/search/1";
// Form data stored in an object
const formData = {
  personalInfo: {
    first_name: "First",
    last_name: "Last",
    email: "first_last@gmail.com",
    phone: "9819829839845",
    dob: "2025-12-18",
    gender: "male",
    birth_place: "Kathmandu",
    country_id: "Nepal",
    state_id: "Bagmati",
    city_id: "Bhaktapur",
    zip_code: "4123212",
    street: "Street",
  },
  language: {
    english_exam_id: "IELTS",
    exam_date: "2025-12-19",
    reading_score: "10",
    listening_score: "10",
    writing_score: "10",
    speaking_score: "10",
    average_score: "10",
  },
  gpaKse: {
    gpa_id: "0-4",
    gpa_score_id: "4",
    knowledge_skill_exam_id: "GMAT",
    knowledge_skill_exam_score: "101",
  },
  academicHistory: {
    institution_name: "Institution Name",
    street: "Street",
    year: "2024",
    country: "Nepal",
    level: "High School",
    passing_year: "2025",
  },
  documents: [
    "passport",
    "mark_sheets",
    "cv_resume",
    "english_language_proficiency_certificate",
    "recommendation_letters",
    "financial_documents",
    "other_attachments",
  ],
  filePath: "Playwright/files/widget/passport.pdf",
  emergencyContact: {
    name: "Contact Name",
    phone: "981981981981",
    email: "email@gmail.com",
    relationship: "relationship",
  },
};

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto(URL);
});

test("Form fill up", async () => {
  const firstCard = page.locator("div.grid a").first();
  await firstCard.click();
  await expect(page).toHaveURL(/^https:\/\/advisebridge\.com\/widget\/institutions\/[a-z-]+\/\d+$/);

  const institution_card = page
    .locator("div.grid.grid-cols-1.justify-center.w-full.sm\\:grid-cols-2.gap-6 div")
    .first();
  await institution_card.screenshot({ path: "./screenshots/element.png" });
  const submit_button = institution_card.getByRole("button", { name: "Submit Information" });
  await submit_button.click();

  const modal = page.locator(
    ".bg-white.rounded-2xl.w-full.max-w-5xl.h-\\[85vh\\].flex.flex-col.md\\:flex-row.overflow-hidden.shadow-2xl.animate-fade-in"
  );
  await expect(modal).toBeVisible();

  const next_step = page.getByRole("button", { name: "Next Step" });

  // Fill Personal Info
  await expect(page.getByRole("heading", { name: "Personal Info" })).toBeVisible();
  for (const [key, value] of Object.entries(formData.personalInfo)) {
    const el = page.locator(`input[name='${key}'], select[name='${key}']`);
    if ((await el.count()) > 0) {
      if ((await el.evaluate((node) => node.tagName)) === "SELECT") {
        await el.selectOption(value);
      } else {
        await el.fill(value);
      }
    }
  }
  await next_step.click();

  // Fill Language Info
  await expect(page.getByRole("heading", { name: "Language" })).toBeVisible();
  for (const [key, value] of Object.entries(formData.language)) {
    const el = page.locator(`input[name='${key}'], select[name='${key}']`);
    if ((await el.evaluate((node) => node.tagName)) === "SELECT") {
      await el.selectOption(value);
    } else {
      await el.fill(value);
    }
  }
  await next_step.click();

  // Fill GPA & KSE
  await expect(page.getByRole("heading", { name: "GPA & KSE Score" })).toBeVisible();
  for (const [key, value] of Object.entries(formData.gpaKse)) {
    const el = page.locator(`input[name='${key}'], select[name='${key}']`);
    if ((await el.evaluate((node) => node.tagName)) === "SELECT") {
      await el.selectOption(value);
    } else {
      await el.fill(value);
    }
  }
  await next_step.click();

  // Fill Academic History
  await expect(page.getByRole("heading", { name: "Academic History" }).first()).toBeVisible();
  const academicLocators = [
    page.getByRole("textbox", { name: "School / University" }),
    page.getByRole("textbox").nth(2),
    page.getByRole("textbox").nth(3),
    page.getByRole("combobox").first(),
    page.getByRole("combobox").nth(1),
    page.getByRole("combobox").nth(2),
  ];
  const academicValues = Object.values(formData.academicHistory);
  for (let i = 0; i < academicLocators.length; i++) {
    const el = academicLocators[i];
    if ((await el.evaluate((node) => node.tagName)) === "SELECT") {
      await el.selectOption(academicValues[i]);
    } else {
      await el.fill(academicValues[i]);
    }
  }
  await next_step.click();

  // Upload Documents (multiple file upload)
  await expect(page.getByRole("heading", { name: "Documents" }).first()).toBeVisible();
  for (const inputName of formData.documents) {
    await page
      .locator(`input[name='${inputName}']`)
    //   .setInputFiles([formData.filePath, formData.filePath, formData.filePath]);
      .setInputFiles(formData.filePath);
  }
  await next_step.click();

  // Fill Emergency Contact
  await expect(page.getByRole("heading", { name: "Emergency Contact (Optional)" }).first()).toBeVisible();
  const emergencyLocators = [1, 2, 3, 4].map((n) => page.getByRole("textbox").nth(n));
  const emergencyValues = Object.values(formData.emergencyContact);
  for (let i = 0; i < emergencyLocators.length; i++) {
    await emergencyLocators[i].fill(emergencyValues[i]);
  }
  await page.getByRole("checkbox", { name: "I verify that the above" }).check();
  await page.getByRole("button", { name: "Submit Information" }).last().click();

  // Final Verification
  await page.waitForTimeout(5000);
  await page.waitForSelector('[class*="animate-scale-up"]');
  await expect(page.getByRole("heading", { name: "Information Submitted!" })).toBeVisible();
  await page.screenshot({ path: "./screenshots/final.png" });
});
