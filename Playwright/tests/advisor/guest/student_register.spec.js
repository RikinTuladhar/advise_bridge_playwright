import { expect, test } from "@playwright/test";

test("Student Login Page", async ({ page }) => {
    await page.goto(" https://advisebridge.com/register?tab=student");

    await page.click("text=Student");

    await page.getByLabel('First name').fill('Mamata');
    await page.getByLabel('Last name').fill('Khanal');
    await page.getByLabel('Email').fill('mamatakhanal12@gmail.com');

    await page.locator('input[name="password"]').fill('Mamat@12');
    await page.locator('input[name="password_confirmation"]').fill('Mamat@12');
    await page.getByRole('button', { name: 'Create account as student' }).click();

    await expect(page).toHaveURL("https://advisebridge.com/student/email-verification/prompt");

    await page.waitForTimeout(5000);
});