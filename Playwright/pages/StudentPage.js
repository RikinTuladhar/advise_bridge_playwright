const { expect } = require("@playwright/test");

exports.StudentPage =
class StudentPage {
    constructor(page) {
        this.page = page
        this.path = "/student"
    }

    async goToStudentLoginGuest() {
        await this.page.goTo("/login?tab=student");
    }
    async logout() {
      expect(this.page).toHaveURL(this.path);
      await page.locator(".fi-avatar").first().waitFor({
        state: "visible",
      });
      await page.locator(".fi-avatar").first().click();
      const signOut = page.locator("span.fi-dropdown-list-item-label", { hasText: "Sign out" });
      await signOut.waitFor({ state: "visible" });
      await signOut.click();
    }
    async login(email,password) {
        await page.fill("#email", email);
        await page.fill("#password", password);
        await page.click("//button[normalize-space()='Log in as student']");
        await expect(page).toHaveURL(this.path);
    }
    async register(first_name,last_name,email,password,confirm_password) {

    }
    async login(email, password) {

    }
    async invalidRegisterWhiteSpace(){
        
    }
}