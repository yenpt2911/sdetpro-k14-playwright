import { test } from '@playwright/test';
import HomePage from '../modules/pages/HomePage';
import ProductItemComponent from '../modules/components/ProductItemComponent';
import PageBodyComponent from '../modules/components/PageBodyComponent';


test('Test List of Component in Page', async ({ page }) => {

    await page.goto('https://demowebshop.tricentis.com/');
    const homePage: HomePage = new HomePage(page);

    const pageBodyComponent: PageBodyComponent = homePage.pageBodyComponent();
    const productItemComponentList: ProductItemComponent[] = await pageBodyComponent.productItemComponentList();

    for (let prodItemComp of productItemComponentList) {
        const productTitle = await prodItemComp.productTitle().textContent();
        const productPrice = await prodItemComp.productPrice().textContent();
        console.log(`${productTitle.trim()}: ${productPrice.trim()}`);
    }

    await page.waitForTimeout(2000);

})