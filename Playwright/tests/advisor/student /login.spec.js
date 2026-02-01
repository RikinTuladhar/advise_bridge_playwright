import { test, expect } from "@playwright/test";
import { StudentLoginPage } from "../pages/loginpage";
// import { waitForSeconds } from "../helpers/commonHelper";

test("Student Login Page", async ({ page }) => {
  const studentLogin = new StudentLoginPage(page);

  await studentLogin.goTo(); 
  await studentLogin.loginAsStudent(
    "mamatakhanal08@gmail.com",
    "mamatakhanal08@gmail.com"
  );

  await expect(page).toHaveURL("https://www.advisebridge.com/student");

  await waitForSeconds(page, 5);
});
