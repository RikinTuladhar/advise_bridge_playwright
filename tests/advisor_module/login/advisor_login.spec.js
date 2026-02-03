import { test } from "@playwright/test";
import { AdvisorPage } from "../../../pages/AdvisorPage";

test("Valid Login", async ({ page }) => {
  const advisor = {
    email: "chalaunrrabina@gmail.com",
    password: "bestNepal@123",
  };
  const advisor_page = new AdvisorPage(page);
  await advisor_page.goToAdvisorLoginGuest();
  await advisor_page.logInAsGuestToAdvisor(advisor.email, advisor.password);

  //await advisor_page.logout();
});


// test("Invalid email", async ({ page }) => {
//   const advisor = {
//     email: "invalid@gmail.com",
//     password: "bestNepal@123",
//   };
//   const advisor_page = new AdvisorPage(page);
//   await advisor_page.goToAdvisorLoginGuest();
//   await advisor_page.logInAsGuestToAdvisorInvalidEmail(advisor.email, advisor.password);
// });

// test("Invalid password", async ({ page }) => {
//   const advisor = {
//     email: "invalid@gmail.com",
//     password: "bestNepal@123",
//   };
//   const advisor_page = new AdvisorPage(page);
//   await advisor_page.goToAdvisorLoginGuest();
//   await advisor_page.logInAsGuestToAdvisorInvalidPassword(advisor.email, advisor.password);
// });
