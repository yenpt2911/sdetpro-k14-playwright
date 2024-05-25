import { test } from '@playwright/test';
import OrderComputerFlow from '../../test-flows/computer/OrderComputerFlow';
import StandardComputerComponent from '../../modules/components/computer/StandardComputerComponent';
import testData from '../../test-data/computer/StandardComputerData.json';

test('Test Standard computer component', async ({ page }) => {
     await page.goto('https://demowebshop.tricentis.com/build-your-own-computer');
     const computerFlow: OrderComputerFlow = new OrderComputerFlow(page, StandardComputerComponent, testData);
    await computerFlow.buildCompSpecAndAddToCart();
    await computerFlow.verifyShoppingCart();
    await computerFlow.agreeTOSAndCheckout();
    await computerFlow.inputBillingAddress();
    await computerFlow.inputShippingAddress();
    await computerFlow.selectShippingMethod();
   
})