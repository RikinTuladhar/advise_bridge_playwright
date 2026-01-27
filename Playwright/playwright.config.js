// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  timeout: 120000, // 2 minutes for all tests
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  
  use: {
    // 👇 Set default base URL
    baseURL: "https://staging.advisebridge.com",
    httpCredentials: {
      username: 'advisebridge',
      password: 'advisebridge',
    },
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //     name: "firefox",
    //     use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //     name: "webkit",
    //     use: { ...devices["Desktop Safari"] },
    // },
  ],

  // 👇 Update your local web server settings
  /*
    webServer: {
        command: "npm run start",
        url: "https://advisebridge.com",
        reuseExistingServer: !process.env.CI,
    },
    */
});
