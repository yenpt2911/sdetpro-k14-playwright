import { test } from '@playwright/test';
import OrderComputerFlow from '../../test-flows/computer/OrderComputerFlow';
import StandardComputerComponent from '../../modules/components/computer/StandardComputerComponent';


test('Test Standard computer component', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/build-your-own-computer');
    const computerFlow: OrderComputerFlow = new OrderComputerFlow(page, StandardComputerComponent);
    await computerFlow.buildCompSpecAndAddToCart();

})