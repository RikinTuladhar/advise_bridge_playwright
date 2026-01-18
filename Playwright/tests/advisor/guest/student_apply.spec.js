import { test, expect } from "@playwright/test";
import { login } from "./helper/stu_login.js";

test("Student Apply Now", async ({ page }) => {

  await login(page);
  await page.waitForTimeout(1000);
  // Open New Page 
  const popup = page.waitForEvent('popup');
  await page.locator(".fi-btn-label", { hasText: 'Apply Now' }).click();
  await page.waitForTimeout(3000);
  const newPage = await popup;

  /* ---Search Institution Name--- */
  await newPage.locator('button', { hasText: 'Search by college name...' }).click();
  const searchName = newPage.getByPlaceholder('Search by institution name...');
  await newPage.waitForTimeout(2000);
  await searchName.fill('Troy University');
  await newPage.waitForTimeout(2000);
  const dropdown = newPage.locator('ul.max-h-80');
  await dropdown.waitFor({ state: 'visible' });
  await dropdown.click();
  await expect(newPage).toHaveURL('https://www.advisebridge.com/institutions/troy-university');
  await newPage.waitForTimeout(2000);
  await newPage.getByRole('link', { name: 'Search' }).nth(0).click();
  await expect(newPage).toHaveURL('https://www.advisebridge.com/search');


  /* ---Apply for Institution--- */
  // Institution Types
  await newPage.click("//button[normalize-space()='Institution Types']");
  await newPage.waitForTimeout(1000);
  const searchInstitution = newPage.getByPlaceholder('Search...');
  await searchInstitution.fill("University");
  await newPage.waitForTimeout(1000);
  await newPage.locator('li', { hasText: 'University' }).locator('input[type="checkbox"]').check();
  await newPage.waitForTimeout(1000);
  // Countries 
  await newPage.click("//button[normalize-space()='Countries']");
  await newPage.waitForTimeout(1000);
  const searchCountry = newPage.getByPlaceholder('Search...');
  await searchCountry.fill("United States");
  await newPage.waitForTimeout(1000);
  await newPage.locator('li', { hasText: 'United States' }).locator('input[type="checkbox"]').check();
  await newPage.waitForTimeout(1000);
  // States 
  await newPage.click("//button[normalize-space()='States']");
  await newPage.waitForTimeout(1000);
  const searchStates = newPage.getByPlaceholder('Search...');
  await searchStates.fill("Texas")
  await newPage.waitForTimeout(1000);
  await newPage.locator('li', { hasText: 'Texas' }).locator('input[type="checkbox"]').check();
  await newPage.waitForTimeout(1000);
  // Education Levels 
  await newPage.click("//button[normalize-space()='Education Levels *']");
  await newPage.waitForTimeout(1000);
  const searchLevel = newPage.getByPlaceholder('Search...');
  await searchLevel.fill("Bachelor")
  await newPage.waitForTimeout(1000);
  await newPage.locator('li', { hasText: "Bachelor's Degree" }).click();
  await newPage.waitForTimeout(1000);
  // Majors
  await newPage.click("//button[normalize-space()='Majors *']");
  await newPage.waitForTimeout(1000);
  const searchMajors = newPage.getByPlaceholder('Search...');
  await searchMajors.fill("Agriculture")
  await newPage.waitForTimeout(1000);
  await newPage.locator('li', { hasText: "Agriculture" }).nth(0).click();
  await newPage.waitForTimeout(2000);
  await newPage.click("//button[normalize-space()='Apply']");
  await newPage.waitForTimeout(5000);
  await newPage.click("//button[normalize-space()='Clear All']");


  /* ---Find based on eligibility--- */
  const scrollDown = newPage.locator('div.grid a').nth(0);
  await scrollDown.scrollIntoViewIfNeeded();
  await expect(scrollDown).toBeVisible();
  await newPage.waitForTimeout(3000);
  await newPage.click("//button[normalize-space()='Find based on eligibility']");
  await newPage.waitForTimeout(2000);
  await newPage.click("//button[normalize-space()='Show colleges']");
  await newPage.waitForTimeout(2000);
  await newPage.click("//button[normalize-space()='Sort By']");
  await newPage.waitForTimeout(2000);
  await newPage.locator('input[type="radio"][value="az"]').click();
  await newPage.waitForTimeout(2000);
  await newPage.locator('div.grid a').nth(0).click();
  //Navigate to University 
  await newPage.waitForTimeout(2000);
  const coursesOffered = newPage.locator('h4', { hasText: 'Courses offered' });
  await coursesOffered.scrollIntoViewIfNeeded();
  await expect(coursesOffered).toBeVisible();
  // Apply for Bachelor Degree
  await newPage.getByRole('button', { name: "Bachelor's Degree" }).click();
  await newPage.waitForTimeout(2000);
  const courseBachelor = newPage.locator('div.group').nth(1);
  await courseBachelor.getByRole('button', { name: 'Apply Now' }).click();
  await newPage.waitForTimeout(2000);
  await newPage.click("//button[normalize-space()='Save and Continue']");
  await newPage.waitForTimeout(5000);
  // Apply for Master Degree
  await newPage.getByRole('button', { name: "Master's Degree" }).click();
  await newPage.waitForTimeout(2000);
  const courseMaster = newPage.locator('div.group').nth(1);
  await courseMaster.getByRole('button', { name: 'Apply Now' }).click();
  await newPage.waitForTimeout(2000);
  await newPage.click("//button[normalize-space()='Save and Continue']");
  await newPage.waitForTimeout(5000);

});
