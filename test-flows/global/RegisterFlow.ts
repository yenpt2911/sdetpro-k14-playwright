import { test as pageObjectFixtures, PageObjectFixtures } from "../../fixtures/PageObjectTestFixture";
import { test as globalTestAll } from "../../fixtures/GlobalBeforeAllFixture";
import { mergeTests, expect } from "@playwright/test";

export const test = mergeTests(pageObjectFixtures, globalTestAll).extend<{ registerFlow: RegisterFlow }>({
    registerFlow: async ({ registerPage, homePage }, use) => {
        const registerFlow = new RegisterFlow({ registerPage, homePage });
        await use(registerFlow);
    }
});

export default class RegisterFlow {

    constructor(
        private readonly fixture: Pick<PageObjectFixtures, 'registerPage' | 'homePage'>
    ) {
    }

    public async registerNewAccount(accountData: {
        gender?: 'male' | 'female',
        firstName: string,
        lastName: string,
        email: string,
        password: string
    }): Promise<void> {
        const registerPage = this.fixture.registerPage;
        const registerFormComponent = registerPage.registerFormComponent();

        if (accountData.gender) {
            await registerFormComponent.selectGender(accountData.gender);
        }
        await registerFormComponent.inputFirstName(accountData.firstName);
        await registerFormComponent.inputLastName(accountData.lastName);
        await registerFormComponent.inputEmail(accountData.email);
        await registerFormComponent.inputPassword(accountData.password);
        await registerFormComponent.inputConfirmPassword(accountData.password);
        await registerFormComponent.clickRegisterButton();
    }

    public async attemptRegister(accountData: {
        gender?: 'male' | 'female',
        firstName?: string,
        lastName?: string,
        email?: string,
        password?: string,
        confirmPassword?: string
    }): Promise<void> {
        const registerFormComponent = this.fixture.registerPage.registerFormComponent();

        if (accountData.gender) {
            await registerFormComponent.selectGender(accountData.gender);
        }
        if (accountData.firstName !== undefined) {
            await registerFormComponent.inputFirstName(accountData.firstName);
        }
        if (accountData.lastName !== undefined) {
            await registerFormComponent.inputLastName(accountData.lastName);
        }
        if (accountData.email !== undefined) {
            await registerFormComponent.inputEmail(accountData.email);
        }
        if (accountData.password !== undefined) {
            await registerFormComponent.inputPassword(accountData.password);
        }
        if (accountData.confirmPassword !== undefined) {
            await registerFormComponent.inputConfirmPassword(accountData.confirmPassword);
        }
        await registerFormComponent.clickRegisterButton();
    }

    public async verifyRegistrationSucceeded(): Promise<void> {
        const registerPage = this.fixture.registerPage;
        const resultMessage = await registerPage.getResultMessage();
        expect(resultMessage).toContain('Your registration completed');
    }

    public async verifyFieldErrorsContain(expectedMessages: string[]): Promise<void> {
        const registerFormComponent = this.fixture.registerPage.registerFormComponent();
        const messages = await registerFormComponent.getFieldErrorMessages();
        for (const expected of expectedMessages) {
            expect(messages.some(message => message.includes(expected))).toBeTruthy();
        }
    }

    public async verifyDuplicateEmailError(): Promise<void> {
        const registerFormComponent = this.fixture.registerPage.registerFormComponent();
        const summary = await registerFormComponent.getValidationSummaryMessage();
        expect(summary).toContain('The specified email already exists');
    }

    public async logout(): Promise<void> {
        await this.fixture.homePage.headerComponent().clickLogout();
    }
}
