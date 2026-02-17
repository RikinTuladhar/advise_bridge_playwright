import { expect } from '@playwright/test';

export class AdvisorSearchPage {
  constructor(page) {
    this.page = page;

    // Search Locators
    this.applyNowBtn        = page.locator(".fi-btn-label", { hasText: "Apply Now" });
    this.searchByCollegeBtn = page.locator("button", { hasText: "Search by college name..." });
    this.institutionInput   = page.getByPlaceholder("Search by institution name...");
    this.dropdown           = page.locator("ul.max-h-80");
    this.searchLink         = page.getByRole("link", { name: "Search" }).nth(0);
  }

  async clickApplyNow() {
    const popup = this.page.waitForEvent("popup");
    await this.applyNowBtn.click();
    await this.page.waitForTimeout(3000);
    return await popup;
  }

  async searchInstitution(newPage, institutionName) {
    const searchPage = new AdvisorSearchPage(newPage);
    await searchPage.searchByCollegeBtn.click();
    await newPage.waitForTimeout(2000);
    await searchPage.institutionInput.fill(institutionName);
    await newPage.waitForTimeout(2000);
    await searchPage.dropdown.waitFor({ state: "visible" });
    await searchPage.dropdown.click();
    await expect(newPage).toHaveURL(`/institutions/${institutionName.toLowerCase().replace(/ /g, "-")}`);
    await newPage.waitForTimeout(2000);
    await searchPage.searchLink.click();
    await expect(newPage).toHaveURL("/search");
  }
}

export class AdvisorApplyPage {
  constructor(page) {
    this.page = page;

    // Filter Locators
    this.institutionTypesBtn = page.locator("//button[normalize-space()='Institution Types']");
    this.countriesBtn        = page.locator("//button[normalize-space()='Countries']");
    this.statesBtn           = page.locator("//button[normalize-space()='States']");
    this.educationLevelsBtn  = page.locator("//button[normalize-space()='Education Levels *']");
    this.majorsBtn           = page.locator("//button[normalize-space()='Majors *']");
    this.applyFilterBtn      = page.locator("//button[normalize-space()='Apply']");
    this.clearAllBtn         = page.locator("//button[normalize-space()='Clear All']");
    this.searchInput         = page.getByPlaceholder("Search...");

    // Eligibility Locators
    this.firstGridLink       = page.locator("div.grid a").nth(0);
    this.findByEligibilityBtn = page.getByRole("button", { name: "Find based on eligibility" });

    // Application Locators
    this.bachelorDegreeBtn   = page.getByRole("button", { name: "Bachelor's Degree" });
    this.createApplicationBtn = page.getByRole("button", { name: "Create Application" }).nth(1);
    this.applyNowBtn         = page.getByRole("button", { name: "Apply Now" });
    this.saveAndContinueBtn  = page.getByRole("button", { name: "Save and Continue" });
  }

  async selectInstitutionType(type) {
    await this.institutionTypesBtn.click();
    await this.page.waitForTimeout(1000);
    await this.searchInput.fill(type);
    await this.page.waitForTimeout(1000);
    await this.page.locator("li", { hasText: type }).locator('input[type="checkbox"]').check();
    await this.page.waitForTimeout(1000);
  }

  async selectCountry(country) {
    await this.countriesBtn.click();
    await this.page.waitForTimeout(1000);
    await this.searchInput.fill(country);
    await this.page.waitForTimeout(1000);
    await this.page.locator("li", { hasText: country }).locator('input[type="checkbox"]').check();
    await this.page.waitForTimeout(1000);
  }

  async selectState(state) {
    await this.statesBtn.click();
    await this.page.waitForTimeout(1000);
    await this.searchInput.fill(state);
    await this.page.waitForTimeout(1000);
    await this.page.locator("li", { hasText: state }).locator('input[type="checkbox"]').check();
    await this.page.waitForTimeout(1000);
  }

  async selectEducationLevel(level) {
    await this.educationLevelsBtn.click();
    await this.page.waitForTimeout(1000);
    await this.searchInput.fill(level);
    await this.page.waitForTimeout(1000);
    await this.page.locator("li", { hasText: level }).click();
    await this.page.waitForTimeout(1000);
  }

  async selectMajor(major) {
    await this.majorsBtn.click();
    await this.page.waitForTimeout(1000);
    await this.searchInput.fill(major);
    await this.page.waitForTimeout(1000);
    await this.page.locator("li", { hasText: major }).nth(0).click();
    await this.page.waitForTimeout(2000);
  }

  async applyFilters() {
    await this.applyFilterBtn.click();
    await this.page.waitForTimeout(5000);
  }

  async clearFilters() {
    await this.clearAllBtn.click();
  }

  async scrollToFirstResult() {
    await this.firstGridLink.scrollIntoViewIfNeeded();
    await expect(this.firstGridLink).toBeVisible();
  }

  async selectStudentByEligibility(studentName) {
    await this.findByEligibilityBtn.click();
    await this.page.waitForSelector(`text=${studentName}`, { state: "visible" });
    await this.page.getByText(studentName).click();
  }

  async selectUniversity(universityName) {
    await this.page.getByRole("link", { name: universityName }).click();
  }

  async createApplication(studentName) {
    await this.bachelorDegreeBtn.click();
    await this.page.waitForTimeout(2000);
    await this.createApplicationBtn.click();
    await this.page.waitForSelector(`text=${studentName}`, { state: "visible" });
    await this.page.getByText(studentName).click();
    await this.applyNowBtn.click();
    await this.saveAndContinueBtn.click();
    await this.page.waitForTimeout(2000);
  }
}