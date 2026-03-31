import { expect } from "@playwright/test";
export class AgentLoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator("#data\\.email");
        this.passwordInput = page.locator("#data\\.password");
        this.signButton = page.getByRole('button', { name: 'Sign in' });
    }

    async goToAgentLoginPage() {
        await this.page.goto("/agent/login");
    }

    async loginAsAgent(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signButton.click();
    }

    async successfullLogin(){
        await expect(this.page).toHaveURL("/agent");
    }
}