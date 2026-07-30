import { test } from '../../fixtures/PageObjectTestFixture';
import CheapComputerComponent from '../../modules/components/computer/CheapComputerComponent';
import StandardComputerComponent from '../../modules/components/computer/StandardComputerComponent';
import ComputerEssentialComponent from '../../modules/components/computer/ComputerEssentialComponent';

test('Test Generic Component in page', async ({ computerDetailsPage }) => {

    const cheapComputerComponent: ComputerEssentialComponent = computerDetailsPage.computerComp(CheapComputerComponent);
    const standardComputerComp: ComputerEssentialComponent = computerDetailsPage.computerComp(StandardComputerComponent);

    await cheapComputerComponent.selectProcessorType("Testing");
    await standardComputerComp.selectProcessorType("Testing");

})