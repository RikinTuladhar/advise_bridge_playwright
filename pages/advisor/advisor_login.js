// import { expect } from "@playwright/test";

// export class AdvisorLoginPage {
//   constructor(page) {
//     this.page = page;
//     this.emailInput = page.locator("#email");
//     this.passwordInput = page.locator("#password");
//     this.loginButton = page.locator("//button[normalize-space()='Log in as advisor']");

// }
//   async goToAdvisorLoginGuest() {
//     await this.page.goto("/login?tab=advisor");
//   }
//   async logInAsGuestToAdvisor(email, password) {
//     await this.emailInput.fill(email)
//     await this.passwordInput.fill(password);
//     await this.loginButton.click();
//   }
//   async sucessfullLogin() {
//     await expect(this.page).toHaveURL("/advisor");
//   }
// }

// import { expect } from "@playwright/test";
//  export class advisor_login {
//   constructor(page) {
//     this.page = page;
//     this.emailInput = page.locator("#email");
//     this.passwordInput = page.locator("#password");
//     this.loginButton = page.locator("button[normalize-space()='log in as advisor']");
//   }
//   async goToAdvisorLoginGuest(){
//     await this.page.goto("/Login?tab=advisor")
//   }
//   async logInAsGuestToAdvisor(email, password) {
//     await this.emailInput.fill(email)
//     await this.passwordInput.fill(password);
//     await this.loginButton.click();
//   }
//   async sucessfullLogin() {
//     await expect(this.page).toHaveURL("/advisor");
//   }
//  }

// pages/advisor/advisor_login.js

export class AdvisorLoginPage {
  constructor(page) {
    this.page = page;
  }

  async goToAdvisorLoginGuest() {
    await this.page.goto('https://staging.advisebridge.com/login?tab=advisor');
  }

  async logInAsGuestToAdvisor(email, password) {
    await this.page.fill('#email', email);
    await this.page.fill('#password', password);
    await this.page.click('button[type="submit"]');
  }

  async sucessfullLogin() {
   // await expect(this.page).toHaveURL('https://staging.advisebridge.com/advisor');
  }
}