import { mergeTests } from '@playwright/test'; 
import { test as simpleFixture } from "../../fixtures/SimpleTestFixture";
import { test as loginFixture } from "../../fixtures/LoginBeforeTestFixture";
import { test as pageObjectFixture } from "../../fixtures/PageObjectTestFixture";  
import { test as globalBeforeEachFixture} from "../../fixtures/GlobalBeforeEachFixture";


import { log } from "console";

export const test = mergeTests(simpleFixture, loginFixture, pageObjectFixture, globalBeforeEachFixture);

test('', async ({page, initValue, somethingElse}) => {
    log('Test body execution');
    log('initValue: ', initValue);
    log('somethingElse: ', somethingElse);
})

test('Title B', async ({page, login}) => {
    log('Test body execution');
})

test('Title C', async ({page, homePage}) => {
    const footerComponent = await homePage.footerComponent();
    const links = await footerComponent.customerServiceComponent().links();
    for (let link of links) {
        const linkTest = await link.textContent();
        log('link: ', linkTest);
    }
})


