import { Locator } from "@playwright/test";

// NOTE: a base component has NO selector
export default class FooterColumnComponent {

    private titleSel: string = "h3";
    private linkSel: string = "li a";

    // This one is to force concrete class (component)'s contructor to call parent (Base Component)'s contructor
    constructor(private component: Locator) {
        this.component = component;
    }

    title(): Locator {
        return this.component.locator(this.titleSel);
    }

    links(): Promise<Array<Locator>> {
        return this.component.locator(this.linkSel).all();
    }
} 