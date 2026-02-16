import { test, expect } from "@playwright/test";
import { studentLogin } from "../../../helper/login.js";
import { student_data } from '../../../datas/student_data.js';
import { StudentProfileInformation } from '../../../pages/student/student_profileinformation.js'

test("Student My-Profile", async ({ page }) => {
  await studentLogin(page);
  const profileInformation = new StudentProfileInformation(page);
  await profileInformation.clickProfileInformation();
  await profileInformation.fillProfile(student_data.profile);
  await profileInformation.clickAddress();
  await profileInformation.fillAddress(student_data.address);
  await profileInformation.clickLanguage();
  await profileInformation.fillLanguage(student_data.language);
  await profileInformation.clickGpaKse();
  await profileInformation.fillGpaKse(student_data.gpa);
  await profileInformation.clickAcademics();
  await profileInformation.fillAcademic(student_data.academic);
  await profileInformation.clickDocument();
  await profileInformation.uploadDocument(student_data.documents);
  await profileInformation.clickEmergency();
  await profileInformation.fillEmergency(student_data.emergencycontact);
  await profileInformation.clickConsent();
  await profileInformation.checkConsent();
});





// test("Student Profile Information", async ({ page }) => {
//   await studentLogin(page);
//   await page.click("text=Profile Information");
//   await expect(page).toHaveURL(/\/student\/students\/\d+\?tab=-profile-tab$/);
//   await page.waitForTimeout(1000);

//   /* ---Profile Information--- */
//   // Upload Profile
//   // await page.locator('label:has-text("Click here to upload image...")').setInputFiles(student_profile.profileImage);
//   await page.locator("#data\\.first_name").fill(student_data.profile.firstName);
//   await page.waitForTimeout(1000);
//   await page.locator("#data\\.last_name").fill(student_data.profile.lastName);
//   await page.waitForTimeout(1000);
//   await page.locator("#data\\.phone").fill(student_data.profile.phone);
//   await page.waitForTimeout(1000);
//   // DOB
//   await page.locator("#data\\.dob").click();
//   await page.waitForTimeout(1000);
//   const calendar = page.locator(".fi-fo-date-time-picker");
//   await calendar.getByRole("spinbutton").fill(student_data.profile.dob.year);
//   await page.waitForTimeout(1000);
//   await calendar.locator('select[x-model="focusedMonth"]:visible').selectOption({ label: student_data.profile.dob.month });
//   await page.waitForTimeout(1000);
//   await calendar.locator('[role="option"]:visible', { hasText: student_data.profile.dob.day }).click();
//   await page.waitForTimeout(1000);
//   // Choose Gender
//   await page.locator(`input[name="data.gender"][value="${student_data.profile.gender}"]`).check();
//   await page.waitForTimeout(1000);
//   await page.fill("#data\\.birth_place", student_data.profile.birthPlace);
//   await page.waitForTimeout(1000);
//   await page.locator('button:has-text("Save")').nth(0).click();
//   await page.waitForTimeout(3000);


//   /* ---Address--- */
//   await page.locator('button[role="tab"]', { hasText: "Address" }).click();
//   await expect(page).toHaveURL(/\/student\/students\/\d+\?tab=-address-tab$/);
//   await page.waitForTimeout(2000);
//   // Select Country
//   await page.locator(".choices__inner").nth(0).click();
//   const countrySearch = page.getByRole("textbox", { name: "Select Country" });
//   await countrySearch.type(student_data.address.country);
//   await page.waitForTimeout(5000);
//   await countrySearch.press("Enter");
//   // Select State
//   await page.locator(".choices__inner").nth(1).click();
//   const stateSearch = page.getByRole("textbox", { name: "Select State" });
//   await stateSearch.type(student_data.address.state);
//   await page.waitForTimeout(5000);
//   await stateSearch.press("Enter");
//   // Select City
//   await page.locator(".choices__inner").nth(2).click();
//   const citySearch = page.getByLabel("Select City", { exact: true });
//   await citySearch.type(student_data.address.city);
//   await page.waitForTimeout(5000);
//   await citySearch.press("Enter");
//   // Enter Street
//   await page.locator("#data\\.street").fill(student_data.address.street);
//   await page.waitForTimeout(1000);
//   // Enter Zip Code
//   await page.locator("#data\\.zip_code").fill(student_data.address.zipCode);
//   await page.waitForTimeout(1000);
//   await page.locator('button:has-text("Save")').nth(1).click();
//   await page.waitForTimeout(3000);

