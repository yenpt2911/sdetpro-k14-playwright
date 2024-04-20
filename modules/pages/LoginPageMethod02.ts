// Introducing main interaction methods

import { Locator, Page } from "@playwright/test";

export default class LoginPageMethod02 {

    // Scope to keep element selectors
    private usernameLoc = '#username';
    private passwordLoc = '#password';
    private loginBtnLoc = 'button[type="submit"]';

    // Contructors
    constructor(private page: Page) {
        this.page = page;
    }

    // Return the found elements
    username(): Locator {
        return this.page.locator(this.usernameLoc);
    }

    password(): Locator {
        return this.page.locator(this.passwordLoc);
    }

    loginBtn(): Locator {
        return this.page.locator(this.loginBtnLoc);
    }

}