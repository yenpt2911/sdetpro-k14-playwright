import { Page } from "@playwright/test";

export default class CheckoutOptionsPage {

    private readonly checkoutAsGuestBtnSel = 'input[class*="checkout-as-guest-button"]';

    constructor(private page: Page) {
        this.page = page;
    }

    public async checkoutAsGuest(): Promise<void> {
        await this.page.locator(this.checkoutAsGuestBtnSel).click();
    }
   
   
}