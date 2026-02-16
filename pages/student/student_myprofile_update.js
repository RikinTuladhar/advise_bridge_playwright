import { expect } from "@playwright/test";
export class StudentMyProfile {
    constructor(page){
        this.page = page;
        this.avatar = page.locator(".fi-avatar");
        this.myProfile = page.locator('a[href$="/student/my-profile"]');
        // Profile
        this.firstName = page.locator("#data\\.first_name");
        this.lastName = page.locator("#data\\.last_name");
        this.email = page.locator("#data\\.email");
        this.updateProfileBtn = page.locator('button:has-text("Update")').nth(0);
        // Password
        this.currentPassword = page.locator("#data\\.current_password");
        this.newPassword = page.locator("#data\\.new_password");
        this.newPasswordConfirmation = page.locator("#data\\.new_password_confirmation");
        this.updatePasswordBtn = page.locator('button:has-text("Update")').nth(1);
    }
    async goToStudentMyProfile(){
        await this.avatar.click();
        await this.myProfile.click();
        await expect(this.page).toHaveURL(/\/student\/my-profile$/);
        await this.page.waitForTimeout(3000);
    }

    async updateProfile(profile){
        await this.firstName.fill(profile.firstName);
        await this.lastName.fill(profile.lastName);
        await this.email.fill(profile.email);
        await this.updateProfileBtn.click();
        await this.page.waitForTimeout(3000);
    }
     
    async updatePassword(password){
        await this.currentPassword.fill(password.currentpwd);
        await this.newPassword.fill(password.newpwd);
        await this.newPasswordConfirmation.fill(password.confirmpwd);
        await this.updatePasswordBtn.click();
    }
}