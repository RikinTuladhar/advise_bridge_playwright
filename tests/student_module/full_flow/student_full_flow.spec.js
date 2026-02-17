import { test } from "@playwright/test";
import { studentLogin } from "../login/student_login.spec.js";
import { StudentMyprofile } from "../profile/student_myprofile_update.spec.js";

test.describe.serial("Student Full Flow", () => {
    test("Login Student", async ({ page }) => {
        await studentLogin(page);
    });
    test("Update My-profile", async ({page}) =>{
        await StudentMyprofile(page);
    })

});
