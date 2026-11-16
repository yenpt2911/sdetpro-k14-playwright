import defaultAccountData from './NewAccountData.json';
import { uniqueEmail } from '../../utils/TestDataHelper';

/**
 * New-account data for registration tests.
 * Email must be unique per test run (demowebshop rejects duplicate emails),
 * so it's generated at import time rather than hardcoded in the JSON fixture.
 */
const NewAccountData = {
    ...defaultAccountData,
    email: process.env.TEST_NEW_ACCOUNT_EMAIL || uniqueEmail(defaultAccountData.emailPrefix),
};

export default NewAccountData;
