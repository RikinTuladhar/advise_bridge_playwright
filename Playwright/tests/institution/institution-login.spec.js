import test, { expect } from "playwright/test";
import { institutionData } from "../../datas/institution-data";

test("Login for institution", async ({ page }) => {
  const insitution_data = institutionData;
  await page.goto("https://advisebridge.com/institution/login");
  await page.getByRole("textbox", { name: "Email address*" }).fill(insitution_data.email);
  await page.getByRole("textbox", { name: "Password*" }).fill(insitution_data.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("link", { name: "Update institution profile" }).click();
  await expect(page).toHaveURL(
    /https:\/\/advisebridge\.com\/institution\/institutions\/[^/]+\?step=information&tab=-information-tab/
  );
  await page.getByRole("tab", { name: "Information" }).click();
  await expect(page.getByRole("textbox", { name: "Name*" })).toHaveValue(insitution_data.institution_name);
  await expect(page.getByRole("textbox", { name: "Email*" })).toHaveValue(insitution_data.email);
  await page.getByRole("textbox", { name: "Video URL" }).fill(insitution_data.video_url);
  await page.getByRole("textbox", { name: "Application Portal URL" }).fill(insitution_data.application_portal_url);
  await page.getByRole("spinbutton", { name: "Total Students" }).fill(insitution_data.total_students);
  await page.getByRole("spinbutton", { name: "International Students" }).fill(insitution_data.international_students);
  await page.getByText("Select Funding Type").click();
  await page.getByRole("option", { name: insitution_data.funding_type }).click();
  await page.getByText("Select Institution Type").click();
  await page.getByRole("option", { name: insitution_data.institution_type }).click();
  // await page.getByText("Select Year").click();
  // await page.getByRole("option", { name: insitution_data.established_year }).click();
  // await page.getByRole("option", { name: "2025" }).click();
  await page.getByRole("textbox", { name: "Notes" }).fill(insitution_data.notes);

  await page.getByRole("tab", { name: "Description" }).click();
  const institution_description = await page.locator("#data\\.institution_description");
  await institution_description.click();
  await institution_description.fill(insitution_data.institution_description);
  const institution_glance = await page.locator("#data\\.glance_description");
  await institution_glance.click();
  await institution_glance.fill(insitution_data.institution_glance);
  const institution_overview = await page.locator("#data\\.overview_description");
  await institution_overview.click();
  await institution_overview.fill(insitution_data.institution_overview);
  await page.getByRole("tab", { name: "Eligibilities" }).click();
  await page.getByRole("button", { name: "Add More" }).click();
  await page.getByText("Select Education Level").first().click();
  await page.getByRole("option", { name: insitution_data.eligibilities[0].selected_education_level }).click();
  await page.getByText("Select Education Level").click();
  await page.getByRole("option", { name: insitution_data.eligibilities[0].required_education_level }).click();
  await page.getByText("Select GPA Total").click();
  // const drop_down_gpa_total = await page.locator(".choic  es__list choices__list--dropdown");
  // await expect(drop_down_gpa_total).toHaveClass("is-active");
  await page
    .getByRole("textbox", { name: "Select GPA Total" })
    .pressSequentially(insitution_data.eligibilities[0].gpa_total);
  await page.waitForTimeout(5000);
  await page.getByRole("option", { name: insitution_data.eligibilities[0].gpa_total, exact: true }).click();
  await page.getByRole("spinbutton", { name: "TOEFL" }).fill(insitution_data.eligibilities[0].toefl);
  await page.getByRole("spinbutton", { name: "IELTS" }).fill(insitution_data.eligibilities[0].ielts);
  await page.getByRole("spinbutton", { name: "Pearson" }).fill(insitution_data.eligibilities[0].pte);
  await page.getByRole("spinbutton", { name: "Duolingo" }).fill(insitution_data.eligibilities[0].duolingo);
  await page.getByRole("spinbutton", { name: "GRE" }).fill(insitution_data.eligibilities[0].gre);
  await page.getByRole("spinbutton", { name: "GMAT" }).fill(insitution_data.eligibilities[0].gmat);
  await page.getByRole("spinbutton", { name: "SAT" }).fill(insitution_data.eligibilities[0].sat);

  await page.getByRole("button", { name: "Add More" }).click();

  await page.getByText("Select Education Level").first().click();
  await page.getByRole("option", { name: insitution_data.eligibilities[1].selected_education_level }).click();
  await page.getByText("Select Education Level").click();
  await page.getByRole("option", { name: insitution_data.eligibilities[1].required_education_level }).click();
  await page.getByText("Select GPA Total").click();
  // const drop_down_gpa_total = await page.locator(".choic  es__list choices__list--dropdown");
  // await expect(drop_down_gpa_total).toHaveClass("is-active");
  await page
    .getByRole("textbox", { name: "Select GPA Total" })
    .pressSequentially(insitution_data.eligibilities[1].gpa_total);
  await page.waitForTimeout(5000);
  await page.getByRole("option", { name: insitution_data.eligibilities[1].gpa_total, exact: true }).click();
  await page.getByRole("spinbutton", { name: "TOEFL" }).nth(1).fill(insitution_data.eligibilities[1].toefl);
  await page.getByRole("spinbutton", { name: "IELTS" }).nth(1).fill(insitution_data.eligibilities[1].ielts);
  await page.getByRole("spinbutton", { name: "Pearson" }).nth(1).fill(insitution_data.eligibilities[1].pte);
  await page.getByRole("spinbutton", { name: "Duolingo" }).nth(1).fill(insitution_data.eligibilities[1].duolingo);
  await page.getByRole("spinbutton", { name: "GRE" }).nth(1).fill(insitution_data.eligibilities[1].gre);
  await page.getByRole("spinbutton", { name: "GMAT" }).nth(1).fill(insitution_data.eligibilities[1].gmat);
  await page.getByRole("spinbutton", { name: "SAT" }).nth(1).fill(insitution_data.eligibilities[1].sat);

  await page.getByRole("tab", { name: "Education Levels" }).click();
  await page.getByRole("button", { name: "Add Education Level" }).click();
  await page.getByText("Select Education Level").click();
  await page.getByRole("option", { name: insitution_data.education_level[0].education_level }).click();
  await page
    .getByRole("spinbutton", { name: "Tuition fee" })
    .first()
    .fill(insitution_data.education_level[0].tution_fee);
  await page.getByText("Select Commission Type").click();
  await page.getByRole("option", { name: insitution_data.education_level[0].commission_type }).click();
  await page
    .getByRole("spinbutton", { name: "Commission of Tuition Fee" })
    .fill(insitution_data.education_level[0].commission_tution_fee);
  await page
    .getByRole("spinbutton", { name: "Commission of Agent" })
    .fill(insitution_data.education_level[0].commission_of_agent);
  await page
    .getByRole("spinbutton", { name: "Application Fee Strikethrough" })
    .fill(insitution_data.education_level[0].application_fee_strikthrough);
  await page
    .getByRole("spinbutton", { name: "Application Fee", exact: true })
    .fill(insitution_data.education_level[0].application_fee);
  await page
    .getByRole("spinbutton", { name: "Deposit Amount" })
    .fill(insitution_data.education_level[0].deposit_amount);
  await page
    .getByRole("spinbutton", { name: "Accommodation & other fees" })
    .fill(insitution_data.education_level[0].accommodation_other_fee);
  await page.getByText("Select Major").click();
  await page
    .getByRole("textbox", { name: "Select Major" })
    .pressSequentially(insitution_data.education_level[0].majors[0].name);
  await page.getByRole("option", { name: insitution_data.education_level[0].majors[0].name }).click();
  await page.getByRole("button", { name: "Add Major" }).click();
  await page.getByText("Select Major").click();
  await page.getByRole("option", { name: insitution_data.education_level[0].majors[1].name }).click();
  await page.getByRole("button", { name: "Add Major" }).click();
  await page.getByText("Select Major").click();
  await page.getByRole("option", { name: insitution_data.education_level[0].majors[2].name }).click();

  await page.getByRole("button", { name: "Add Education Level" }).click();
  await page.getByText("Select Education Level").click();
  await page.getByRole("option", { name: insitution_data.education_level[1].education_level }).click();
  await page
    .getByRole("spinbutton", { name: "Tuition fee", exact: true })
    .last()
    .fill(insitution_data.education_level[1].tution_fee);
  await page.getByText("Select Commission Type").click();
  await page.getByRole("option", { name: insitution_data.education_level[1].commission_type }).click();
  await page
    .getByRole("spinbutton", { name: "Commission of Tuition Fee" })
    .last()
    .fill(insitution_data.education_level[1].commission_tution_fee);
  await page
    .getByRole("spinbutton", { name: "Commission of Agent" })
    .last()
    .fill(insitution_data.education_level[1].commission_of_agent);
  await page
    .getByRole("spinbutton", { name: "Application Fee Strikethrough" })
    .last()
    .fill(insitution_data.education_level[1].application_fee_strikthrough);
  await page
    .getByRole("spinbutton", { name: "Application Fee", exact: true })
    .last()
    .fill(insitution_data.education_level[1].application_fee);
  await page
    .getByRole("spinbutton", { name: "Deposit Amount" })
    .last()
    .fill(insitution_data.education_level[1].deposit_amount);
  await page
    .getByRole("spinbutton", { name: "Accommodation & other fees" })
    .last()
    .fill(insitution_data.education_level[1].accommodation_other_fee);
  await page.getByText("Select Major").click();
  await page
    .getByRole("textbox", { name: "Select Major" })
    .pressSequentially(insitution_data.education_level[1].majors[0].name);
  await page.getByRole("option", { name: insitution_data.education_level[1].majors[0].name }).click();
  await page.getByRole("button", { name: "Add Major" }).nth(1).click();
  await page.getByText("Select Major").click();
  await page.getByRole("option", { name: insitution_data.education_level[1].majors[1].name }).click();
  await page.getByRole("button", { name: "Add Major" }).nth(1).click();
  await page.getByText("Select Major").click();
  await page.getByRole("option", { name: insitution_data.education_level[1].majors[2].name }).click();
  await page.getByRole("tab", { name: "Scholarship" }).click();
  await page.getByRole("button", { name: "Add More" }).click();
  await page.getByRole("textbox", { name: "Title" }).fill(insitution_data.scholarship[0].title);
  await page.getByRole("textbox", { name: "Description" }).fill(insitution_data.scholarship[0].description);
  await page.getByRole("button", { name: "Add More" }).click();
  await page.getByRole("textbox", { name: "Title" }).fill(insitution_data.scholarship[1].title);
  await page.getByRole("textbox", { name: "Description" }).fill(insitution_data.scholarship[1].description);
  await page.getByRole("tab", { name: "Location" }).click();
  await page.getByText("Select Country").click();
  const country = await page.getByRole("textbox", { name: "Select Country" });
  await country.pressSequentially(insitution_data.country, { delay: 1000 });
  await page.getByRole("option", { name: insitution_data.country }).click();
  const c_state = await page.getByText("Select State");
  await c_state.click();
  await c_state.pressSequentially(insitution_data.state, { delay: 1000 });
  await page.getByRole("option", { name: insitution_data.state }).click();
  const city = await page.getByText("Select City");
  await city.click();
  await city.pressSequentially(insitution_data.city, { delay: 1000 });
  await page.getByRole("option", { name: insitution_data.city }).click();
  await page.getByRole("textbox", { name: "Street" }).fill(insitution_data.street);
  await page.getByRole("textbox", { name: "Location Map Embed" }).fill(insitution_data.location_map_embed);
  await page.getByRole("tab", { name: "Misc" }).click();
  // await page.getByRole("button", { name: "Save changes" }).click();
});
