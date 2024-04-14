import { Page, test } from '@playwright/test'
import { scrollToBottom } from '../utils/PageHelper';
import { getAdParams } from '../utils/AdHelper';

const jsAlertUrl = 'https://the-internet.herokuapp.com/javascript_alerts';
const floatingUrl = 'https://the-internet.herokuapp.com/floating_menu';
test('Handle JS Alert', async ({ page }) => {
    await page.goto(jsAlertUrl);

    const jsAlertBtnEle = await page.locator('[onclick = "jsAlert()"]');

    // MUST define the even first
    page.on('dialog', async dialog => {
        await dialog.accept();
    })

    // Trigger the js alert
    await jsAlertBtnEle.click();

    await page.waitForTimeout(3000);
});

test('Handle JS Confirm', async ({ page }) => {
    await page.goto(jsAlertUrl);

    const jsConfirmBtnEle = await page.locator('[onclick = "jsConfirm()"]');

    // MUST define the even first
    page.on('dialog', async dialog => {
        console.log(`Alert content is: ${dialog.message()}`);
        await dialog.accept();
    })

    // Trigger the js alert
    await jsConfirmBtnEle.click();

    await page.waitForTimeout(3000);
});

test('Handle JS Prompt', async ({ page }) => {
    await page.goto(jsAlertUrl);

    const jsPromptBtnEle = await page.locator('[onclick = "jsPrompt()"]');

    // MUST define the even first
    page.on('dialog', async dialog => {
        console.log(`Alert content is: ${dialog.message()}`);
        await dialog.accept("I'm accepting the js prompt!!");
    })

    // Trigger the js alert
    await jsPromptBtnEle.click();

    await page.waitForTimeout(3000);
});

test('Handle JS Alert automatically', async ({ page }) => {
    await page.goto(jsAlertUrl);

    const jsPromptBtnEle = await page.locator('[onclick = "jsPrompt()"]');

    // Trigger the js alert
    await jsPromptBtnEle.click();

    await page.waitForTimeout(3000);
});

/**
 * Javascript snippet execution
 */
test('Execute JS without parameters', async ({ page }) => {
    await page.goto(floatingUrl);

    // Explore the hightlight function
    page.locator('h3').highlight();

    // Wait 2 secs
    await page.waitForTimeout(2000);

    // Scroll to bottom
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    })

    // Wait 2 secs
    await page.waitForTimeout(2000);

    // Scroll to top
    await page.evaluate(() => {
        window.scrollTo(0, 0);
    });

    // wait another 2 secs
    await page.waitForTimeout(2000);
});

test('Execute JS with parameters', async ({ page }) => {
    await page.goto(floatingUrl);

    // Scroll to bottom
    scrollToBottom(page, 0.5);

    // Wait 2 secs
    await page.waitForTimeout(2000);
});

test.only('Execute JS and return the value', async ({ page }) => {
    await page.goto('https://www.foodandwine.com/');
    await page.waitForSelector('div[id="leaderboard-flex-1"]', { timeout: 10000});
    await scrollToBottom(page, 1);
    await page.waitForTimeout(1000);
    const returnAdsValue = await getAdParams(page, 'leaderboard-flex-1');
    console.log(returnAdsValue);
    
});


