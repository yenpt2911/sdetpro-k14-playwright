import { test } from '@playwright/test';
import LoginPageMethod01 from '../modules/pages/LoginPageMethod01';

test('Test POM method 01 - introducing main interaction methods', async ({ page }) => {

    
    const loginPage: LoginPageMethod01 = new LoginPageMethod01(page);
    await page.goto("https://the-internet.herokuapp.com/login");
    await loginPage.inputUsername("tomsmith");
    await loginPage.inputPassword("SuperSecretPassword!");
    await loginPage.clickOnLoginBtn();

    await page.waitForURL('**/secure');
    
})