import { expect, test } from '@playwright/test';
import path from 'path';

test('Log in and click Update institution profile', async ({ page }) => {
  await page.goto('https://staging.advisebridge.com/institution/login');

  // Login
  await page.getByLabel('Email address*').fill('teamadvisebridge@gmail.com');
  await page.getByLabel('Password*', { exact: true }).fill('Teamadvisebridge00#');
  await page.getByLabel('Remember me').check();

  // Click sign in and wait for navigation
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.getByRole('button', { name: 'Sign in' }).click()
  ]);

  // Wait for dashboard with longer timeout
  await expect(page).toHaveURL('https://staging.advisebridge.com/institution', { timeout: 15000 });
  await page.waitForTimeout(2000);

  // Open institution profile
  await page.getByText('Update institution profile').click();
  await page.waitForTimeout(2000);

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

  // Navigate to Images tab
  await page.getByRole('tab', { name: 'Images' }).click();
  await expect(page.locator('//div[@id="data.logo"]//input[@type="file"]')).toBeVisible();

  // File path setup
  const filePath = path.join(__dirname, '../../files/institution_images/dp.jpg');

  // Upload images
  await page.locator('//div[@id="data.logo"]//input[@type="file"]').setInputFiles(filePath);
  await page.locator('//div[@id="data.thumbnail"]//input[@type="file"]').setInputFiles(filePath);
  await page.locator('//div[@id="data.cover"]//input[@type="file"]').setInputFiles(filePath);
  await page.locator('//div[@data-style-panel-layout="grid"]//input[@type="file"]').setInputFiles(filePath);

  // Navigate to Description tab
  await page.getByRole('tab', { name: 'Description' }).click();

  const institutionDescription = page.locator('#data\\.institution_description');
  await institutionDescription.click();
  await institutionDescription.fill(
    'Team AdviseBridge University is a globally recognized institution offering diverse programs in science, technology, and humanities. It emphasizes innovation, research, and international collaboration.'
  );

  const glanceDescription = page.locator('#data\\.glance_description');
  await glanceDescription.click();
  await glanceDescription.fill(
    'At a glance: 12,000 students, 4,000 international students, strong private funding, and a commitment to excellence.'
  );

  const overviewDescription = page.locator('#data\\.overview_description');
  await overviewDescription.click();
  await overviewDescription.fill(
    'Founded in 1977, Team AdviseBridge University has consistently expanded its academic offerings and research initiatives. With a diverse student body and strong global partnerships, it continues to foster innovation and leadership across disciplines.'
  );
  // Navigate to Eligibilities tab
  await page.getByRole('tab', { name: 'Eligibilities' }).click();
  await page.waitForTimeout(1000);

  // Click "Add More"
  await page.getByRole('button', { name: 'Add More' }).click();
  await page.waitForTimeout(2000);

  // FORCE EXPAND: Click the chevron button (down arrow) next to trash icon
  // Find the button container and click the second button (chevron, not trash)
  await page.locator('[wire\\:key] header button').nth(1).click();
  await page.waitForTimeout(1500);

  // Wait for form to be visible
  await page.waitForSelector('text=Education level', { state: 'visible' });

  // Fill Education Level dropdown
  const educationLevelDropdown = page.locator('select, [role="button"]').filter({ hasText: /^Select Education Level$/ }).first();
  await educationLevelDropdown.click();
  await page.waitForTimeout(300);
  await page.getByRole('option', { name: "Bachelor's Degree" }).click();
  await page.waitForTimeout(500);

  // Fill Required Education Level dropdown
  const requiredEducationDropdown = page.locator('select, [role="button"]').filter({ hasText: /^Select Education Level$/ }).last();
  await requiredEducationDropdown.click();
  await page.waitForTimeout(300);
  await page.getByRole('option', { name: 'High School' }).click();
  await page.waitForTimeout(500);

  // Fill GPA Total dropdown
  const gpaDropdown = page.locator('select, [role="button"]').filter({ hasText: /^Select GPA Total$/ });
  await gpaDropdown.click();
  await page.waitForTimeout(300);
  await page.getByRole('option', { name: '3.25' }).click();
  await page.waitForTimeout(500);

  // Fill IELTS (find input by ID or name attribute)
  const ieltsInput = page.locator('input').filter({ hasText: '' }).nth(2); // Adjust index
  await ieltsInput.fill('7.5');
  await page.waitForTimeout(300);

  // Fill SAT
  const satInput = page.locator('input').filter({ hasText: '' }).nth(6); // Adjust index
  await satInput.fill('1200');

  await page.pause();
});