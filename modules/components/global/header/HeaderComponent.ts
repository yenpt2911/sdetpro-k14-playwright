import { Locator, Page } from "@playwright/test";
import SearchComponent from "./SearchComponent";

export default class HeaderComponent {

    public static selector: string = ".header";
    private shoppingCartLink: string = "#topcartlink a";
    // verified live: present only when a session is logged in
    private logoutLinkSel: string = "a.ico-logout";

    constructor(private component: Locator) {
        this.component = component;
    }

    public searchComponent(): SearchComponent {
        return new SearchComponent(this.component.locator(SearchComponent.selector));
    }

    public async clickOnShoppingCartLink(): Promise<void> {
        await this.component.locator(this.shoppingCartLink).click();
    }

    public async clickLogout(): Promise<void> {
        await this.component.locator(this.logoutLinkSel).click();
    }




}