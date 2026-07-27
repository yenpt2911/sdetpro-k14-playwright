import { test as base } from '@playwright/test';


/**
 * Only use for specific test files that require this fixture. 
 * Do not use this fixture in the global setup, as it will run for every test file and may cause unexpected behavior.
 * 
 */
export const test = base.extend<{ sthElse: void, anotherThing: void }>({
  sthElse: [async ({ page }, use) => {
    // This code runs before every test.
    await page.goto('https://www.saucedemo.com/');
    await page.waitForTimeout(3*1000);
    await use();
  }, { auto: true }], 
  anotherThing: [async ({ page }, use) => {
    // This code runs before every test.
    log('anotherThing fixture setup');
    await use();
  }, { auto: true }],  // automatically starts for every test.
});

