import { test } from '../../test-flows/computer/OrderComputerFlow';
import StandardComputerComponent from '../../modules/components/computer/StandardComputerComponent';
import testData from '../../test-data/computer/StandardComputerData.json';
import PAYMENT_METHOD from '../../constants/Payment';
import CREDIT_CARD_TYPE from '../../constants/CreditCardType';
import ROUTES from '../../constants/Routes';

test('Test Standard computer component', async ({ page, orderComputerFlow }) => {
    await page.goto(ROUTES.buildStandardComputer);
    await orderComputerFlow.buildCompSpecAndAddToCart(StandardComputerComponent, testData);
    await orderComputerFlow.verifyShoppingCart();
    await orderComputerFlow.agreeTOSAndCheckout();
    await orderComputerFlow.inputBillingAddress();
    await orderComputerFlow.inputShippingAddress();
    await orderComputerFlow.selectShippingMethod();
    await orderComputerFlow.selectPaymentMethod(PAYMENT_METHOD.creditCard);
    await orderComputerFlow.inputPaymentInformation(CREDIT_CARD_TYPE.discover);
    await orderComputerFlow.confirmOrder();
})