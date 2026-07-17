const { expect } = require("@playwright/test");

exports.AdvisorPage = class AdvisorPage {
  constructor(page) {
    this.page = page;
    this.path = "/advisor";
  }
  async goToAdvisorLoginGuest() {
    await this.page.goto("/login?tab=advisor");
  }
  async logout() {
    await expect(this.page).toHaveURL(this.path);
    await this.page.waitForTimeout(5000);
    await this.page.locator(".fi-avatar").first().waitFor({
      state: "visible",
    });
    await this.page.locator(".fi-avatar").first().click();
    const signOut = this.page.locator("span.fi-dropdown-list-item-label", { hasText: "Sign out" });
    await signOut.waitFor({ state: "visible" });
    await signOut.click();
  }
  async logInAsGuestToAdvisor(email, password) {
    await this.page.fill("#email", email);
    await this.page.fill("#password", password);
    await this.page.click("//button[normalize-space()='Log in as advisor']");
    await expect(this.page).toHaveURL(this.path);
  }
  async logInAsGuestToAdvisorInvalidEmail(email, password) {
    await this.page.fill("#email", email);
    await this.page.fill("#password", password);
    await this.page.click("//button[normalize-space()='Log in as advisor']");
    await expect(this.page.locator("span").filter({ hasText: "The provided credentials are incorrect" })).toBeVisible();
  }
  async logInAsGuestToAdvisorInvalidPassword(email, password) {
    await this.page.fill("#email", email);
    await this.page.fill("#password", password);
    await this.page.click("//button[normalize-space()='Log in as advisor']");
    await expect(this.page.locator("span").filter({ hasText: "The provided credentials are incorrect" })).toBeVisible();
  }
};
