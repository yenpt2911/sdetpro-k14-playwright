import { selector } from "./SelectorDecorator";
import { Locator } from "@playwright/test";

@selector(".product-essential")
export default class BaseItemDetailsComponent {

    protected component: Locator;

    private allOptionSel = '.option-list input';
    private priceSel = '.product-price';
    private productQuantitySel = 'input[class="qty-input"]';
    private addToCartBtnSel = 'input[id^="add-to-cart-button"]';

    protected constructor(component: Locator) {
        this.component = component;
    }

    public async unselectDefaultOptions(): Promise<void> {
        const allOptions: Locator[] = await this.component.locator(this.allOptionSel).all();
        for (let option of allOptions) {
            const isSelected = await option.getAttribute("checked");
            if (isSelected) {
                await option.click();
            }
        }
    }
    public async getProductPrice(): Promise<number> {
        const productPriceEle: Locator = await this.component.locator(this.priceSel);
        return Number(await productPriceEle.textContent());
    }

    public async getProductQuantity(): Promise<number> {
        const productQuatityEle: Locator = await this.component.locator(this.productQuantitySel);
        return Number(await productQuatityEle.getAttribute('value'));
    }

    public async clickOnAddToCartBtn(): Promise<void> {
        const addToCartBtn: Locator = await this.component.locator(this.addToCartBtnSel);
        await addToCartBtn.scrollIntoViewIfNeeded();
        await addToCartBtn.click();
    }

}