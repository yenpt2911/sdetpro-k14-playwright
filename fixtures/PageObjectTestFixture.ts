import { test as teo } from '@playwright/test';
import { log } from 'console';
import HomePage from '../modules/pages/HomePage';

export const test = teo.extend<{homePage: HomePage, anotherPage: any}>({
    homePage: async({page}, use) => {
        await page.goto('https://www.saucedemo.com/');
        const homePage = new HomePage(page);
        await use(homePage);
    },

    anotherPage: async({page}, use) => {
        const anotherPage = {}; // Replace with actual page object
        await use(anotherPage);
    },
});
