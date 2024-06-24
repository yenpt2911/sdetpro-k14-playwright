import { Locator } from "@playwright/test";
import { selector } from "../SelectorDecorator";
import CheckoutDetailsComponent from "./CheckoutDetailsComponent";

@selector("#opc-payment_method")
export default class PaymentMethodComponent extends CheckoutDetailsComponent {
    protected component: Locator;

    private codSel = '[value="Payments.CheckMoneyOrder"]';
    private checkMoneyOrderSel = '[value="Payments.CheckMoneyOrder"]';
    private creditCardSel = '[value="Payments.Manual"]';
    private purchaseOrderSel = '[value="Payments.PurchaseOrder"]';

    protected constructor(component: Locator) {
        super(component);
        this.component = component;
    }

    public async selectCODMethod(): Promise<void>{
        await this.component.locator(this.codSel).click();
    }

    public async selectCheckMoneyOrder(): Promise<void> {
        await this.component.locator(this.checkMoneyOrderSel).click();
    }

    public async selectCreditCard(): Promise<void> {
        await this.component.locator(this.creditCardSel).click();
    }

    public async selectPurchaseOrder(): Promise<void> {
        await this.component.locator(this.purchaseOrderSel).click();
    }


}
