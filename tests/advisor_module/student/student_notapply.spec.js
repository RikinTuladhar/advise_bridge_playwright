import { test, expect } from '@playwright/test';
import login, { advisorLogin } from "../../../helper/login.js";

test('Student Not Apply', async ({ page }) => {
    await advisorLogin(page);

    // Wait for navigation and get the new page context
    const popup = page.waitForEvent("popup");
    await page.locator(".fi-btn-label", { hasText: "Apply Now" }).click();
    await page.waitForTimeout(3000);
    const newPage = await popup;

    const scrollDown = newPage.locator("div.grid a").nth(0);
    await scrollDown.scrollIntoViewIfNeeded();
    await expect(scrollDown).toBeVisible();
    await page.waitForTimeout(3000);

    // Click on New Jersey Institute of Technology
    await newPage.getByRole('link', { name: 'New Jersey Institute of Technology' }).click();
    await page.waitForTimeout(3000);

    // Apply for Bachelor Degree
    await newPage.getByRole("button", { name: "Bachelor's Degree" }).click();
    await newPage.waitForTimeout(2000);

    await newPage.getByRole('button', { name: 'Create Application' }).nth(1).click();
    await newPage.waitForSelector('text=Mamata khanal', { state: 'visible', timeout: 30000 });
    await newPage.getByText('Mamata khanal').click();
    await newPage.waitForTimeout(2000);

    await newPage.locator('#cross-button-advisor').click();
    await newPage.waitForTimeout(2000);

    // Apply for Master
    await newPage.getByRole("button", { name: "Master's Degree" }).click();
    await newPage.waitForTimeout(2000);

    await newPage.getByRole('button', { name: 'Create Application' }).nth(1).click();
    await newPage.waitForSelector('text=Mamata khanal', { state: 'visible', timeout: 30000 });
    await newPage.getByText('Mamata khanal').click();
    await newPage.waitForTimeout(2000);

    await newPage.locator('#cross-button-advisor').click();
    await newPage.waitForTimeout(2000);


});