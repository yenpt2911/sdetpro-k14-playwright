import { test } from '@playwright/test';
import OrderComputerFlow from '../../test-flows/computer/OrderComputerFlow';
import CheapComputerComponent from '../../modules/components/computer/CheapComputerComponent';
import testData from '../../test-data/computer/CheapComputerData.json';
import PAYMENT_METHOD from '../../constants/Payment';
import CREDIT_CARD_TYPE from '../../constants/CreditCardType';


testData.forEach(computerData => {
    test(`Test Cheap computer component | RAM: ${computerData.ram}`, async ({ page }) => {
        await page.goto('https://demowebshop.tricentis.com/build-your-cheap-own-computer');
        const computerFlow: OrderComputerFlow = new OrderComputerFlow(page, CheapComputerComponent, computerData);
        await computerFlow.buildCompSpecAndAddToCart();
        await computerFlow.verifyShoppingCart();
        await computerFlow.agreeTOSAndCheckout();
        await computerFlow.inputBillingAddress();
        await computerFlow.inputShippingAddress();
        await computerFlow.selectShippingMethod();
        await computerFlow.selectPaymentMethod(PAYMENT_METHOD.creditCard);
        await computerFlow.inputPaymentInformation(CREDIT_CARD_TYPE.discover);
        await computerFlow.confirmOrder();

        await page.waitForTimeout(3 * 1000);

    })
})