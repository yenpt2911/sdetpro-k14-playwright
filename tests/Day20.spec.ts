import { test } from '@playwright/test'
import { timeout } from '../playwright.config';

test('Handle Dropdown option', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dropdown');

    const dropdownEle = await page.locator('#dropdown');

    //Select Option 1
    await dropdownEle.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Select option2
    await dropdownEle.selectOption({ value: '2' });
    await page.waitForTimeout(1000);

    // Select option 1 again using label - similary with select by text in selenium
    await dropdownEle.selectOption({ label: 'Option 1' });
    await page.waitForTimeout(1000);

})

test('Handle Iframe', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/iframe');

    // Target the ifame using frameLocator
    const iframeEle = page.frameLocator('iframe[id^="mce"]');

    // Find edit text area in the iframe
    const editTextAreaEle = await iframeEle.locator('body p');

    // Clear then input the new content
    await editTextAreaEle.click();
    await editTextAreaEle.clear();
    await editTextAreaEle.fill('New Content');

    // Interact with the main frame's elements ~ no need to switch main frame
    const footerPowerByLinkEle = await page.locator('a:has-text("Elemental Selenium")');
    await footerPowerByLinkEle.click();


    await page.waitForTimeout(2000);

})


test('Mouse hover and narrowdown searching scope', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/hovers');

    // Find all figures
    const allFigureEles = await page.locator('.figure').all();

    // Loop all figures
    for (const figureEle of allFigureEles) {

        // and narrowdown searching scope
        const imgEle = figureEle.locator('img');

        const usernameEle = await figureEle.locator('h5');
        const viewProfileHyperlinkEle = await figureEle.locator('a');
        const isUsernameVisible = await usernameEle.isVisible();
        const isViewProfileHyperlinkVisible = await viewProfileHyperlinkEle.isVisible();
        console.log(`isUsernameVisible: ${isUsernameVisible}`);
        console.log(`isViewProfileHyperlinkVisible: ${isViewProfileHyperlinkVisible}`);


        // Mouse hover
        await imgEle.hover();

        const isUsernameVisibleAfter = await usernameEle.isVisible();
        const isViewProfileHyperlinkVisibleAfter = await viewProfileHyperlinkEle.isVisible();
        console.log(`isUsernameVisibleAfter: ${isUsernameVisibleAfter}`);
        console.log(`isViewProfileHyperlinkVisibleAfter: ${isViewProfileHyperlinkVisibleAfter}`);



        await page.waitForTimeout(2000);
    }
})

test.only('Checking element status and handle dynamic states', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_controls');

    // Locate 2 parent components
    const checkboxComp = await page.locator('#checkbox-example');

    // Interact with the checkbox component
    const checkboxEle = await checkboxComp.locator('#checkbox input');
    const isEnabled = await checkboxEle.isEnabled();
    let isSelected = await checkboxEle.isChecked();
    console.log(`Is checkbox enable: ${isEnabled}`);
    console.log(`Is checkbox selected: ${isSelected}`);

    if (!isSelected) {
        await checkboxEle.click();
    }

    let isSelectedAfter = await checkboxEle.isChecked();
    console.log(`Is checkbox selected after selecting: ${isSelectedAfter}`);
    if (!isSelectedAfter) {
        await checkboxEle.click();
    }

    const removeBtnEle = await checkboxComp.locator('button');
    await removeBtnEle.click();
    await page.waitForSelector('#checkbox-example #checkbox input', { state: 'hidden', timeout: 5 * 1000 });

    await page.waitForTimeout(2000);

    const inputExampleComp = await page.locator("//form[@id='input-example']");
    const inputEle = await inputExampleComp.locator("//input[@type='text']");
    let isDisabled = await inputEle.isDisabled();

    const enableBtnEle = await inputExampleComp.locator("//button[@type='button']");


    if (isDisabled) {
        await enableBtnEle.click();
        await page.waitForSelector("//form[@id='input - example']//input[@type='text']", { state: 'hidden', timeout: 5 * 1000 });
        await inputEle.fill('Automation test');
        await page.waitForTimeout(1000);
    } else {
        await inputEle.fill('Automation test');
        await page.waitForTimeout(1000);
    }

})