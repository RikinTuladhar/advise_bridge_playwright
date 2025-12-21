import test, { expect } from "playwright/test";

test("Home Page View", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AdviseBridge/);
    await expect(
        page.getByRole("link", { name: "Student", exact: true })
    ).toBeVisible();
    await expect(
        page.getByRole("link", { name: "Advisor", exact: true })
    ).toBeVisible();
    await expect(
        page.getByRole("link", { name: "Institution", exact: true })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Search" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Flag EN" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Register" })).toBeVisible();
});

test("Navbar Link Check", async ({ page }) => {
    await page.goto("/");
    const nav_bar_links = [
        { name: "Student", urlRegex: /\/students\/?$/ },
        { name: "Advisor", urlRegex: /\/advisors\/?$/ },
        { name: "Institution", urlRegex: /\/institutions\/?$/ },
        { name: "Search", urlRegex: /\/search\/?$/ },
        { name: "Login", urlRegex: /\/login\?tab=advisor\/?$/ },
        { name: "Register", urlRegex: /\/register\?tab=advisor\/?$/ },
    ];

    for (const link of nav_bar_links) {
        await page.locator('header a', {hasText: link.name}).first().click();
        await expect(page).toHaveURL(link.urlRegex);
        await page.goto("/", { waitUntil: "networkidle" });
    }
});
