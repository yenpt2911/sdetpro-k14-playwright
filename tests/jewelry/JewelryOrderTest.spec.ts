import { test } from '../../test-flows/computer/OrderComputerFlow';
import jewelryOrderData from '../../test-data/jewelry/JewelryOrderData.json';
import ROUTES from '../../constants/Routes';
import PAYMENT_METHOD from '../../constants/Payment';
import CREDIT_CARD_TYPE from '../../constants/CreditCardType';

jewelryOrderData.forEach(data => {
    test(`Test Jewelry order | ${data.productName}`, async ({ page, homePage, orderComputerFlow }) => {
        await page.goto(ROUTES.home);
        await homePage.openJewelryCategory();
        await homePage.openProduct(data.productName);
        await orderComputerFlow.addJewelryToCart(data.price, data.quantity);
        await orderComputerFlow.verifyShoppingCart();
        await orderComputerFlow.agreeTOSAndCheckout();
        await orderComputerFlow.inputBillingAddress();
        await orderComputerFlow.inputShippingAddress();
        await orderComputerFlow.selectShippingMethod();
        await orderComputerFlow.selectPaymentMethod(PAYMENT_METHOD.creditCard);
        await orderComputerFlow.inputPaymentInformation(CREDIT_CARD_TYPE.discover);
        await orderComputerFlow.confirmOrder();
        await page.getByText('Thank you').waitFor();
    });
});