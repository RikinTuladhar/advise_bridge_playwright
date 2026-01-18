import { test, expect } from "@playwright/test";
import { login } from "./helper/stu_login.js";

test("Student Application Delete ", async ({ page }) => {
    await login(page);
    await page.waitForTimeout(1000);
    await page.getByRole('link', { name: 'Applications' }).click();
    await expect(page).toHaveURL('https://www.advisebridge.com/student/applications');
    await page.waitForTimeout(2000);
    // Delete Application
    const scroll = page.locator('th:has-text("Last Activity")');
    await scroll.scrollIntoViewIfNeeded();
    await expect(scroll).toBeVisible();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Delete' }).nth(0).click();
    await page.waitForTimeout(1000);
    // await page.getByRole('button', { name: 'Cancel' }).click();  
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(1000);
    // Delete Message
    const deleteMsg = page.locator('h3.fi-no-notification-title'); 
    await deleteMsg.waitFor({ state: 'visible', timeout: 50000 });
    await expect(deleteMsg).toHaveText('Deleted');
    await page.waitForTimeout(3000);
});
