import { expect } from "@playwright/test";
export class StudentProfileInformation {
    constructor(page) {
        this.page = page;
    }
    /* ---Profile --- */
    async clickProfileInformation() {
        await this.page.click("text=Profile Information");
        await expect(this.page).toHaveURL(/\/student\/students\/\d+\?tab=-profile-tab$/);
    }
    async fillProfile(profile) {
        await this.page.locator("#data\\.first_name").fill(profile.firstName,);
        await this.page.locator("#data\\.last_name").fill(profile.lastName);
        await this.page.locator("#data\\.phone").fill(profile.phone);
        await this.page.locator("#data\\.dob").click();
        await this.page.waitForTimeout(1000);
        const calendar = this.page.locator(".fi-fo-date-time-picker");
        await calendar.getByRole("spinbutton").fill(profile.dob.year);
        await calendar.locator('select[x-model="focusedMonth"]:visible').selectOption({ label: profile.dob.month });
        await calendar.locator('[role="option"]:visible', { hasText: profile.dob.day }).click();
        await this.page.locator(`input[name="data.gender"][value="${profile.gender}"]`).check();
        await this.page.waitForTimeout(1000);
        await this.page.fill("#data\\.birth_place", profile.birthPlace);
        await this.page.locator('button:has-text("Save")').nth(0).click();
        await this.page.waitForTimeout(3000);
    }
    /* ---Address--- */
    async clickAddress() {
        await this.page.locator('button[role="tab"]', { hasText: "Address" }).click();
        await expect(this.page).toHaveURL(/\/student\/students\/\d+\?tab=-address-tab$/);
    }
    async fillAddress(address) {
        await this.page.locator(".choices__inner").nth(0).click();
        const countrySearch = this.page.getByRole("textbox", { name: "Select Country" });
        await countrySearch.type(address.country);
        await countrySearch.press("Enter");
        await this.page.locator(".choices__inner").nth(1).click();
        const stateSearch = this.page.getByRole("textbox", { name: "Select State" });
        await stateSearch.type(address.state);
        await stateSearch.press("Enter");
        await this.page.locator(".choices__inner").nth(2).click();
        const citySearch = this.page.getByLabel("Select City", { exact: true });
        await citySearch.type(address.city);
        await citySearch.press("Enter");
        await this.page.locator("#data\\.street").fill(address.street);
        await this.page.locator("#data\\.zip_code").fill(address.zipCode);
        await this.page.locator('button:has-text("Save")').nth(1).click();
        await this.page.waitForTimeout(3000);
    }
    /* ---Language--- */
    async clickLanguage() {
        await this.page.locator('button[role="tab"]', { hasText: "Language" }).click();
        await expect(this.page).toHaveURL(/\/student\/students\/\d+\?tab=-language-tab$/);
    }
    async fillLanguage(language) {
        await this.page.locator(".choices__inner").nth(3).click();
        const langOption = this.page.locator(".choices__list .choices__item--choice", { hasText: language.englishExam });
        await langOption.waitFor({ state: "visible", timeout: 5000 });
        const engSearch = this.page.getByRole("textbox", { name: "Select English Exam Type" });
        await engSearch.type(language.englishExam);
        await engSearch.press("Enter");
        // Enter Score
        await this.page.locator("#data\\.speaking_score").fill(language.speakingScore);
        await this.page.locator("#data\\.reading_score").fill(language.readingScore);
        await this.page.locator("#data\\.writing_score").fill(language.writingScore);
        await this.page.locator("#data\\.listening_score").fill(language.listeningScore);
        await this.page.locator("#data\\.average_score").fill(language.averageScore);
        // Exam Date
        await this.page.locator("#data\\.exam_date").click();
        const examdate = this.page.locator(".fi-fo-date-time-picker-panel").nth(1);
        await examdate.getByRole("spinbutton").fill(language.examDate.year);
        await examdate.locator('select[x-model="focusedMonth"]:visible').selectOption({ label: language.examDate.month });
        await examdate.locator('[role="option"]:visible', { hasText: language.examDate.day }).first();
        await this.page.locator('button:has-text("Save")').nth(2).click();
        await this.page.waitForTimeout(3000);
    }
    /* ---GPA & KSE--- */
    async clickGpaKse() {
        await this.page.locator('button[role="tab"]', { hasText: "GPA & KSE" }).click();
        await expect(this.page).toHaveURL(/\/student\/students\/\d+\?tab=-gpa-kse-tab$/);
    }
    async fillGpaKse(gpa) {
        await this.page.locator(".choices__inner", { has: this.page.locator("#data\\.gpa_id") }).click();
        await this.page.locator(".choices__list--dropdown .choices__item", { hasText: gpa.gpascale }).click();
        await this.page.waitForTimeout(1000);
        await this.page.locator(".choices__inner", { has: this.page.locator("#data\\.gpa_score_id") }).click();
        const gpaSearch = this.page.getByRole("textbox", { name: "Select GPA Score" });
        await this.page.waitForTimeout(1000);
        await gpaSearch.type(gpa.gpascore);
        await this.page.waitForTimeout(4000);
        await gpaSearch.press("Enter");
        await this.page.locator(".choices__inner", { has: this.page.locator("#data\\.knowledge_skill_exam_id") }).click();
        await this.page.locator(".choices__list--dropdown .choices__item", { hasText: gpa.kse }).click();
        await this.page.waitForTimeout(1000);
        await this.page.getByRole("spinbutton", { name: "Knowledge skill exam score" }).fill(gpa.ksescore);
        await this.page.waitForTimeout(1000);
        await this.page.locator('button:has-text("Save")').nth(3).click();
        await this.page.waitForTimeout(3000);
    }
    /* ---Academics--- */
    async clickAcademics() {
        await this.page.locator('button[role="tab"]', { hasText: "Academics" }).click();
        await expect(this.page).toHaveURL(/\/student\/students\/\d+\?tab=-academics-tab$/);
    }
    async fillAcademic(academic) {
        // await this.page.locator('[wire\\:click*="education_history"] >> text=Add More').click();
        await this.page.getByRole("textbox", { name: "Institution name*" }).fill(academic.institutionname);
        await this.page.waitForTimeout(1000);
        await this.page.getByRole("textbox", { name: "Street" }).fill(academic.street);
        // Open Country dropdown
        await this.page.locator(".choices__inner").nth(7).click();
        const searchCountry = this.page.getByRole("textbox", { name: "Select Country" });
        await this.page.waitForTimeout(1000);
        await searchCountry.type(academic.country);
        await searchCountry.press("Enter");
        await this.page.waitForTimeout(1000);
        // Open State dropdown
        await this.page.locator(".choices__inner").nth(8).click();
        const searchState = this.page.getByRole("textbox", { name: "Select State" });
        await this.page.waitForTimeout(1000);
        await searchState.type(academic.state);
        await searchState.press("Enter");
        await this.page.waitForTimeout(1000);
        // Open City dropdown
        await this.page.locator(".choices__inner").nth(9).click();
        const searchCity = this.page.getByRole("textbox", { name: "Select City" });
        await this.page.waitForTimeout(1000);
        await searchCity.type(academic.city);
        await searchCity.press("Enter");
        await this.page.waitForTimeout(1000);
        await this.page.locator('[wire\\:model*="education_history"][id$="zip_code"]').fill(academic.zipcode);
        await this.page.waitForTimeout(1000);
        await this.page.locator(".choices__list--single").nth(10).click();
        await this.page.waitForTimeout(1000);
        await this.page.getByRole("option", { name: "Bachelor's Degree" }).click();
        await this.page.locator(".choices__list--single").nth(11).click();
        await this.page.getByRole("option", { name: "2020" }).click();
        await this.page.locator('button:has-text("Save")').nth(4).click();
        await this.page.waitForTimeout(3000);
    }
    /* ---Document--- */
    async clickDocument() {
        await this.page.locator('button[role="tab"]', { hasText: "Documents" }).click();
        await expect(this.page).toHaveURL(/\/student\/students\/\d+\?tab=-documents-tab$/);
    }
    async uploadDocument(document) {
        const fileInputs = this.page.locator('input[type="file"]');
        await fileInputs.nth(0).setInputFiles(document.passport);
        await fileInputs.nth(1).setInputFiles(document.englanguage);
        await fileInputs.nth(2).setInputFiles(document.marksheets);
        await fileInputs.nth(3).setInputFiles(document.cv);
        await fileInputs.nth(4).setInputFiles(document.recommendationletter);
        await fileInputs.nth(5).setInputFiles(document.financialdocuments);
        await fileInputs.nth(6).setInputFiles(document.otherdocuments);
        await this.page.waitForTimeout(9000);
        await this.page.locator('button:has-text("Save")').nth(5).click();
        await this.page.waitForTimeout(3000);
    }
    /* ---Emergency--- */
    async clickEmergency() {
        await this.page.locator('button[role="tab"]', { hasText: "Emergency" }).click();
        await expect(this.page).toHaveURL(/\/student\/students\/\d+\?tab=-emergency-tab$/);
    }
    async fillEmergency(emergency) {
        // await this.page.locator('[wire\\:click*="emergency_contact"] >> text=Add More').click();
        await this.page.getByRole("textbox", { name: "Contact name" }).fill(emergency.contactname);
        await this.page.getByRole("textbox", { name: "Relationship" }).fill(emergency.relationship);
        await this.page.getByRole("textbox", { name: "Telephone number" }).fill(emergency.telephone);
        await this.page.getByRole("textbox", { name: "Email address" }).fill(emergency.email);
        await this.page.locator('button:has-text("Save")').nth(6).click();
        await this.page.waitForTimeout(3000);
    }
    /* ---Consent--- */
    async clickConsent() {
        await this.page.locator('button[role="tab"]', { hasText: "Consent" }).click();
        await expect(this.page).toHaveURL(/\/student\/students\/\d+\?tab=-consent-tab$/);
    }
    async checkConsent() {
        await this.page.locator("#data\\.consent_signature").uncheck();
        await expect(this.page.locator("#data\\.consent_signature")).not.toBeChecked();
        await this.page.locator("#data\\.consent_signature").check();
        await expect(this.page.locator("#data\\.consent_signature")).toBeChecked();
        await this.page.locator('button:has-text("Save")').nth(7).click();
    }
}


