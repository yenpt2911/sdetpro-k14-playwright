import { test as simpleTest } from "../../fixtures/SimpleTestFixture";
import { test as loginTest } from "../../fixtures/LoginBeforeTestFixture";

import { log } from "console";

simpleTest('', async ({page, initValue, somethingElse}) => {
    log('Test body execution');
    log('initValue: ', initValue);
    log('somethingElse: ', somethingElse);
})

loginTest('Title B', async ({page, login}) => {
    log('Test body execution');
})