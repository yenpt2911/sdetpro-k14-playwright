import { test } from '@playwright/test'
import FooterTestFlow from '../../test-flows/global/FooterTestFlow';

const BASE_URL = 'https://demowebshop.tricentis.com';
const PAGES = [
    {
        pageName: 'Home Page',
        slug: '/'
    },
    {
        pageName: 'Login Page',
        slug: '/login'
    },
    {
        pageName: 'Register Page',
        slug: '/register'
    }
]

PAGES.forEach(page => {
    const { pageName, slug } = page;
    test(`Test Footer component on ${pageName}`, async ({ page }) => {
        await page.goto(BASE_URL.concat(slug));
        const footerTestFlow: FooterTestFlow = new FooterTestFlow(page);
        await footerTestFlow.verifyFooterComponent();
    })
})

