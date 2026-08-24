import { expect, type Page } from '@playwright/test';
import ROUTES from '../../constants/Routes';
import CheapComputerComponent from '../../modules/components/computer/CheapComputerComponent';
import OrderComputerFlow, { test } from '../../test-flows/computer/OrderComputerFlow';
import cheapComputerData from '../../test-data/computer/CheapComputerData.json';
import guestBillingValidationData from '../../test-data/checkout/GuestBillingValidationData.json';

const desktopOrderData = cheapComputerData[0];
const [blankBillingScenario, invalidEmailScenario] = guestBillingValidationData;

async function openGuestCheckout(orderComputerFlow: OrderComputerFlow, page: Page): Promise<void> {
    await page.goto(ROUTES.buildCheapComputer);
    await expect(page).toHaveURL(new RegExp(`${ROUTES.buildCheapComputer}$`));

    await orderComputerFlow.buildCompSpecAndAddToCart(CheapComputerComponent, desktopOrderData);
    await orderComputerFlow.verifyShoppingCart();
    await orderComputerFlow.agreeTOSAndCheckout();

    await expect(page).toHaveURL(/\/onepagecheckout$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Checkout' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Billing address' })).toBeVisible();
}

test(`Guest checkout billing validation | ${blankBillingScenario.scenario}`, async ({ page, orderComputerFlow }) => {
    await openGuestCheckout(orderComputerFlow, page);

   // await orderComputerFlow.submitBillingAddress();
    await orderComputerFlow.verifyBillingAddressValidationErrors(blankBillingScenario.expectedErrors);
    await expect(page.getByRole('heading', { level: 2, name: 'Billing address' })).toBeVisible();
});

test(`Guest checkout billing validation | ${invalidEmailScenario.scenario}`, async ({ page, orderComputerFlow }) => {
    await openGuestCheckout(orderComputerFlow, page);

    await orderComputerFlow.inputBillingAddress(invalidEmailScenario.billingAddress);
    //await orderComputerFlow.submitBillingAddress();
    await orderComputerFlow.verifyBillingAddressValidationErrors(invalidEmailScenario.expectedErrors);
    await expect(page.getByRole('heading', { level: 2, name: 'Billing address' })).toBeVisible();
});

test('Guest checkout billing validation | continues to shipping address after valid mandatory billing details', async ({ page, orderComputerFlow }) => {
    await openGuestCheckout(orderComputerFlow, page);

    await orderComputerFlow.inputBillingAddress();
    await orderComputerFlow.verifyShippingAddressStepVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Shipping address' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' }).or(page.locator('input[value="Continue"]')).first()).toBeVisible();
});