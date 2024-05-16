import { Page } from "@playwright/test";
import HomePage from "../../modules/pages/HomePage";
import FooterComponent from "../../modules/components/global/footer/FootetComponent";
import InformationColumnComponent from "../../modules/components/global/footer/InformationColumnComponent";
import FooterColumnComponent from "../../modules/components/global/footer/FooterColumnComponent";
import { deepStrictEqual } from 'assert';

export default class FooterTestFlow {

    constructor(private page: Page) {
        this.page = page;
    }

    // Service method
    async verifyFooterComponent(): Promise<void> {
        const homePage: HomePage = new HomePage(this.page);
        const footerComponent: FooterComponent = homePage.footerComponent();
        await this.verifyInformationColumn(footerComponent);
        await this.verifyCustomerServiceColumn(footerComponent);
        await this.verifyMyAccountColumn(footerComponent);
        await this.verifyFollowUsColumn(footerComponent);

    }

    // Support method
    private async verifyInformationColumn(footerComponent: FooterComponent): Promise<void> {
        const expectedLinkTexts: string[] = ['Sitemap', 'Shipping & Returns', 'Privacy Notice', 'Conditions of Use', 'About us', 'Contact us'];
        const expectedHrefs: string[] = ['/sitemap', '/shipping - returns', '/privacy-policy', '/conditions - of - use', '/about-us', '/contactus'];
        const informationColumnComp: InformationColumnComponent = footerComponent.informationColumnComponent();
        await this.verifyFooterColumn(informationColumnComp, expectedLinkTexts, expectedHrefs);

    }

    private verifyCustomerServiceColumn(footerComponent: FooterComponent): void {

    }

    private verifyMyAccountColumn(footerComponent: FooterComponent): void {

    }

    private verifyFollowUsColumn(footerComponent: FooterComponent): void {

    }

    private async verifyFooterColumn(
        footerColumnComp: FooterColumnComponent,
        expectedLinkTexts: string[],
        expectedHrefs: string[]
    ): Promise<void> {
        const actualLinkTexts: string[] = [];
        const actualHrefs: string[] = [];
        const footerCompLinks = await footerColumnComp.links();
        for (let footerCompLink of footerCompLinks) {
            const footerLinkText = await footerCompLink.textContent();
            const footerLinkHref = await footerCompLink.getAttribute('href');
            actualLinkTexts.push(footerLinkText);
            actualHrefs.push(footerLinkHref);
        }
        deepStrictEqual(actualLinkTexts, expectedLinkTexts,
            `Actual link texts and expected link texts is not the same.
            Actual: ${actualLinkTexts}
            Expected: ${expectedLinkTexts}`);
        deepStrictEqual(actualHrefs, expectedHrefs,
            `Actual hrefs and expected hrefs is not the same.
            Actual: ${actualHrefs}
            Expected: ${expectedHrefs}`);
    }

}