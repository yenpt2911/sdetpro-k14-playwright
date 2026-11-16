import { Page } from "@playwright/test";
import RegisterFormComponent from "../components/global/register/RegisterFormComponent";

export default class RegisterPage {

    private resultMsgSel = '.result';

    constructor(private page: Page) {
        this.page = page;
    }

    public registerFormComponent(): RegisterFormComponent {
        return new RegisterFormComponent(this.page.locator(RegisterFormComponent.selectorValue));
    }

    public async getResultMessage(): Promise<string> {
        return await this.page.locator(this.resultMsgSel).textContent() ?? '';
    }
}
