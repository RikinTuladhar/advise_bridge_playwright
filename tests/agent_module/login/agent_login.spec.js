import { test } from "@playwright/test";
import { AgentLoginPage } from "../../../pages/agent/agent_loginpage";
import { agent_login } from "../../../datas/agent_data";

test ("Agent Login Page", async ({page}) =>{
    const agent_page = new AgentLoginPage(page);
    await agent_page.goToAgentLoginPage();
    await agent_page.loginAsAgent(agent_login.email,agent_login.password);
    await agent_page.successfullLogin();
} );
