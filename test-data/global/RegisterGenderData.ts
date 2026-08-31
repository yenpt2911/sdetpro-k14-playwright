import defaultAccountData from './NewAccountData.json';
import { uniqueEmail } from '../../utils/TestDataHelper';

/**
 * Gender variants for TC-001 (male), TC-002 (female), TC-003 (no gender selected).
 * Each entry gets its own unique email since demowebshop rejects duplicate registrations.
 */
const genders: Array<{ testCaseId: string, gender: 'male' | 'female' | undefined }> = [
    { testCaseId: 'TC-001', gender: 'male' },
    { testCaseId: 'TC-002', gender: 'female' },
    { testCaseId: 'TC-003', gender: undefined },
];

const RegisterGenderData = genders.map(({ testCaseId, gender }, index) => ({
    ...defaultAccountData,
    testCaseId,
    gender,
    // include index: Date.now() can resolve to the same millisecond across
    // synchronous .map() iterations, which would otherwise generate duplicate emails
    email: uniqueEmail(`${defaultAccountData.emailPrefix}-${index}`),
}));

export default RegisterGenderData;
