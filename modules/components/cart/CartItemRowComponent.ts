import { Locator } from "@playwright/test";
import { selector } from "../SelectorDecorator";

@selector(".car-item-row")
export default class CartItemRowComponent {
    protected component: Locator;

    private unitPriceSel = '.product-unit-price';
    private quantityInputSel = 'input[class*="qty-input"]';
    private subtotalSel = '.product-subtotal';

    protected constructor(component: Locator) {
        this.component = component;
    }

    public async unitPrice(): Promise<number> {
        const unitPriceTxt = await this.component.locator(this.unitPriceSel).textContent();
        return Number(unitPriceTxt);
    }

    public async quantity(): Promise<number> {
        const quantityText = await this.component.locator(this.quantityInputSel).getAttribute("value");
        return Number(quantityText);
    }

    public async subTotal(): Promise<number> {
        const subTotalText = await this.component.locator(this.subtotalSel).textContent();
        return Number(subTotalText);
    }

}