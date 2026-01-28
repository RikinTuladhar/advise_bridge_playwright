// // // import { test, expect } from "@playwright/test";

// // // test("Institution Login Test - Fill Only", async ({ page }) => {
// // //   // Step 1: Go to the login page
// // //   await page.goto("https://advisebridge.com/institution/login");

// // //   // Step 2: Wait for the email field to appear
// // //   await page.waitForSelector('input[placeholder="Email address"]');

// // //   // Step 3: Fill in the email
// // //   await page.fill('input[placeholder="Email address"]', "mazumpaudel02@gmail.com");

// // //   // Step 4: Fill in the password
// // //   await page.fill('input[placeholder="Password"]', "advisebridge@123");

// // //   // Step 5: Wait for 5 seconds to observe the filled fields
// // //   await page.waitForTimeout(5000);
// // // });


// // // import { test, expect } from "@playwright/test";

// // // test("Institution Login Test - Fill Only", async ({ page }) => {
// // //   await page.goto("https://advisebridge.com/institution/login");
// // //   await page.waitForLoadState("domcontentloaded");

// // //   // Try using label-based selectors
// // //   await page.getByLabel("Email address").fill("mazumpaudel02@gmail.com");
// // //   await page.getByLabel("Password").fill("advisebridge@123");

// // //   await page.waitForTimeout(5000);
// // // });


// // // import { test, expect } from "@playwright/test";

// // // test("Staging - Institution Login Test", async ({ page }) => {
// // //   // Step 1: Go to staging login page
// // //   await page.goto("https://staging.advisebridge.com/institution/login");

// // //   // Step 2: Wait for page to load
// // //   await page.waitForLoadState("domcontentloaded");

// // //   // Step 3: Fill email
// // //   await page.getByLabel("Email address").fill("mazumpaudel02@gmail.com");

// // //   // Step 4: Fill password
// // //   await page.getByLabel("Password").fill("advisebridge@123");

// // //   // Step 5: Wait 5 seconds to see the fields filled
// // //   await page.waitForTimeout(5000);
// // // });

// // // import { test, expect } from "@playwright/test";

// // // test("Staging - Institution Login Test", async ({ page }) => {
// // //   // Step 1: Go to staging login page with credentials
// // //   await page.goto("https://advisebridge:advisebridge@staging.advisebridge.com/institution/login");

// // //   // Step 2: Wait for page to load
// // //   await page.waitForLoadState("domcontentloaded");

// // //   // Step 3: Fill email
// // //   await page.getByLabel("Email address").fill("mazumpaudel02@gmail.com");

// // //   // Step 4: Fill password
// // //   await page.getByLabel("Password").fill("advisebridge@123");

// // //   // Step 5: Wait 5 seconds to see the fields filled
// // //   await page.waitForTimeout(5000);
// // // });


// // // import { test, expect } from "@playwright/test";

// // // test("Staging - Institution Login Test", async ({ page }) => {
// // //   // Step 1: Go to staging login page with credentials
// // //   await page.goto("https://advisebridge:advisebridge@staging.advisebridge.com/institution/login");

// // //   // Step 2: Wait for page to load
// // //   await page.waitForLoadState("domcontentloaded");

// // //   // Step 3: Fill email
// // //   await page.getByLabel("Email address").fill("mazumpaudel02@gmail.com");

// // //   // Step 4: Fill password
// // //   await page.getByLabel("Password").fill("advisebridge@123");

// // //   // Step 5: Wait 15 seconds so you can see the result
// // //   await page.waitForTimeout(15000);
// // // });

// // //import { test, expect } from "@playwright/test";

// // // test("Staging - Institution Login Test", async ({ page }) => {
// // //   // Step 1: Go to staging login page with credentials
// // //   await page.goto("/institution/login");

// // //   // Step 2: Wait for page to load
// // //   await page.waitForLoadState("domcontentloaded");

// // //   // Step 3: Fill email
// // //   await page.getByLabel("Email address").fill("mazumpaudel03@gmail.com");

// // //   // Step 4: Fill password
// // //   await page.getByLabel("Password").fill("advisebridge@123");

// // //   // Step 5: Click the Sign in button
// // //   await page.getByRole("button", { name: "Sign in" }).click();

// // //   // Step 6: Wait to see what happens after login
// // //   await page.waitForTimeout(15000);
// // // });

// // import { test, expect } from "@playwright/test";

// // test("Staging - Institution Login Test", async ({ page }) => {
// //   // Step 1: Go to login page (baseURL is added automatically!)
// //   await page.goto("/institution/login");

// //   // Step 2: Wait for page to load
// //   await page.waitForLoadState("domcontentloaded");

// //   // Step 3: Fill email
// //   await page.getByLabel("Email address").fill("mazumpaudel03@gmail.com");

// //   // Step 4: Fill password
// //   await page.getByLabel("Password").fill("advisebridge@123");

// //   // Step 5: Click the Sign in button
// //   await page.getByRole("button", { name: "Sign in" }).click();

// //   // Step 6: Wait for dashboard to load
// //   await page.waitForLoadState("networkidle");

// //   // Step 7: Click the Apply Now button
// //   await page.getByRole("button", { name: "Apply Now" }).click();

// //   // Step 8: Wait to see what happens after login
// //   await page.waitForTimeout(15000);
// // });

