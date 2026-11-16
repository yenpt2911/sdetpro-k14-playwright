import { test } from '../../test-flows/global/RegisterFlow';
import invalidAccountData from '../../test-data/global/InvalidAccountData.json';
import ROUTES from '../../constants/Routes';

invalidAccountData.forEach(testCase => {
    test(`Test register validation | ${testCase.testCaseId}: ${testCase.description}`, async ({ page, registerFlow }) => {
        await page.goto(ROUTES.register);
        await registerFlow.attemptRegister(testCase.data);
        await registerFlow.verifyFieldErrorsContain(testCase.expectedFieldErrors);
    });
});
