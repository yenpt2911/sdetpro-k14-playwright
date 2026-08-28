import { Page } from "@playwright/test";
import PageBodyComponent from "../components/PageBodyComponent";
import ProductItemComponent from "../components/ProductItemComponent";

export default class SearchResultsPage {

    private noResultMsgLoc = '.no-result';

    constructor(private page: Page) {
        this.page = page;
    }

    public pageBodyComponent(): PageBodyComponent {
        return new PageBodyComponent(this.page.locator(PageBodyComponent.selector));
    }

    public async productResultComponentList(): Promise<ProductItemComponent[]> {
        return await this.pageBodyComponent().productItemComponentList();
    }

    public async hasNoResultMessage(): Promise<boolean> {
        return await this.page.locator(this.noResultMsgLoc).isVisible();
    }
}
