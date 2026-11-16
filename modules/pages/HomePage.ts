import { Page } from "@playwright/test";

import ProductItemComponent from "../components/ProductItemComponent";
import FooterComponent from "../components/global/footer/FootetComponent";
import HeaderComponent from "../components/global/header/HeaderComponent";
import PageBodyComponent from "../components/PageBodyComponent";

export default class HomePage {

    constructor(private page: Page) {
        this.page = page;
    }

    headerComponent(): HeaderComponent {
        return new HeaderComponent(this.page.locator(HeaderComponent.selector));
    }

    pageBodyComponent(): PageBodyComponent {
        return new PageBodyComponent(this.page.locator(PageBodyComponent.selector));

    }

    public async openJewelryCategory(): Promise<void> {
        await this.page.locator('a[href="/jewelry"]').first().click();
    }

    public async openProduct(productName: string): Promise<void> {
        await this.page.getByRole('link', { name: productName, exact: true }).click();
    }

    footerComponent(): FooterComponent {
        return new FooterComponent(this.page.locator(FooterComponent.selector));
    }
}