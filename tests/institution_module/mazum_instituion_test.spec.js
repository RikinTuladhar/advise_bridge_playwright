import { expect, test } from '@playwright/test';
import path from 'path';

test('Log in and click Update institution profile', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://staging.advisebridge.com/institution/login');

  // Login
  await page.getByLabel('Email address*').fill('teamadvisebridge@gmail.com');
  await page.getByLabel('Password*', { exact: true }).fill('teamadvisebridge@gmail.com');
  await page.getByLabel('Remember me').check();

  // Click sign in and wait for navigation
  await Promise.all([
    page.waitForURL('https://staging.advisebridge.com/institution'),
    page.getByRole('button', { name: 'Sign in' }).click()
  ]);

  // Verify dashboard loaded
  await expect(page).toHaveURL('https://staging.advisebridge.com/institution');
  await page.waitForTimeout(1000);

  // Open institution profile
  await page.getByText('Update institution profile').click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // ============================================
  // INFORMATION TAB
  // ============================================
  // ============================================
  // INFORMATION TAB
  // ============================================
  // ============================================
  // INFORMATION TAB
  // ============================================
  // ============================================
  // INFORMATION TAB
  // ============================================
  await page.getByLabel('Video URL', { exact: true }).clear();
  await page.getByLabel('Video URL', { exact: true }).fill('https://youtube.com/shorts/7UNQ9lHESdQ?si=On2nNcX8e-sga55c');

  await page.getByLabel('Application Portal URL', { exact: true }).clear();
  await page.getByLabel('Application Portal URL', { exact: true }).fill('https://qa.portal.internal/apply/session/9d21e7');

  await page.getByLabel('Total Students', { exact: true }).clear();
  await page.getByLabel('Total Students', { exact: true }).fill('12000');

  // International Students - triple click to select all, then type
  await page.getByLabel('International Students', { exact: true }).click();
  await page.getByLabel('International Students', { exact: true }).press('Control+A');
  await page.getByLabel('International Students', { exact: true }).fill('4000');
  await page.waitForTimeout(500);

  // OR use this more reliable approach:
  // await page.getByLabel('International Students', { exact: true }).fill('', { force: true });
  // await page.getByLabel('International Students', { exact: true }).fill('4000');

  // Funding Type - click the label or the dropdown button
  await page.getByLabel('Funding Type*').click();
  await page.waitForTimeout(300);
  await page.getByRole('option', { name: 'Private' }).click();
  await page.waitForTimeout(300);

  // Institution Type
  await page.getByLabel('Institution Type*').click();
  await page.waitForTimeout(300);
  await page.getByRole('option', { name: 'University' }).click();
  await page.waitForTimeout(300);

  // Established Year
  await page.getByLabel('Established Year').click();
  await page.waitForTimeout(300);
  await page.getByRole('option', { name: '1977' }).click();
  await page.waitForTimeout(300);

  // Fill Notes
  await page.getByRole('textbox', { name: 'Notes' }).click();
  await page.getByRole('textbox', { name: 'Notes' }).press('Control+A');
  await page.getByRole('textbox', { name: 'Notes' }).fill(
    'This institution has consistently demonstrated a commitment to academic excellence and global engagement. With a diverse student body and strong private funding, it continues to expand research initiatives and foster innovation across disciplines.'
  );

  //Eligibility 


  await page.pause();
});