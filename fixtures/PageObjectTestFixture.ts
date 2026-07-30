import { test as pageObjectFixture } from '@playwright/test';
import HomePage from '../modules/pages/HomePage';
import CheckoutPage from '../modules/pages/CheckoutPage';
import CheckoutOptionsPage from '../modules/pages/CheckoutOptionsPage';
import ComputerDetailsPage from '../modules/pages/ComputerDetailsPage';
import ShoppingCartPage from '../modules/pages/ShoppingCartPage';

export type PageObjectFixtures = {
    homePage: HomePage,
    checkoutPage: CheckoutPage,
    checkoutOptionsPage: CheckoutOptionsPage,
    computerDetailsPage: ComputerDetailsPage,
    shoppingCartPage: ShoppingCartPage,
};

export const test = pageObjectFixture.extend<PageObjectFixtures>({
    homePage: async({page}, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    checkoutPage: async({page}, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },
    
    checkoutOptionsPage: async({page}, use) => {
        const checkoutOptionsPage = new CheckoutOptionsPage(page);
        await use(checkoutOptionsPage);
    },

    computerDetailsPage: async({page}, use) => {
        await page.goto('https://demowebshop.tricentis.com/build-your-cheap-own-computer');
        const computerDetailsPage = new ComputerDetailsPage(page); 
        await use(computerDetailsPage);
    },

    shoppingCartPage: async({page}, use) => {
        const shoppingCartPage = new ShoppingCartPage(page);
        await use(shoppingCartPage);
    }
});
