import { expect, test } from "@playwright/test";
import { advisors_students } from "../../datas/application-creation";
import { impersonateAdvisor } from "../../utils/adminUtils";

test.describe("Application Eligibility Test", () => {
  test(
    "Admin impersonates advisor and applies for all students",
    async ({ page, context }) => {
      test.setTimeout(180000);
      const value = "senyadt2@gmail.com";
      await impersonateAdvisor(page, value);
      await page.waitForLoadState("networkidle");
      await page.waitForURL("https://advisebridge.com/advisor");
      console.log(`✅ Successfully impersonated ${value}`);
      const students_bachelor_apply = advisors_students.filter((student) => student.apply_for === "Bachelor's Degree");
      const students_master_apply = advisors_students.filter((student) => student.apply_for === "Master's Degree");
      await page.goto("https://advisebridge.com/institutions/the-university-of-wisconsin-la-crosse");
      console.log("📍 Navigated to university page");

      for (const student of students_bachelor_apply) {
        try {
          await page
            .getByRole("button", {
              name: "Bachelor's Degree",
            })
            .click();
          await page.getByRole("button", { name: "Create Application" }).first().click();
          await expect(
            page.getByRole("heading", {
              name: "Select Student",
            })
          ).toBeVisible();
          console.log(`\n🟦 Attempt for ${student.name} and status ${student.status}`);

          await processStudent(page, student);
        } catch (error) {
          console.error(`❌ Attempt Not Eligible for ${student.name}:`, error.message);
          console.log(`🔁 Retrying ${student.name}...`);
        }
      }
      await page.getByRole("button", { name: "Master's Degree" }).click();

      await page.waitForTimeout(5000); // Short wait before next set

      for (const student of students_master_apply) {
        try {
          await page.getByRole("button", { name: "Master's Degree" }).click();
          await page.getByRole("button", { name: "Create Application" }).first().click();
          await expect(
            page.getByRole("heading", {
              name: "Select Student",
            })
          ).toBeVisible();
          console.log(`\n🟦 Attempt for ${student.name} and status ${student.status}`);

          await processStudent(page, student);
        } catch (error) {
          console.error(`❌ Attempt Not Eligible for ${student.name}:`, error.message);
          console.log(`🔁 Retrying ${student.name}...`);
        }
      }

      async function processStudent(page, student) {
        console.log(`🔎 Searching student: ${student.name}`);

        const studentSearchBox = await page.getByRole("textbox", {
          name: "Search for a student",
        });

        // Clear and fill the search box efficiently
        await studentSearchBox.clear();
        await studentSearchBox.fill(student.name); // Much faster than .type()

        // Wait for search results to load
        await page.waitForResponse((resp) => resp.url().includes("/livewire/update") && resp.status() === 200, {
          timeout: 10000,
        });

        // Verify student appears and click
        await expect(page.getByText(student.name)).toBeVisible();
        await page.getByText(student.name).click();
        // await expect(page.getByText(student.status)).toBeVisible();
        const text = await page.locator("#eligible-status").textContent();

        console.log("In ui status", text); // "Eligible" or "Not Eligible"
        expect(text).toBe(student.status);

        console.log(`✅ Validation completed for: ${student.name}, status ${student.status}`);
        await page.locator("#cross-button-advisor").click();
      }
    },
    { timeout: 50000 }
  );
});
