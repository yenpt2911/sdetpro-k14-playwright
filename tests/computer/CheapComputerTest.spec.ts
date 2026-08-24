import { test } from '../../test-flows/computer/OrderComputerFlow';
import CheapComputerComponent from '../../modules/components/computer/CheapComputerComponent';
import testData from '../../test-data/computer/CheapComputerData.json';
import PAYMENT_METHOD from '../../constants/Payment';
import CREDIT_CARD_TYPE from '../../constants/CreditCardType';
import ROUTES from '../../constants/Routes';


testData.forEach(computerData => {
    test(`Test Cheap computer component | RAM: ${computerData.ram}`, async ({ page, orderComputerFlow }) => {
        await page.goto(ROUTES.buildCheapComputer);
        await orderComputerFlow.buildCompSpecAndAddToCart(CheapComputerComponent, computerData);
        await orderComputerFlow.verifyShoppingCart();
        await orderComputerFlow.agreeTOSAndCheckout();
        await orderComputerFlow.inputBillingAddress();
        await orderComputerFlow.inputShippingAddress();
        await orderComputerFlow.selectShippingMethod();
        await orderComputerFlow.selectPaymentMethod(PAYMENT_METHOD.creditCard);
        await orderComputerFlow.inputPaymentInformation(CREDIT_CARD_TYPE.discover);
        await orderComputerFlow.confirmOrder();
    })
})