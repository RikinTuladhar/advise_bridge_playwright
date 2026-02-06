const { expect } = require("@playwright/test");
exports.StudentRegisterPage = class StudentRegisterPage {
    constructor(page) {
        this.page = page;
        this.firstNameInput = page.locator("#first_name");
        this.lastNameInput = page.locator("#last_name");
        this.emailInput = page.locator("#email");
        this.passwordInput = page.locator("#password");
        this.confirmPasswordInput = page.locator("#password_confirmation");
        this.registerButton = page.locator("//button[normalize-space()='Create account as student']");
    }

    async goToStudentRegisterPage() {
        await this.page.goto("/register?tab=student");
    }

    async registerStudent(firstname, lastname, email, password, confirm_password) {
        await this.firstNameInput.fill(firstname);
        await this.lastNameInput.fill(lastname);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirm_password);
        await this.registerButton.click();
    }
}

