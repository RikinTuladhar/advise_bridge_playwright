// import { test } from "@playwright/test";
// import { AdvisorLoginPage } from "../../../pages/advisor/advisor_login.js";
// import { advisor_login } from "../../../datas/advisor_data.js";

// test("Valid Login", async ({ page }) => {
//     const advisorPage = new AdvisorLoginPage(page);
//   await advisorPage.goToAdvisorLoginGuest();
//   await advisorPage.logInAsGuestToAdvisor(advisor_login.email, advisor_login.password);
//   await advisorPage.sucessfullLogin();
// });


// // test("Invalid email", async ({ page }) => {
// //   const advisor = {
// //     email: "invalid@gmail.com",
// //     password: "bestNepal@123",
// //   };
// //   const advisor_page = new AdvisorPage(page);
// //   await advisor_page.goToAdvisorLoginGuest();
// //   await advisor_page.logInAsGuestToAdvisorInvalidEmail(advisor.email, advisor.password);
// // });

// // test("Invalid password", async ({ page }) => {
// //   const advisor = {
// //     email: "invalid@gmail.com",
// //     password: "bestNepal@123",
// //   };
// //   const advisor_page = new AdvisorPage(page);
// //   await advisor_page.goToAdvisorLoginGuest();
// //   await advisor_page.logInAsGuestToAdvisorInvalidPassword(advisor.email, advisor.password);
// // });

import { test, expect} from '@playwright/test';
import { AdvisorLoginPage } from '../../../pages/advisor/advisor_login';
import { advisor_login } from "../../../datas/advisor_data.js";

test('test', async ({ page })=> {
// Login
const AdvisorPage=new AdvisorLoginPage(page);
await AdvisorPage.goToAdvisorLoginGuest();
await AdvisorPage.logInAsGuestToAdvisor(advisor_login.email, advisor_login.password)
await AdvisorPage.sucessfullLogin();
await page.waitForTimeout(2000);

})