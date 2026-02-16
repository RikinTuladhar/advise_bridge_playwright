import { expect } from "@playwright/test";
export class StudentPage {
    constructor(page) {
        this.page = page;
    }
    async openNewPage() {
        await this.page.locator(".fi-btn-label", { hasText: "Apply Now" }).click();
        await this.page.waitForTimeout(3000);
    }
}
export class UniversityPage {
    constructor(page) {
        this.page = page;
        this.courseOffered = page.getByRole('link', { name: 'Courses offered' });
        this.bachelorBtn = page.getByRole("button", { name: "Bachelor's Degree" });
        this.masterBtn = page.getByRole("button", { name: "Master's Degree" });
        this.applyNowBtn = page.locator("div.group").getByRole("button", { name: "Apply Now" });
        this.saveButton = page.locator("//button[normalize-space()='Save and Continue']");
    }
    async selectUniversity(index = 0) {
        const universityCard = this.page.locator("div.grid a").nth(index);
        await universityCard.scrollIntoViewIfNeeded();
        await expect(universityCard).toBeVisible();
        await universityCard.click();
    }
    async clickCoursesOffered() {
        await this.page.waitForTimeout(2000);
        await this.courseOffered.click();
    }
    async applyBachelor() {
        await this.bachelorBtn.click();
        await this.page.waitForTimeout(2000);
        await this.applyNowBtn.nth(0).click();
        await this.page.waitForTimeout(2000);
        await this.saveButton.click();
        await this.page.waitForTimeout(2000);
    }
    async applyMaster() {
        await this.masterBtn.click();
        await this.page.waitForTimeout(2000);
        await this.applyNowBtn.nth(0).click();
        await this.page.waitForTimeout(2000);
        await this.saveButton.click();
    }
    async warningMessage() {
        const warning = await this.page.locator('div.fl-flasher.fl-warning', { timeout: 15000 });
        await expect(warning).toBeVisible();
        await expect(warning.locator('.fl-title')).toHaveText('Warning');
        await expect(warning.locator('.fl-progress')).toBeVisible();
        return warning;
    }
}