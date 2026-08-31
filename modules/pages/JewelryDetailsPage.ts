import { Page } from "@playwright/test";
import BaseItemDetailsComponent from "../components/BaseItemDetailsComponent";
import HeaderComponent from "../components/global/header/HeaderComponent";

export default class JewelryDetailsPage {
    constructor(private page: Page) {}

    public itemDetailsComponent(): BaseItemDetailsComponent {
        return new BaseItemDetailsComponent(this.page.locator(BaseItemDetailsComponent.selectorValue));
    }

    public headerComponent(): HeaderComponent {
        return new HeaderComponent(this.page.locator(HeaderComponent.selector));
    }

    public async waitForProductAddedNotification(): Promise<void> {
        await this.page.getByText("The product has been added to your shopping cart").waitFor();
    }
}