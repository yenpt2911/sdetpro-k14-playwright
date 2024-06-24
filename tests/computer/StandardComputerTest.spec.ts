import { test } from '@playwright/test';
import OrderComputerFlow from '../../test-flows/computer/OrderComputerFlow';
import StandardComputerComponent from '../../modules/components/computer/StandardComputerComponent';
import testData from '../../test-data/computer/StandardComputerData.json';
import PAYMENT_METHOD from '../../constants/Payment';
import CREDIT_CARD_TYPE from '../../constants/CreditCardType';

test('Test Standard computer component', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/build-your-own-computer');
    const computerFlow: OrderComputerFlow = new OrderComputerFlow(page, StandardComputerComponent, testData);
    await computerFlow.buildCompSpecAndAddToCart();
    await computerFlow.verifyShoppingCart();
    await computerFlow.agreeTOSAndCheckout();
    await computerFlow.inputBillingAddress();
    await computerFlow.inputShippingAddress();
    await computerFlow.selectShippingMethod();
    await computerFlow.selectPaymentMethod(PAYMENT_METHOD.creditCard);
    await computerFlow.selectPaymentMethod(CREDIT_CARD_TYPE.discover);
    await computerFlow.confirmOrder();

    await page.waitForTimeout(3 * 1000);
})