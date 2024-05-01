import { Locator } from "@playwright/test";

export default class SearchComponent {

    public static selector = '.search-box';

    private seachBoxLoc = 'input[id="small-searchterms"]';
    private seachBtnLoc = 'input[class*="search-box-button"]';

    constructor(private component: Locator) {
        this.component = component;
    }

    // Narrow down searching scope
    searchBox(): Locator {
        return this.component.locator(this.seachBoxLoc);
    }

    searchBtn(): Locator {
        return this.component.locator(this.seachBtnLoc);
    }
}