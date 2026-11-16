import { test } from '../../test-flows/global/RegisterFlow';
import defaultAccountData from '../../test-data/global/NewAccountData.json';
import { uniqueEmail } from '../../utils/TestDataHelper';
import ROUTES from '../../constants/Routes';

test('Test register with an email that already has an account | TC-006', async ({ page, registerFlow }) => {
    const email = uniqueEmail(defaultAccountData.emailPrefix);

    await page.goto(ROUTES.register);
    await registerFlow.registerNewAccount({ ...defaultAccountData, email });
    await registerFlow.verifyRegistrationSucceeded();

    await registerFlow.logout();

    await page.goto(ROUTES.register);
    await registerFlow.attemptRegister({
        gender: 'female',
        firstName: 'Duplicate',
        lastName: 'User',
        email,
        password: defaultAccountData.password,
        confirmPassword: defaultAccountData.password,
    });
    await registerFlow.verifyDuplicateEmailError();
});
