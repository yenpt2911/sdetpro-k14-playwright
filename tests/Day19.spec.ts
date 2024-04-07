import {test} from '@playwright/test';

test('Link Text - XPATH', async ({ page }) => {

    await page.goto("https://the-internet.herokuapp.com/");
    const footerLinkEle = await page.waitForSelector('//a[contains(.,"Elemental Selenium")]', {timeout: 10000});
    await footerLinkEle.click();

    // DEBUG PURPOSE ONLY
    await page.waitForTimeout(3000);

})

test('Link Text - CSS', async ({ page }) => {

    await page.goto("https://the-internet.herokuapp.com/");
    const footerLinkEle = await page.locator('a:has-text("Elemental Selenium")');
    await footerLinkEle.click();

    // DEBUG PURPOSE ONLY
    await page.waitForTimeout(3000);

})

test('Link Text - Filtering', async ({ page }) => {

    await page.goto("https://the-internet.herokuapp.com/");
    const footerLinkEle = await page.locator('a').filter({ hasText: "Elemental" });
    
    await footerLinkEle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    await footerLinkEle.click();

    // DEBUG PURPOSE ONLY
    await page.waitForTimeout(2000);

})


test('Multiple matching', async ({ page }) => {

    await page.goto("https://the-internet.herokuapp.com/");
    const footerLinkEle = await page.locator('a').elementHandles();
    await footerLinkEle[10].click();

    // DEBUG PURPOSE ONLY
    await page.waitForTimeout(2000);

})

test('Handle login form', async ({ page }) => {

    await page.goto("https://the-internet.herokuapp.com/");
    await page.locator('a').filter({ hasText: "Form Authentication" }).click();
    await page.waitForLoadState("domcontentloaded");

    // Form interaction
    await page.locator("#username").fill("min@sth.com");
    await page.locator("#password").fill("12345678");

    await page.waitForTimeout(2000);

    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState("domcontentloaded");


    // DEBUG PURPOSE ONLY
    await page.waitForTimeout(2000);

})

test.only('Element get text', async ({ page }) => {

    await page.goto("https://the-internet.herokuapp.com/");
    await page.locator('a').filter({ hasText: "Form Authentication" }).click();
    await page.waitForLoadState("domcontentloaded");

    // Form interaction
    await page.locator("#username").fill("min@sth.com");
    await page.locator("#password").fill("12345678");

    await page.waitForTimeout(2000);

    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState("domcontentloaded");

    // Get text
    const textContent = await page.locator('h4').textContent();
    const innerText = await page.locator('h4').innerText();

    console.log(textContent);
    console.log(innerText);
    

    // DEBUG PURPOSE ONLY
    await page.waitForTimeout(2000);

})