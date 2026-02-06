import { expect, test } from '@playwright/test';
import path from 'path';

test('Log in and click Update institution profile', async ({ page }) => {
  await page.goto('https://staging.advisebridge.com/institution/login');

  // Login
  await page.getByLabel('Email address*').fill('teamadvisebridge@gmail.com');
  await page.getByLabel('Password*', { exact: true }).fill('Teamadvisebridge00#');
  await page.getByLabel('Remember me').check();
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for dashboard
  await expect(page).toHaveURL('https://staging.advisebridge.com/institution');

  // Open institution profile
  await page.getByText('Update institution profile').click();

  // Fill Information tab fields
  await page.getByLabel('Video URL', { exact: true }).fill('https://youtube.com/shorts/7UNQ9lHESdQ?si=On2nNcX8e-sga55c');
  await page.getByLabel('Application Portal URL', { exact: true }).fill('https://qa.portal.internal/apply/session/9d21e7');
  await page.getByLabel('Total Students', { exact: true }).fill('12000');
  await page.getByLabel('International Students', { exact: true }).fill('4000');
  await page.getByText("Select Funding Type").click();
  await page.getByRole("option", { name: "Private" }).click();

  await page.getByText("Select Institution Type").click();
  await page.getByRole("option", { name: "University" }).click();

  await page.getByText("Select Year").click();
  await page.getByRole("option", { name: "1977" }).click();

  await page.getByRole('textbox', { name: 'Notes' }).fill(
    'This institution has consistently demonstrated a commitment to academic excellence and global engagement. With a diverse student body and strong private funding, it continues to expand research initiatives and foster innovation across disciplines.'
  );

  //  Navigate to Images tab
  await page.getByRole('tab', { name: 'Images' }).click();
  await expect(page.locator('//div[@id="data.logo"]//input[@type="file"]')).toBeVisible();

  //  File path setup (points to files/institution_images/dp.jpg)
  const filePath = path.join(__dirname, '../../files/institution_images/dp.jpg');

  // Logo
  await page.locator('//div[@id="data.logo"]//input[@type="file"]').setInputFiles(filePath);

  // Thumbnail
  await page.locator('//div[@id="data.thumbnail"]//input[@type="file"]').setInputFiles(filePath);

  // Cover
  await page.locator('//div[@id="data.cover"]//input[@type="file"]').setInputFiles(filePath);

  // Extra images
  await page.locator('//div[@data-style-panel-layout="grid"]//input[@type="file"]').setInputFiles(filePath);

  // Additional images


  // Navigate to Description tab
  await page.getByRole('tab', { name: 'Description' }).click();

  // Institution Description
  const institutionDescription = page.locator('#data\\.institution_description');
  await institutionDescription.click();
  await institutionDescription.fill(
    'Team AdviseBridge University is a globally recognized institution offering diverse programs in science, technology, and humanities. It emphasizes innovation, research, and international collaboration.'
  );

  // Glance Description
  const glanceDescription = page.locator('#data\\.glance_description');
  await glanceDescription.click();
  await glanceDescription.fill(
    'At a glance: 12,000 students, 4,000 international students, strong private funding, and a commitment to excellence.'
  );

  // Overview Description
  const overviewDescription = page.locator('#data\\.overview_description');
  await overviewDescription.click();
  await overviewDescription.fill(
    'Founded in 1977, Team AdviseBridge University has consistently expanded its academic offerings and research initiatives. With a diverse student body and strong global partnerships, it continues to foster innovation and leadership across disciplines.'
  );

  // Navigate to Eligibilities tab
  await page.getByRole('tab', { name: 'Eligibilities' }).click();
  await page.waitForTimeout(1000);

  // Click "Add More" to create the first eligibility entry
  await page.getByRole('button', { name: 'Add More' }).click();
  await page.waitForTimeout(1000); // Give it more time

  // Click the chevron/arrow button to expand - try multiple selectors
  try {
    await page.locator('button').filter({ hasText: /chevron|toggle/i }).click({ timeout: 5000 });
  } catch {
    // If that fails, try clicking near the trash icon
    await page.locator('button[type="button"]').nth(1).click();
  }

  await page.waitForTimeout(500);

  // Now the form should be visible - fill in the fields
  await page.locator('text=Select Education Level').first().click();
  await page.getByRole('option', { name: "Bachelor's Degree" }).click();

  await page.locator('text=Select Education Level').nth(1).click();
  await page.getByRole('option', { name: "High School" }).click();

  await page.locator('text=Select GPA Total').click();
  await page.getByRole('option', { name: "3.25" }).click();

  // Fill IELTS - simpler approach
  await page.locator('input[type="text"]').filter({ hasText: /ielts/i }).fill('8');

  // Fill SAT
  await page.locator('input[type="text"]').filter({ hasText: /sat/i }).fill('1200');

  await page.pause();



});
