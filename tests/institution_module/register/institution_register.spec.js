import test from "playwright/test";
import { institutionData } from "../../../datas/institution_data.js";
import { InstitutionPage } from "../../../pages/InstitutionPage";

test("Register for insitution", async ({ page }) => {
  const { institution_name, email, password, confirm_password } = institutionData;
  const institution = new InstitutionPage(page);
  await institution.institutionRegister(institution_name, email, password, confirm_password);
});
