import { Page } from "@playwright/test";
import BillingAddressComponent from "../components/checkout/BillingAddressComponent";
import ConfirmOrderComponent from "../components/checkout/ConfirmOrderComponent";
import PaymentInformationComponent from "../components/checkout/PaymentInformationComponent";
import PaymentMethodComponent from "../components/checkout/PaymentMethodComponent";
import ShippingAddressComponent from "../components/checkout/ShippingAddressComponent";
import ShippingMethodComponent from "../components/checkout/ShippingMethodComponent";

export default class CheckoutPage {


    constructor(private page: Page) {
        this.page = page;
    }

    public billingAddressComponent(): BillingAddressComponent {
        return new BillingAddressComponent(this.page.locator(BillingAddressComponent.selectorValue));
    }

    public confirmOrderComponent(): ConfirmOrderComponent {
        return new ConfirmOrderComponent(this.page.locator(ConfirmOrderComponent.selectorValue));
    }

    public paymentInformationComponent(): PaymentInformationComponent {
        return new PaymentInformationComponent(this.page.locator(PaymentInformationComponent.selectorValue));
    }
    public paymentMethodComponent(): PaymentMethodComponent {
        return new PaymentMethodComponent(this.page.locator(PaymentMethodComponent.selectorValue));
    }
    public shippingAddressComponent(): ShippingAddressComponent {
        return new ShippingAddressComponent(this.page.locator(ShippingAddressComponent.selectorValue));
    }
    public shippingMethodComponent(): ShippingMethodComponent {
        return new ShippingMethodComponent(this.page.locator(ShippingMethodComponent.selectorValue));
    }
   
   
}