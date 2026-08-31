const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config({ path: `.env.${process.env.ENV || 'qa'}` });

module.exports = defineConfig({
    testDir: './tests',
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    reporter: [
        ['html', {open: 'never'}],
        ['allure-playwright'],
    ],
    retries: process.env.CI ? 2 : 1,
    // headed local runs (.env.qa HEADLESS=false) open a real browser per worker;
    // force a single worker so only one browser window is ever open at a time.
    workers: 1,
    use: {
        baseURL: process.env.BASE_URL || 'https://demowebshop.tricentis.com',
        actionTimeout: 5 * 1000,
        trace: 'on-first-retry',
        video: 'on-first-retry',
        screenshot: 'only-on-failure',
        headless: process.env.HEADLESS === 'true',
    }

})