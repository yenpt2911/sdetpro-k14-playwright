/**
 * Relative route paths (used with `page.goto()`).
 * Kept relative so they combine with `baseURL` in playwright.config.js,
 * making tests portable across environments (dev/qa/prod).
 */
const ROUTES = {
    home: '/',
    buildCheapComputer: '/build-your-cheap-own-computer',
    buildStandardComputer: '/build-your-own-computer',
};

export default ROUTES;