//   /* ---Language--- */
//   await page.locator('button[role="tab"]', { hasText: "Language" }).click();
//   await expect(page).toHaveURL(/\/student\/students\/\d+\?tab=-language-tab$/);
//   await page.waitForTimeout(2000);
//   // Open the English Exam dropdown
//   await page.locator(".choices__inner").nth(3).click();
//   const langOption = page.locator(".choices__list .choices__item--choice", { hasText: student_data.language.englishExam });
//   await langOption.waitFor({ state: "visible", timeout: 5000 });
//   // Search Input
//   const engSearch = page.getByRole("textbox", { name: "Select English Exam Type" });
//   await engSearch.type(student_data.language.englishExam);
//   await page.waitForTimeout(5000);
//   await engSearch.press("Enter");
//   // Enter Score
//   await page.locator("#data\\.speaking_score").fill(student_data.language.speakingScore);
//   await page.waitForTimeout(1000);
//   await page.locator("#data\\.reading_score").fill(student_data.language.readingScore);
//   await page.waitForTimeout(1000);
//   await page.locator("#data\\.writing_score").fill(student_data.language.writingScore);
//   await page.waitForTimeout(1000);
//   await page.locator("#data\\.listening_score").fill(student_data.language.listeningScore);
//   await page.waitForTimeout(1000);
//   await page.locator("#data\\.average_score").fill(student_data.language.averageScore);
//   await page.waitForTimeout(1000);
//   // Exam Date
//   await page.locator("#data\\.exam_date").click();
//   const examdate = page.locator(".fi-fo-date-time-picker-panel").nth(1);
//   await examdate.getByRole("spinbutton").fill(student_data.language.examDate.year);
//   await examdate.locator('select[x-model="focusedMonth"]:visible').selectOption({ label: student_data.language.examDate.month });
//   await examdate.locator('[role="option"]:visible', { hasText: student_data.language.examDate.day }).first();
//   await page.locator('button:has-text("Save")').nth(2).click();
//   await page.waitForTimeout(3000);


//   /* ---GPA & KSE--- */
//   await page.locator('button[role="tab"]', { hasText: "GPA & KSE" }).click();
//   await expect(page).toHaveURL(/\/student\/students\/\d+\?tab=-gpa-kse-tab$/);
//   await page.waitForTimeout(2000);
//   // GPA Scale
//   await page.locator(".choices__inner", { has: page.locator("#data\\.gpa_id") }).click();
//   await page.locator(".choices__list--dropdown .choices__item", { hasText: student_data.gpa.gpascale }).click();
//   await page.waitForTimeout(1000);
//   // GPA Score
//   await page.locator(".choices__inner", { has: page.locator("#data\\.gpa_score_id") }).click();
//   const gpaSearch = page.getByRole("textbox", { name: "Select GPA Score" });
//   await page.waitForTimeout(1000);
//   await gpaSearch.type(student_data.gpa.gpascore);
//   await page.waitForTimeout(4000);
//   await gpaSearch.press("Enter");
//   // KSE
//   await page.locator(".choices__inner", { has: page.locator("#data\\.knowledge_skill_exam_id") }).click();
//   await page.locator(".choices__list--dropdown .choices__item", { hasText: student_data.gpa.kse }).click();
//   await page.waitForTimeout(1000);
//   // KSE Score
//   await page.getByRole("spinbutton", { name: "Knowledge skill exam score" }).fill(student_data.gpa.ksescore);
//   await page.waitForTimeout(1000);
//   await page.locator('button:has-text("Save")').nth(3).click();
//   await page.waitForTimeout(3000);

