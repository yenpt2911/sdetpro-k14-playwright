import { Locator } from "@playwright/test";
import { selector } from "../SelectorDecorator";
import CheckoutDetailsComponent from "./CheckoutDetailsComponent";

@selector("#opc-shipping")
export default class ShippingAddressComponent extends CheckoutDetailsComponent {
    protected component: Locator;

    protected constructor(component: Locator) {
        super(component);
        this.component = component;
    }


}
