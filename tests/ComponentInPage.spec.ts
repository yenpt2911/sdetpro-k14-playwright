import { test } from '@playwright/test';
import HomePage from '../modules/pages/HomePage';
import HeaderComponent from '../modules/components/global/header/HeaderComponent';
import SearchComponent from '../modules/components/global/header/SearchComponent';


test('Test Component in Page', async ({ page }) => {

    await page.goto('https://demowebshop.tricentis.com/');
    const homePage: HomePage = new HomePage(page);
    const headerComponent: HeaderComponent = homePage.headerComponent();
    const searchComponent: SearchComponent = headerComponent.searchComponent();

    await searchComponent.searchBox().click();
    await searchComponent.searchBox().fill('Laptop');
    await searchComponent.searchBtn().click();
    await page.waitForTimeout(2000);

})