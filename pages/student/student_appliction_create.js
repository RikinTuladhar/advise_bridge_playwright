import { expect } from "@playwright/test";
export class StudentPage {
    constructor(page) {
        this.page = page;
    }
    async applyNow() {
        await this.page.locator(".fi-btn-label", { hasText: "Apply Now" }).click();
        await this.page.waitForTimeout(3000);
    }
}
export class SearchPage {
    constructor(page) {
        this.page = page;
        this.search = this.page.getByPlaceholder("Search...");
        this.applyNow = this.page.locator("div.group").getByRole("button", { name: "Apply Now" });
        this.saveBtn = this.page.locator("//button[normalize-space()='Save and Continue']");
    }
    /* ---Search Institution Name--- */
    async searchInstitution(data) {
        await this.page.locator("button", { hasText: "Search by college name..." }).click();
        await this.page.waitForTimeout(2000);
        await this.page.getByPlaceholder("Search by institution name...").type(data.institutionName);
        await this.page.waitForTimeout(2000);
        const dropdown = this.page.locator("ul.max-h-80");
        await dropdown.waitFor({ state: "visible" }).click;
        await dropdown.click();
        await expect(this.page).toHaveURL(/\/institutions\/.+/);
        await this.page.waitForTimeout(2000);
        await this.page.getByRole("link", { name: "Search" }).nth(0).click();
        await expect(this.page).toHaveURL("/search");
    }
    /* ---Apply for Institution--- */
    async clickInstitution(data) {
        await this.page.click("//button[normalize-space()='Institution Types']");
        await this.page.waitForTimeout(1000);
        await this.search.fill(data.institutionType);
        await this.page.waitForTimeout(1000);
        await this.page.locator("li", { hasText: "University" }).locator('input[type="checkbox"]').check();
        await this.page.waitForTimeout(1000);
    }
    async clickCountry(data) {
        await this.page.click("//button[normalize-space()='Countries']");
        await this.page.waitForTimeout(1000);
        await this.search.fill(data.countries);
        await this.page.waitForTimeout(1000);
        await this.page.locator("li", { hasText: "United States" }).locator('input[type="checkbox"]').check();
        await this.page.waitForTimeout(1000);
    }
    async clickStates(data) {
        await this.page.click("//button[normalize-space()='States']");
        await this.page.waitForTimeout(1000);
        await this.search.fill(data.states);
        await this.page.waitForTimeout(1000);
        await this.page.locator("li", { hasText: "Texas" }).locator('input[type="checkbox"]').check();
        await this.page.waitForTimeout(1000);
    }
    async clickEducation(data) {
        await this.page.click("//button[normalize-space()='Education Levels *']");
        await this.page.waitForTimeout(1000);
        await this.search.fill(data.educationlevel);
        await this.page.waitForTimeout(1000);
        await this.page.locator("li", { hasText: "Bachelor's Degree" }).click();
        await this.page.waitForTimeout(1000);
    }
    async clickMajors(data) {
        await this.page.click("//button[normalize-space()='Majors *']");
        await this.page.waitForTimeout(1000);
        await this.search.fill(data.majors);
        await this.page.waitForTimeout(1000);
        await this.page.locator("li", { hasText: "Agriculture" }).nth(0).click();
        await this.page.waitForTimeout(2000);
    }
    async applyBtn() {
        await this.page.click("//button[normalize-space()='Apply']");
        await this.page.waitForTimeout(5000);
    }
    async clearBtn() {
        await this.page.click("//button[normalize-space()='Clear All']");
    }
    async findEligibility() {
        const scrollDown = this.page.locator("div.grid a").nth(0);
        await scrollDown.scrollIntoViewIfNeeded();
        await expect(scrollDown).toBeVisible();
        await this.page.waitForTimeout(3000);
        await this.page.click("//button[normalize-space()='Find based on eligibility']");
        await this.page.waitForTimeout(2000);
        await this.page.click("//button[normalize-space()='Show colleges']");
        await this.page.waitForTimeout(2000);
    }
    async sortBy() {
        await this.page.click("//button[normalize-space()='Sort By']");
        await this.page.waitForTimeout(2000);
        await this.page.locator('input[type="radio"][value="az"]').click();
        await this.page.waitForTimeout(2000);
    }
    /* -- Navigate to University--*/
    async navigateToUniversity() {
        await this.page.locator("div.grid a").nth(0).click();
        await this.page.waitForTimeout(2000);
    }
    async clickCoursesOffered() {
        await this.page.getByRole('link', { name: 'Courses offered' }).click();
    }
    async applyBachelor() {
        await this.page.getByRole("button", { name: "Bachelor's Degree" }).click();
        await this.page.waitForTimeout(2000);
        await this.applyNow.nth(0).click();
        await this.page.waitForTimeout(2000);
        await this.saveBtn.click();
    }
    async applyMaster() {
        await this.page.getByRole("button", { name: "Master's Degree" }).click();
        await this.page.waitForTimeout(2000);
        await this.applyNow.nth(0).click();
        await this.page.waitForTimeout(2000);
        await this.saveBtn.click();
    }
    async warningMessage() {
        const warning = await this.page.locator('div.fl-flasher.fl-warning', { timeout: 15000 });
        await expect(warning).toBeVisible();
        await expect(warning.locator('.fl-title')).toHaveText('Warning');
        await expect(warning.locator('.fl-progress')).toBeVisible();
        return warning;
    }
}
