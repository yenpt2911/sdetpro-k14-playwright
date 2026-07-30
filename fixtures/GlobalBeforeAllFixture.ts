import { test as globalBeforeAll } from '@playwright/test';

export const test = globalBeforeAll.extend<{ page: any }, { forEachWorker: void }>({
    forEachWorker: [async ({ browser }, use) => {
        console.log('Global before all setup');
        const page = await browser.newPage();
        await page.goto('https://demowebshop.tricentis.com/');
        await page.waitForTimeout(3 * 1000);
        await page.close();

        await use();
    }, { scope: 'worker', auto: true }],
});