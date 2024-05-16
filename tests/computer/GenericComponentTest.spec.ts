import { test } from '@playwright/test';
import ComputerDetailsPage from '../../modules/pages/ComputerDetailsPage';
import FooterComponent from '../../modules/components/global/footer/FootetComponent';
import CheapComputerComponent from '../../modules/components/computer/CheapComputerComponent';
import StandardComputerComponent from '../../modules/components/computer/StandardComputerComponent';
import ComputerEssentialComponent from '../../modules/components/computer/ComputerEssentialComponent';

test('Test Generic Component in page', async ({ page }) => {

    const computerDetailPage: ComputerDetailsPage = new ComputerDetailsPage(page);
    const cheapComputerComponent: ComputerEssentialComponent = computerDetailPage.computerComp(CheapComputerComponent);
    const standardComputerComp: ComputerEssentialComponent = computerDetailPage.computerComp(StandardComputerComponent);

    await cheapComputerComponent.selectProcessorType("Testing");
    await standardComputerComp.selectProcessorType("Testing");

})