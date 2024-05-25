import { Locator } from "@playwright/test";
import { selector } from "../SelectorDecorator";

@selector("#checkout-steps")
export default class CheckoutDetailsComponent {
    protected component: Locator;
    private continueButtonSel = 'input[value="Continue"]';

    protected constructor(component: Locator) {
        this.component = component;
    }

    public async clickOnContinueButton(): Promise<void> {
        await this.component.locator(this.continueButtonSel).click();
        await this.component.locator(this.continueButtonSel).waitFor({ state: "hidden", timeout: 5 * 1000 });
    }


}