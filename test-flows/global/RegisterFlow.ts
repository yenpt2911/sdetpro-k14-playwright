import { test as pageObjectFixtures, PageObjectFixtures } from "../../fixtures/PageObjectTestFixture";
import { test as globalTestAll } from "../../fixtures/GlobalBeforeAllFixture";
import { mergeTests, expect } from "@playwright/test";

export const test = mergeTests(pageObjectFixtures, globalTestAll).extend<{ registerFlow: RegisterFlow }>({
    registerFlow: async ({ registerPage }, use) => {
        const registerFlow = new RegisterFlow({ registerPage });
        await use(registerFlow);
    }
});

export default class RegisterFlow {

    constructor(
        private readonly fixture: Pick<PageObjectFixtures, 'registerPage'>
    ) {
    }

    public async registerNewAccount(accountData: {
        gender: 'male' | 'female',
        firstName: string,
        lastName: string,
        email: string,
        password: string
    }): Promise<void> {
        const registerPage = this.fixture.registerPage;
        const registerFormComponent = registerPage.registerFormComponent();

        await registerFormComponent.selectGender(accountData.gender);
        await registerFormComponent.inputFirstName(accountData.firstName);
        await registerFormComponent.inputLastName(accountData.lastName);
        await registerFormComponent.inputEmail(accountData.email);
        await registerFormComponent.inputPassword(accountData.password);
        await registerFormComponent.inputConfirmPassword(accountData.password);
        await registerFormComponent.clickRegisterButton();
    }

    public async verifyRegistrationSucceeded(): Promise<void> {
        const registerPage = this.fixture.registerPage;
        const resultMessage = await registerPage.getResultMessage();
        expect(resultMessage).toContain('Your registration completed');
    }
}