// // 


// import { test, expect } from "@playwright/test";

// test("Staging - Institution Login and Create Profile", async ({ page }) => {
//   // Step 1-5: Login
//   await page.goto("/institution/login");
//   await page.waitForLoadState("domcontentloaded");
//   await page.getByLabel("Email address").fill("mazumpaudel03@gmail.com");
//   await page.getByLabel("Password").fill("advisebridge@123");
//   await page.getByRole("button", { name: "Sign in" }).click();

//   // Step 6: Wait for navigation to dashboard
//   await page.waitForURL("**/institution");
//   await page.waitForTimeout(3000); // Wait 3 seconds for everything to load

//   // Step 7: Click Apply Now (try different selector)
//   await page.click('button:has-text("Apply Now")');

//   // Step 8: Wait for form
//   await page.waitForTimeout(2000);
// })

// import { test, expect } from "@playwright/test";

// test("Staging - Institution Login and Create Profile", async ({ page }) => {
//   // Login
//   await page.goto("/institution/login");
//   await page.waitForLoadState("domcontentloaded");
//   await page.getByLabel("Email address").fill("mazumpaudel03@gmail.com");
//   await page.getByLabel("Password").fill("advisebridge@123");
//   await page.getByRole("button", { name: "Sign in" }).click();

//   // Wait and pause here
//   await page.waitForTimeout(5000);
//   await page.pause(); // This will pause and let you inspect!
// });


// import { test, expect } from "@playwright/test";

// test("Staging - Institution Login and Open Profile Form", async ({ page }) => {
//   // Step 1: Login
//   await page.goto("https://staging.advisebridge.com/institution/login");
//   await page.waitForLoadState("domcontentloaded");
//   await page.getByLabel("Email address").fill("mazumpaudel03@gmail.com");
//   await page.getByLabel("Password").fill("advisebridge@123");
//   await page.getByRole("button", { name: "Sign in" }).click();

//   // Step 2: Wait for dashboard to load
//   await page.waitForTimeout(3000);

//   // Step 3: Click "Update institution profile"
//   await page.getByText("Update institution profile", { exact: false }).click();

//   // Step 4: Confirm Institution Information page loaded
//   await expect(page.getByText("Institution Information")).toBeVisible();

//     // Fill Institution Name
//   await page.getByLabel("Name*", { exact: true }).fill("ElixirAI");
//   await page.getByLabel("Email*", { exact: true }).fill("mazumpaudel03@gmail.com");



//   // Step 5: Pause to inspect the form
//   await page.pause();




// });

// import { test, expect } from '@playwright/test';

// test('Sign up with testingmazum account', async ({ page }) => {
//   // Step 1: Go to the login page
//   await page.goto('https://staging.advisebridge.com/institution/login');

//   // Step 2: Click the "sign up for an account" link
//   await page.getByText('sign up for an account').click();

//   // Step 3: Fill the sign-up form
//   await page.getByLabel('Institution Name*').fill('testingmazum');
//   await page.getByLabel('Email address*').fill('testingmazum02@gmail.com');
//   await page.getByLabel('Password*', { exact: true }).fill('testingmazum123');
//   await page.getByLabel('Confirm password*', { exact: true }).fill('testingmazum123');

//   // Step 4: Submit the form
//   await page.getByRole('button', { name: 'Sign up' }).click();

//   // Step 5: Wait for dashboard to load
//   await expect(page).toHaveURL(/institution/); // adjust if needed

//   // Step 6: Click "Update institution profile"
//   await page.getByRole('button', { name: 'Update institution profile' }).click();
// });

import { test, expect } from '@playwright/test';

test('Log in and click Update institution profile', async ({ page }) => {
  await page.goto('https://staging.advisebridge.com/institution/login');

  await page.getByLabel('Email address*').fill('testingmazum02@gmail.com');
  await page.getByLabel('Password*', { exact: true }).fill('testingmazum123');
  await page.getByLabel('Remember me').check();
  await page.getByRole('button', { name: 'Sign in' }).click();

  

  // Step 5: Wait for dashboard URL
  await expect(page).toHaveURL('https://staging.advisebridge.com/institution');

  // Step 6: Wait for the button to appear
  await page.getByText('Update institution profile').click();

  // ✅ Step 7: Fill profile fields 
  await page.getByLabel('Video URL', { exact: true }).fill('https://youtube.com/shorts/7UNQ9lHESdQ?si=On2nNcX8e-sga55c');
  await page.getByLabel('Application Portal URL', { exact: true }).fill('https://qa.portal.internal/apply/session/9d21e7');
  await page.getByLabel('Total Students', { exact: true }).fill('12000');
  await page.getByLabel('International Students', { exact: true }).fill('4000');
  await page.getByText("Select Funding Type").click();
  await page.getByRole("option", { name: "Private" }).click();

  await page.getByText("Select Institution Type").click();
  await page.getByRole("option", { name: "University" }).click();

  // Established Year dropdown
  await page.getByText("Select Year").click();
  await page.getByRole("option", { name: "1977" }).click();
  await page.getByRole('textbox', { name: 'Notes' }).fill(
    'This institution has consistently demonstrated a commitment to academic excellence and global engagement. With a diverse student body and strong private funding, it continues to expand research initiatives and foster innovation across disciplines.'
  );






  await page.pause();

});