//   /* ---Academics--- */
//   await page.locator('button[role="tab"]', { hasText: "Academics" }).click();
//   await expect(page).toHaveURL(/\/student\/students\/\d+\?tab=-academics-tab$/);
//   await page.waitForTimeout(2000);
//   // await page.locator('[wire\\:click*="education_history"] >> text=Add More').click();
//   await page.getByRole("textbox", { name: "Institution name*" }).fill(student_data.academic.institutionname);
//   await page.waitForTimeout(1000);
//   await page.getByRole("textbox", { name: "Street" }).fill(student_data.academic.street);
//   //await page.waitForTimeout(3000);`                                                                                                                           
//   // Open Country dropdown
//   await page.locator(".choices__inner").nth(7).click();
//   const searchCountry = page.getByRole("textbox", { name: "Select Country" });
//   await page.waitForTimeout(1000);
//   await searchCountry.type(student_data.academic.country);
//   await searchCountry.press("Enter");
//   await page.waitForTimeout(1000);
//   // Open State dropdown
//   await page.locator(".choices__inner").nth(8).click();
//   const searchState = page.getByRole("textbox", { name: "Select State" });
//   await page.waitForTimeout(1000);
//   await searchState.type(student_data.academic.state);
//   await searchState.press("Enter");
//   await page.waitForTimeout(3000);
//   await page.waitForTimeout(1000);
//   // Open City dropdown
//   await page.locator(".choices__inner").nth(9).click();
//   const searchCity = page.getByRole("textbox", { name: "Select City" });
//   await page.waitForTimeout(1000);
//   await searchCity.type(student_data.academic.city);
//   await searchCity.press("Enter");
//   await page.waitForTimeout(1000);
//   await page.locator('[wire\\:model*="education_history"][id$="zip_code"]').fill(student_data.academic.zipcode);
//   await page.waitForTimeout(1000);
//   await page.locator(".choices__list--single").nth(10).click();
//   await page.waitForTimeout(1000);
//   await page.getByRole("option", { name: "Bachelor's Degree" }).click();
//   await page.locator(".choices__list--single").nth(11).click();
//   await page.getByRole("option", { name: "2020" }).click();
//   await page.locator('button:has-text("Save")').nth(4).click();
//   // await page.waitForTimeout(3000);

//   /* ---Document--- */
//   await page.locator('button[role="tab"]', { hasText: "Documents" }).click();
//   await expect(page).toHaveURL(/\/student\/students\/\d+\?tab=-documents-tab$/);
//   await page.waitForTimeout(2000);
//   const fileInputs = page.locator('input[type="file"]');
//   await fileInputs.nth(0).setInputFiles(student_data.documents.passport);
//   await fileInputs.nth(1).setInputFiles(student_data.documents.englanguage);
//   await fileInputs.nth(2).setInputFiles(student_data.documents.marksheets);
//   await fileInputs.nth(3).setInputFiles(student_data.documents.cv);
//   await fileInputs.nth(4).setInputFiles(student_data.documents.recommendationletter);
//   await fileInputs.nth(5).setInputFiles(student_data.documents.financialdocuments);
//   await fileInputs.nth(6).setInputFiles(student_data.documents.otherdocuments);
//   await page.waitForTimeout(9000);
//   await page.locator('button:has-text("Save")').nth(5).click();
//   await page.waitForTimeout(3000);

//   /* ---Emergency Contact--- */
//   await page.locator('button[role="tab"]', { hasText: "Emergency" }).click();
//   await expect(page).toHaveURL(/\/student\/students\/\d+\?tab=-emergency-tab$/);
//   await page.waitForTimeout(2000);
//   // await page.locator('[wire\\:click*="emergency_contact"] >> text=Add More').click();
//   await page.getByRole("textbox", { name: "Contact name" }).fill(student_data.emergencyContact.contactname);
//   await page.getByRole("textbox", { name: "Relationship" }).fill(student_data.emergencyContact.relationship);
//   await page.getByRole("textbox", { name: "Telephone number" }).fill(student_data.emergencyContact.telephone);
//   await page.getByRole("textbox", { name: "Email address" }).fill(student_data.emergencyContact.email);
//   await page.locator('button:has-text("Save")').nth(6).click();
//   await page.waitForTimeout(3000);

//   /* ---Consent--- */
//   await page.locator('button[role="tab"]', { hasText: "Consent" }).click();
//   await expect(page).toHaveURL(/\/student\/students\/\d+\?tab=-consent-tab$/);
//   await page.waitForTimeout(1000);
//   // Uncheck Consent Checkbox
//   await page.locator("#data\\.consent_signature").uncheck();
//   await expect(page.locator("#data\\.consent_signature")).not.toBeChecked();
//   // Check Consent Checkbox
//   await page.locator("#data\\.consent_signature").check();
//   await expect(page.locator("#data\\.consent_signature")).toBeChecked();
//   await page.locator('button:has-text("Save")').nth(7).click();
// });