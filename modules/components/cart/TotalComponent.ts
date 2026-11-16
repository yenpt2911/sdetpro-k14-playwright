import { Locator } from "@playwright/test";
import { selector } from "../SelectorDecorator";

@selector(".cart-footer .totals")
export default class TotalComponent {
    public static selectorValue = ".cart-footer .totals";
    protected component: Locator;

    private priceTableRowSel = 'table tr';
    private termOfServiceCheckboxSel = '#termsofservice';
    private checkoutBtnSel = '#checkout';

    public constructor(component: Locator) {
        this.component = component;
    }

    public async priceCategories(): Promise<any>{
        let priceCategories = {};
        const priceTableRowElems = await this.component.locator(this.priceTableRowSel).all();
        for (let tableRowEle of priceTableRowElems) {
            const cells = await tableRowEle.locator('td').allTextContents();
            if (cells.length >= 2) {
                priceCategories[cells[0].trim()] = Number(cells[1].trim());
            }
        }
        return priceCategories;
    }

    public async acceptTOS(): Promise<void> {
        await this.component.locator(this.termOfServiceCheckboxSel).click();
    }

    public async clickOnCheckoutBtn(): Promise<void> {
        await this.component.locator(this.checkoutBtnSel).click();
    }


}