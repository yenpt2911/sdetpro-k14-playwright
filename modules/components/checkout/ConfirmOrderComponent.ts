import { Locator } from "@playwright/test";
import { selector } from "../SelectorDecorator";
import CheckoutDetailsComponent from "./CheckoutDetailsComponent";

@selector("#opc-confirm_order")
export default class ConfirmOrderComponent extends CheckoutDetailsComponent {
    protected component: Locator;

    private confirmButtonSel = 'input[class*="confirm-order"]';

    protected constructor(component: Locator) {
        super(component);
        this.component = component;
    }

    public async clickOnConfirmButton(): Promise<void> {
        await this.component.locator(this.confirmButtonSel).click();
    }


}
