import { test } from '@playwright/test';

test('Login Test', async ({ page }) => {

    await page.goto("https://playwright.dev");
    const element = await page.locator('teocodon');
    await element.click();

    // DEBUG PURPOSE ONLY
    await page.waitForTimeout(1000);

})