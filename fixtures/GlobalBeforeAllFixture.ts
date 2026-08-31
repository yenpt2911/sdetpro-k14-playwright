import { test as globalBeforeAll } from '@playwright/test';

export const test = globalBeforeAll.extend<{ page: any }, { forEachWorker: void }>({
    forEachWorker: [async ({ browser }, use) => {
        console.log('Global before all setup');
        const page = await browser.newPage();
        try {
            await page.goto(process.env.BASE_URL || 'https://demowebshop.tricentis.com/', { waitUntil: 'domcontentloaded' });
        } catch (error) {
            console.warn(`Global warm-up skipped: ${error}`);
        }
        await page.close();

        await use();
    }, { scope: 'worker', auto: true }],
});