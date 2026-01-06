import { test, expect } from "@playwright/test";
import{login} from"./Helper/advisor_login.js";

test("Create Student using helper", async ({ page }) => {
    await login(page);
    await page.goto('https://advisebridge.com/advisor/students');
    await page.click("text=New Student");
  });