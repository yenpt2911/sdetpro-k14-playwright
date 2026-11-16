import { Locator } from "@playwright/test";

export default class TopicPageComponent {

    public static selector = '.topic-page';

    private titleSel = '.page-title h1';
    private bodySel = '.page-body';

    constructor(private component: Locator) {
        this.component = component;
    }

    public async getTitleText(): Promise<string> {
        // TODO: implement in agent3-coder
        throw new Error('Not implemented');
    }

    public async getBodyText(): Promise<string> {
        // TODO: implement in agent3-coder
        throw new Error('Not implemented');
    }
}
