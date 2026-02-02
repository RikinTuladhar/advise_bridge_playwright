import { test } from "@playwright/test";
import { impersonateAdvisor } from "../../../utils/adminUtils";

test("Admin search + impersonate specific user", async ({ page }) => {
    const value = "senyadt2@gmail.com";
    await impersonateAdvisor(page, value);
});
