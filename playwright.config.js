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
    use: {
        baseURL: process.env.BASE_URL || 'https://demowebshop.tricentis.com',
        actionTimeout: 5 * 1000,
        trace: 'on-first-retry',
        video: 'on-first-retry',
        screenshot: 'only-on-failure',
        headless: process.env.HEADLESS === 'true',
        // The `request` fixture (APIRequestContext) doesn't inherit http_proxy/https_proxy env vars
        // like Chromium does, so it must be configured explicitly for API tests to reach the network.
        proxy: process.env.https_proxy || process.env.HTTPS_PROXY
            ? { server: process.env.https_proxy || process.env.HTTPS_PROXY }
            : undefined,
    }

})