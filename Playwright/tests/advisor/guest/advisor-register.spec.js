import { expect, test } from "@playwright/test";
import { advisor_register } from "../../../datas/advisor-creation";
import { google_login } from "../../../datas/google_login";

test("Advisor Register", async ({ page }) => {
    const advisor_data = advisor_register;
    const { company_name, email, password, confirm_password } = advisor_data;
    const { email: google_email, password: google_password } = google_login;
    await page.goto("https://advisebridge.com/register?tab=advisor");
    await page.fill("input[name='name']", company_name);
    await page.fill("input[name='email']", email);
    await page.fill("input[name='password']", password);
    await page.fill("input[name='password_confirmation']", confirm_password);
    await page.click("button[type='submit']");
    await page.waitForURL(
        "https://advisebridge.com/advisor/email-verification/prompt"
    );
    await expect(
        page.getByRole("heading", { name: "Verify your email address" })
    ).toBeVisible();

    await page.goto("https://accounts.google.com/");
    await page.locator("input[type='email']").fill(google_email);
    await page.getByRole("button", { name: "Next" }).click();
    await page.locator("input[type='password']").fill(google_password);
    await page.getByRole("button", { name: "Next" }).click();
    await page.waitForURL("https://myaccount.google.com/*");
    await page.goto("https://mail.google.com/mail/u/0/#inbox");

    await expect(page.getByRole("main")).toContainText("Promotions");
    await expect(page.getByRole("tab", { name: "Promotions" })).toBeVisible();
    await page.getByRole("tab", { name: "Promotions" }).click();
    await page.getByRole("tab", { name: "Primary" }).click();
    await expect(page.getByRole("tab", { name: "Promotions" })).toBeVisible();

    await page
        .locator("tr")
        .getByRole("link", { name: "Verify Your Email Address" })
        .first()
        .click();

    const list_items_mails = await page.locator("div[role='listitem']");
    let verificationUrl;
    if ((await list_items_mails.count()) > 0) {
        const last_item_list = list_items_mails.last();
        verificationUrl = await last_item_list
            .locator("a")
            .filter({ hasText: "Verify Email Address" })
            .getAttribute("href");
    } else {
        verificationUrl = await page
            .locator("a", { hasText: "Verify Email Address" })
            .getAttribute("href");
    }

    if (verificationUrl) {
        await page.goto(verificationUrl);
    } else {
        throw new Error("Verification URL not found");
    }
    console.log("✅Registed and Login successfull");
    // await page.waitForURL("https://advisebridge.com/login");
    // await page.fill("input[name='email']", email);
    // await page.fill("input[name='password']", password);
    // await page.click("button[type='submit']");
    // await page.waitForURL("https://advisebridge.com/advisor/*");
});
