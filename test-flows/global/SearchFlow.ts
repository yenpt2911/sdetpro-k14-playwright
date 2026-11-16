import { test as pageObjectFixtures, PageObjectFixtures } from "../../fixtures/PageObjectTestFixture";
import { test as globalTestAll } from "../../fixtures/GlobalBeforeAllFixture";
import { mergeTests } from "@playwright/test";
import { expect } from "@playwright/test";

export const test = mergeTests(pageObjectFixtures, globalTestAll).extend<{ searchFlow: SearchFlow }>({
    searchFlow: async ({ homePage, searchResultsPage }, use) => {
        const searchFlow = new SearchFlow({ homePage, searchResultsPage });
        await use(searchFlow);
    }
});

export default class SearchFlow {

    constructor(
        private readonly fixture: Pick<PageObjectFixtures, 'homePage' | 'searchResultsPage'>
    ) {
    }

    public async searchForProduct(keyword: string): Promise<void> {
        const homePage = this.fixture.homePage;
        const searchComponent = homePage.headerComponent().searchComponent();
        await searchComponent.search(keyword);
    }

    public async verifyResultsContainKeyword(keyword: string): Promise<void> {
        const searchResultsPage = this.fixture.searchResultsPage;
        const productComponents = await searchResultsPage.productResultComponentList();

        expect(productComponents.length, `Expected at least one result for "${keyword}"`).toBeGreaterThan(0);

        for (const product of productComponents) {
            const title = await product.productTitle().textContent();
            expect(title?.toLowerCase()).toContain(keyword.toLowerCase());
        }
    }
}
