//const {test,expect}=require('@playwright/test')
import { expect, test } from "@playwright/test";
test("Student Login Page", async ({ page }) => {
  await page.goto("https://www.advisebridge.com/login?tab=student");

  //Click on Login button - property
  //await page.locator('').click()
  await page.click("text=Student");

  //provide email - CSS
  //await page.locator('#email').fill("mamatakhanal08@gmail.com")
  //await page.type('#email','mamatakhanal08@gmail.com')
  await page.fill("#email", "mamatakhanal08@gmail.com");

  //provide password -  CSS
  //await page.fill("input[id='password']",'mamatakhanal08@gmail.com')
  await page.fill("#password", "mamatakhanal08@gmail.com");

  //click on Login button - Xpath
  await page.click("//button[normalize-space()='Log in as student']");

  await expect(page).toHaveURL("https://www.advisebridge.com/student");
  await page.waitForTimeout(5000);
  await page.locator(".fi-dropdown-trigger.flex.cursor-pointer").first().click();
  await page.waitForTimeout(5000);
});
