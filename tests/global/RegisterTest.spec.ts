import { test } from '../../test-flows/global/RegisterFlow';
import newAccountData from '../../test-data/global/NewAccountData';
import ROUTES from '../../constants/Routes';

test('Test register new account', async ({ page, registerFlow }) => {
    console.log(`Registering with email: ${newAccountData.email}`);
    await page.goto(ROUTES.register);
    await registerFlow.registerNewAccount(newAccountData);
    await registerFlow.verifyRegistrationSucceeded();
});
