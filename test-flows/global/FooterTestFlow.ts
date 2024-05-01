import { Page } from "@playwright/test";
import HomePage from "../../modules/pages/HomePage";
import FooterComponent from "../../modules/components/global/footer/FootetComponent";
import InformationColumnComponent from "../../modules/components/global/footer/InformationColumnComponent";

export default class FooterTestFlow {

    constructor(private page: Page) {
        this.page = page;
    }

    // Service method
    async verifyFooterComponent(): Promise<void> {
        await  this.verifyInformationColumn();
        await this.verifyCustomerServiceColumn();
        await this.verifyMyAccountColumn();
        await this.verifyFollowUsColumn();

    }

    // Support method
    private  async verifyInformationColumn(): Promise<void> {
        const homePage: HomePage = new HomePage(this.page);
        const footerComponent: FooterComponent = homePage.footerComponent();
        const informationColumnComponent: InformationColumnComponent = footerComponent.informationColumnComponent();
        const title = await informationColumnComponent.title().textContent();
        console.log(`title: ${title}`);
        
    }

    private verifyCustomerServiceColumn(): void {

    }

    private verifyMyAccountColumn(): void {

    }

    private verifyFollowUsColumn(): void {

    }

}