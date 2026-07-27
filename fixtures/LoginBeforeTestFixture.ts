import { test as teo } from '@playwright/test';
import { log } from 'console';

export const test = teo.extend<{login: void}>({
    login: async({page}, use) => {
        await page.goto('https://www.saucedemo.com/');
        log('Input username ');
        log('Input password ');
        log('Click on login button');

        await use();
    }

});
