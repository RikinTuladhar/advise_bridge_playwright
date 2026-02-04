import { test, expect } from "@playwright/test";
import { studentLogin } from "../../../helper/login.js";
import { student_profile, student_address, student_language, student_gpa, student_academic, student_document,student_emergencycontact } from '../../../datas/student_data.js';



test("Student Profile Information", async ({ page }) => {
  await studentLogin(page);
  await page.click("text=Profile Information");
  await expect(page).toHaveURL("/student/students/1604?tab=-profile-tab");
  await page.waitForTimeout(1000);

  /* ---Profile Information--- */
  // Upload Profile
  // await page.locator('label:has-text("Click here to upload image...")').setInputFiles(student_profile.profileImage);
  await page.waitForTimeout(1000);
  await page.locator("#data\\.first_name").fill(student_profile.firstName);
  await page.waitForTimeout(1000);
  await page.locator("#data\\.last_name").fill(student_profile.lastName);
  await page.waitForTimeout(1000);
  await page.locator("#data\\.phone").fill(student_profile.phone);
  await page.waitForTimeout(1000);
  // DOB
  await page.locator("#data\\.dob").click();
  const calendar = page.locator(".fi-fo-date-time-picker");
  await calendar.getByRole("spinbutton").fill(student_profile.dob.year);
  await page.waitForTimeout(1000);
  await calendar.locator('select[x-model="focusedMonth"]:visible').selectOption({ label: student_profile.dob.month });
  await page.waitForTimeout(1000);
  await calendar.locator('[role="option"]', { hasText: student_profile.dob.day }).click();
  await page.waitForTimeout(1000);
  // Choose Gender
  await page.locator(`input[name="data.gender"][value="${student_profile.gender}"]`).check();
  await page.waitForTimeout(1000);
  await page.fill("#data\\.birth_place", student_profile.birthPlace);
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Save")').nth(0).click();
  await page.waitForTimeout(4000);


  /* ---Address--- */
  await page.locator('button[role="tab"]', { hasText: "Address" }).click();
  await expect(page).toHaveURL("/student/students/1604?tab=-address-tab");
  await page.waitForTimeout(2000);
  // Select Country
  await page.locator(".choices__inner").nth(0).click();
  const countrySearch = page.getByRole("textbox", { name: "Select Country" });
  await countrySearch.type(student_address.country);
  await page.waitForTimeout(4000);
  await countrySearch.press("Enter");
  await page.waitForTimeout(1000);
  // Select State
  await page.locator(".choices__inner").nth(1).click();
  const stateSearch = page.getByRole("textbox", { name: "Select State" });
  await stateSearch.type(student_address.state);
  await page.waitForTimeout(4000);
  await stateSearch.press("Enter");
  await page.waitForTimeout(1000);
  // Select City
  await page.locator(".choices__inner").nth(2).click();
  const citySearch = page.getByRole("textbox", { name: "Select City" });
  await citySearch.type(student_address.city);
  await page.waitForTimeout(4000);
  await citySearch.press("Enter");
  await page.waitForTimeout(1000);
  // Enter Street
  await page.locator("#data\\.street").fill(student_address.street);
  await page.waitForTimeout(1000);
  // Enter Zip Code
  await page.locator("#data\\.zip_code").fill(student_address.zipCode);
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Save")').nth(1).click();
  await page.waitForTimeout(4000);

  /* ---Language--- */
  await page.locator('button[role="tab"]', { hasText: "Language" }).click();
  await expect(page).toHaveURL("/student/students/1604?tab=-language-tab");
  await page.waitForTimeout(2000);
  // Open the English Exam dropdown
  await page.locator(".choices__inner").nth(3).click();
  // Option is visible
  const langOption = page.locator(".choices__list .choices__item--choice", { hasText: student_language.englishExam });
  await langOption.waitFor({ state: "visible", timeout: 5000 });
  // Search Input
  const engSearch = page.getByRole("textbox", { name: "Select English Exam Type" });
  await engSearch.type(student_language.englishExam);
  await page.waitForTimeout(4000);
  await engSearch.press("Enter");
  await expect(page.locator(".choices__inner .choices__item--selectable").nth(3)).toContainText(student_language.englishExam);
  await page.waitForTimeout(3000);
  // Enter Score
  await page.locator("#data\\.speaking_score").fill(student_language.speakingScore);
  await page.locator("#data\\.reading_score").fill(student_language.readingScore);
  await page.locator("#data\\.writing_score").fill(student_language.writingScore);
  await page.locator("#data\\.listening_score").fill(student_language.listeningScore);
  await page.locator("#data\\.average_score").fill(student_language.averageScore);
  // Exam Date
  await page.locator("#data\\.exam_date").click();
  const date = page.locator(".fi-fo-date-time-picker-panel");
  await date.getByRole("spinbutton").fill(student_language.examDate.year);
  await page.waitForTimeout(2000);
  await date.locator('select[x-model="focusedMonth"]:visible').selectOption({ label: student_language.examDate.month });
  await page.waitForTimeout(2000);
  await date.locator('[role="option"]:visible', { hasText: student_language.examDate.day }).click();
  await page.waitForTimeout(2000);
  await page.locator('button:has-text("Save")').nth(2).click();
  await page.waitForTimeout(4000);

  /* ---GPA & KSE--- */
   await page.locator('button[role="tab"]', { hasText: "GPA & KSE" }).click();
  await expect(page).toHaveURL("/student/students/1604?tab=-gpa-kse-tab");
  await page.waitForTimeout(2000);
  // GPA Scale
  await page.locator(".choices__inner", { has: page.locator("#data\\.gpa_id") }).click();
  await page.locator(".choices__list--dropdown .choices__item", { hasText: student_gpa.gpascale }).click();
  await page.waitForTimeout(1000);
  // GPA Score
  await page.locator(".choices__inner", { has: page.locator("#data\\.gpa_score_id") }).click();
  const gpaSearch = page.getByRole("textbox", { name: "Select GPA Score" });
  await page.waitForTimeout(1000);
  await gpaSearch.type(student_gpa.gpascore);
  await gpaSearch.press("Enter");
  await page.waitForTimeout(1000);
  // KSE
  await page.locator(".choices__inner", { has: page.locator("#data\\.knowledge_skill_exam_id") }).click();
  await page.locator(".choices__list--dropdown .choices__item", { hasText: student_gpa.kse }).click();
  await page.waitForTimeout(1000);
  // KSE Score
  await page.getByRole("spinbutton", { name: "Knowledge skill exam score" }).fill(student_gpa.ksescore);
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Save")').nth(3).click();
  await page.waitForTimeout(4000);

  /* ---Academics--- */
   await page.locator('button[role="tab"]', { hasText: "Academics" }).click();
  await expect(page).toHaveURL("/student/students/1604?tab=-academics-tab");
  await page.waitForTimeout(2000);
  await page.getByRole("textbox", { name: "Institution name*" }).fill(student_academic.institutionname);
  await page.waitForTimeout(1000);
  await page.getByRole("textbox", { name: "Street" }).fill(student_academic.street);
  await page.waitForTimeout(1000);
  // Open Country dropdown
  await page.locator(".choices__inner").nth(7).click();
  const searchCountry = page.getByRole("textbox", { name: "Select Country" });
  await page.waitForTimeout(1000);
  await searchCountry.type(student_academic.country);
  await searchCountry.press("Enter");
  await expect(page.locator(".choices__inner .choices__item--selectable").nth(7)).toContainText(student_academic.country);
  await page.waitForTimeout(1000);
  // Open State dropdown
  await page.locator(".choices__inner").nth(8).click();
  const searchState = page.getByRole("textbox", { name: "Select State" });
  await page.waitForTimeout(1000);
  await searchState.type(student_academic.state);
  await searchState.press("Enter");
  await expect(page.locator(".choices__inner .choices__item--selectable").nth(8)).toContainText(student_academic.state);
  await page.waitForTimeout(1000);
  // Open City dropdown
  await page.locator(".choices__inner").nth(9).click();
  const searchCity = page.getByRole("textbox", { name: "Select City" });
  await page.waitForTimeout(1000);
  await searchCity.type(student_academic.city);
  await searchCity.press("Enter");
  await expect(page.locator(".choices__inner .choices__item--selectable").nth(9)).toContainText(student_academic.city);
  await page.waitForTimeout(1000);
  await page.getByRole("textbox", { name: "Zip code" }).fill(student_academic.zipcode);
  await page.waitForTimeout(1000);
  await page.locator(".choices__list--single").nth(10).click();
  await page.waitForTimeout(1000);
  await page.getByRole("option", { name: "Bachelor's Degree" }).click();
  await page.locator(".choices__list--single").nth(11).click();
  await page.getByRole("option", { name: "2020" }).click();
  await page.locator('button:has-text("Save")').nth(4).click();
  await page.waitForTimeout(4000);

  /* ---Document--- */
   await page.locator('button[role="tab"]', { hasText: "Documents" }).click();
  await expect(page).toHaveURL("/student/students/1604?tab=-documents-tab");
  await page.waitForTimeout(2000);
  const fileInputs = page.locator('input[type="file"]');
  await fileInputs.nth(0).setInputFiles(student_document.passport);
  await fileInputs.nth(1).setInputFiles(student_document.englanguage);
  await fileInputs.nth(2).setInputFiles(student_document.marksheets);
  await fileInputs.nth(3).setInputFiles(student_document.cv);
  await fileInputs.nth(4).setInputFiles(student_document.recommendationletter);
  await fileInputs.nth(5).setInputFiles(student_document.financialdocuments);
  await fileInputs.nth(6).setInputFiles(student_document.otherdocuments);
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Save")').nth(5).click();
  await page.waitForTimeout(4000);

  /* ---Emergency Contact--- */
   await page.locator('button[role="tab"]', { hasText: "Emergency" }).click();
  await expect(page).toHaveURL("/student/students/1604?tab=-emergency-tab");
  await page.waitForTimeout(2000);
  await page.getByRole("textbox", { name: "Contact name" }).fill(student_emergency.name);
  await page.getByRole("textbox", { name: "Relationship" }).fill(student_emergency.relationship);
  await page.getByRole("textbox", { name: "Telephone number" }).fill(student_emergency.telephone);
  await page.getByRole("textbox", { name: "Email address" }).fill(student_emergency.email);
  await page.locator('button:has-text("Save")').nth(6).click();
  await page.waitForTimeout(4000);

  /* ---Consent--- */
   await page.locator('button[role="tab"]', { hasText: "Consent" }).click();
  await expect(page).toHaveURL("/student/students/1604?tab=-consent-tab");
  await page.waitForTimeout(2000);
  // Uncheck Consent Checkbox
  await page.locator("#data\\.consent_signature").uncheck();
  await expect(page.locator("#data\\.consent_signature")).not.toBeChecked();
  // Check Consent Checkbox
  await page.locator("#data\\.consent_signature").check();
  await expect(page.locator("#data\\.consent_signature")).toBeChecked();
  await page.locator('button:has-text("Save")').nth(7).click();
  await page.waitForTimeout(4000);
});