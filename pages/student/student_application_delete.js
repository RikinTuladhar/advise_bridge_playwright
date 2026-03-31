import { expect } from "@playwright/test";
export class StudentApplicationDelete {
    constructor(page) {
        this.page = page;
        this.applicationBtn = page.getByRole("link", { name: "Applications" });
        this.lastActivity = page.locator('th:has-text("Last Activity")');
        this.deleteButton = page.getByRole("button",{ name: "Delete"}).nth(0);
        this.confirmDeleteButton = page.locator(".fi-modal").getByRole("button",{ name: "Delete"});
        this.cancelButton = page.getByRole("button", { name: 'Cancel' });
        this.deleteMessage = page.locator("h3.fi-no-notification-title");
    }
    async goToApplication() {
        await this.applicationBtn.click();
        await expect(this.page).toHaveURL("/student/applications");
    }
    async scrollToLastActivity(){
        await this.lastActivity.scrollIntoViewIfNeeded();
        await expect(this.lastActivity).toBeVisible();
    }
    async deleteApplication() {
        await this.deleteButton.click();
    }
    async confirmDeleteApplication() {
        await this.confirmDeleteButton.click();
    }
    async cancelApplication() {
        await this.cancelButton.click();
    }
    async deleteSuccess() {
        await expect(this.deleteMessage).toHaveText("Deleted");
    }
}