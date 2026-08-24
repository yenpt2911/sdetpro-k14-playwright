import defaultUserData from './DefaultCheckoutUser.json';

/**
 * Default checkout user used across test flows.
 * Sensitive/identifiable fields (email) can be overridden via environment
 * variables so real-looking data is not hardcoded/committed to source control.
 */
const DefaultCheckoutUser = {
    ...defaultUserData,
    email: process.env.TEST_USER_EMAIL || defaultUserData.email,
};

export default DefaultCheckoutUser;
