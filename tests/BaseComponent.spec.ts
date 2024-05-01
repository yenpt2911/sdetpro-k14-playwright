import { test } from '@playwright/test';
import HomePage from '../modules/pages/HomePage';
import HeaderComponent from '../modules/components/global/header/HeaderComponent';
import SearchComponent from '../modules/components/global/header/SearchComponent';
import InformationColumnComponent from '../modules/components/global/footer/InformationColumnComponent';
import FooterComponent from '../modules/components/global/footer/FootetComponent';
import CustomerServiceColumnComponent from '../modules/components/global/footer/CustomerServiceColumnComponent';


test('Test Base Component in Page', async ({ page }) => {

    await page.goto('https://demowebshop.tricentis.com/');
    const homePage: HomePage = new HomePage(page);
    const footerComponent: FooterComponent = homePage.footerComponent();
    const informationColumnComponent: InformationColumnComponent = footerComponent.informationColumnComponent();
    const customerServiceComponent: CustomerServiceColumnComponent = footerComponent.customerServiceComponent();

    const informationColumnTitle = await informationColumnComponent.title().textContent();
    const customerColumnTitle = await customerServiceComponent.title().textContent();

    console.log(`informationColumnTitle: ${informationColumnTitle}`);
    console.log(`customerColumnTitle: ${customerColumnTitle}`);

})