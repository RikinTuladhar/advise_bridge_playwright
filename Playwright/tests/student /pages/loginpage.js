export class StudentLoginPage {
  constructor(page) {
    this.page = page;
    this.studentTab = page.locator("text=Student");
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("//button[normalize-space()='Log in as student']");
  }

  async goTo() {
    await this.page.goto("https://www.advisebridge.com/login?tab=student");
  }

  async loginAsStudent(email, password) {
    await this.studentTab.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
