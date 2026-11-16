import { test } from '../../test-flows/global/RegisterFlow';
import registerGenderData from '../../test-data/global/RegisterGenderData';
import ROUTES from '../../constants/Routes';

registerGenderData.forEach(accountData => {
    test(`Test register new account | ${accountData.testCaseId}: gender ${accountData.gender ?? 'none'}`, async ({ page, registerFlow }) => {
        console.log(`Registering with email: ${accountData.email}`);
        await page.goto(ROUTES.register);
        await registerFlow.registerNewAccount(accountData);
        await registerFlow.verifyRegistrationSucceeded();
    });
});
