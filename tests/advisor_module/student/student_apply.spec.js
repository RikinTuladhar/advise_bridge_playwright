import { test, expect } from '@playwright/test';
import login, { advisorLogin } from "../../../helper/login.js";

test('Student Apply', async ({ page }) => {
    await advisorLogin(page);

    // Wait for navigation and get the new page context
   // const [page1] = await Promise.all([page.waitForEvent('popup'),page.getByRole('link', { name: 'Apply Now' }).click()]);
  const popup = page.waitForEvent("popup");
  await page.locator(".fi-btn-label", { hasText: "Apply Now" }).click();
  await page.waitForTimeout(3000);
  const newPage = await popup;


   /* ---Search Institution Name--- */ 
  await newPage.locator("button", { hasText: "Search by college name..." }).click();
  const searchName = newPage.getByPlaceholder("Search by institution name...");
  await newPage.waitForTimeout(2000);
  await searchName.fill("Auburn University Montgomery");
  await newPage.waitForTimeout(2000);
  const dropdown = newPage.locator("ul.max-h-80");
  await dropdown.waitFor({ state: "visible" });
  await dropdown.click();
  await expect(newPage).toHaveURL("/institutions/auburn-university-montgomery");
  await newPage.waitForTimeout(2000);
  await newPage.getByRole("link", { name: "Search" }).nth(0).click();
  await expect(newPage).toHaveURL("/search");

/* ---Apply for Institution--- */
  // Institution Types
  await newPage.click("//button[normalize-space()='Institution Types']");
  await newPage.waitForTimeout(1000);
  const searchInstitution = newPage.getByPlaceholder("Search...");
  await searchInstitution.fill('University');
  await newPage.waitForTimeout(1000);
  await newPage.locator("li", { hasText: "University" }).locator('input[type="checkbox"]').check();
  await newPage.waitForTimeout(1000);
  // Countries
  await newPage.click("//button[normalize-space()='Countries']");
  await newPage.waitForTimeout(1000);
  const searchCountry = newPage.getByPlaceholder("Search...");
  await searchCountry.fill('United States');
  await newPage.waitForTimeout(1000);
  await newPage.locator("li", { hasText: "United States" }).locator('input[type="checkbox"]').check();
  await newPage.waitForTimeout(1000);
  // States
  await newPage.click("//button[normalize-space()='States']");
  await newPage.waitForTimeout(1000);
  const searchStates = newPage.getByPlaceholder("Search...");
  await searchStates.fill('California');
  await newPage.waitForTimeout(1000);
  await newPage.locator("li", { hasText: "California" }).locator('input[type="checkbox"]').check();
  await newPage.waitForTimeout(1000);
  // Education Levels
  await newPage.click("//button[normalize-space()='Education Levels *']");
  await newPage.waitForTimeout(1000);
  const searchLevel = newPage.getByPlaceholder("Search...");
  await searchLevel.fill("Bachelor's Degree");
  await newPage.waitForTimeout(1000);
  await newPage.locator("li", { hasText: "Bachelor's Degree" }).click();
  await newPage.waitForTimeout(1000);
  // Majors
  await newPage.click("//button[normalize-space()='Majors *']");
  await newPage.waitForTimeout(1000);
  const searchMajors = newPage.getByPlaceholder("Search...");
  await searchMajors.fill("Actuarial Science");
  await newPage.waitForTimeout(1000);
  await newPage.locator("li", { hasText: "Actuarial Science" }).nth(0).click();
  await newPage.waitForTimeout(2000);
  await newPage.click("//button[normalize-space()='Apply']");
  await newPage.waitForTimeout(5000);
  await newPage.click("//button[normalize-space()='Clear All']");

// /* ======Find based on eligibility======= */
//   const scrollDown = newPage.locator("div.grid a").nth(0);
//   await scrollDown.scrollIntoViewIfNeeded();
//   await expect(scrollDown).toBeVisible();
//   await newPage.waitForTimeout(3000);
//   await newPage.click("//button[normalize-space()='Find based on eligibility']");
//   await newPage.waitForTimeout(2000);
//    await newPage.click("//button[normalize-space()='Search student by name']");
//   await newPage.waitForTimeout(2000);
//   await newpage.getByText('akshata nepal').click();
//   await newPage.click("//button[normalize-space()='Sort By']");
//    await newPage.waitForTimeout(2000);
//    await newPage.locator('input[type="radio"][value="az"]').click();
//   await newPage.waitForTimeout(2000);
//    await newPage.locator("div.grid a").nth(0).click();
//   await newPage.waitForTimeout(2000);
//   await newPage.getByRole('link', { name: 'Courses offered' }).click();

  /* ======Find based on eligibility======= */
const scrollDown = newPage.locator("div.grid a").nth(0);
await scrollDown.scrollIntoViewIfNeeded();
await expect(scrollDown).toBeVisible();

// Click "Find based on eligibility" button
await newPage.getByRole('button', { name: 'Find based on eligibility' }).click();

// Wait for and click student name
await newPage.waitForSelector('text=akshata nepal', { state: 'visible' });
await newPage.getByText('akshata nepal').click();

await newPage.getByRole('link', { name: 'University of Findlay' }).click();


  // Apply for Bachelor Degree
  await newPage.getByRole("button", { name: "Bachelor's Degree" }).click();
  await newPage.waitForTimeout(2000);
  //const courseBachelor = newPage.locator("div.group").nth(1);
   await newPage.getByRole('button', { name: 'Create Application' }).nth(1).click();
  await courseBachelor.getByRole("button", { name: "Apply Now" }).click();
  await newPage.waitForTimeout(2000);
  await newPage.click("//button[normalize-space()='Save and Continue']");
  await newPage.waitForTimeout(5000);
  // // Apply for Master Degree
  // await newPage.getByRole("button", { name: "Master's Degree" }).click();
  // await newPage.waitForTimeout(2000);
  // const courseMaster = newPage.locator("div.group").nth(1);
  // await courseMaster.getByRole("button", { name: "Apply Now" }).click();
  // await newPage.waitForTimeout(2000);
  // await newPage.click("//button[normalize-space()='Save and Continue']");
  // await newPage.waitForTimeout(5000);
});