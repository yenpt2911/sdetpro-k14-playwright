import { test } from '@playwright/test';
import HomePage from '../modules/pages/HomePage';
import SearchComponent from '../modules/components/SearchComponent';


test('Test Component in Page', async ({ page }) => {

    await page.goto('https://demowebshop.tricentis.com/');
    const homePage: HomePage = new HomePage(page);
    const searchComponent: SearchComponent = homePage.searchComponent();

    await searchComponent.searchBox().click();
    await searchComponent.searchBox().fill('Laptop');
    await searchComponent.searchBtn().click();

    await page.waitForTimeout(2000);

})