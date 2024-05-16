import { Locator } from "@playwright/test";
import ComputerEssentialComponent from "./ComputerEssentialComponent";
import { selector } from "../SelectorDecorator";

@selector(".product-essential")
export default class StandardComputerComponent extends ComputerEssentialComponent {

    private productAttrSel = 'select[id^="product_attribute"]';

    constructor(component: Locator) {
        super(component);
    }

    async selectProcessorType(type: string): Promise<void> {
        const PROCESSOR_DROP_DOWN_INDEX = 0;
        const allDropdown: Locator[] = await this.component.locator(this.productAttrSel).all();
        await this.selectOption(allDropdown[PROCESSOR_DROP_DOWN_INDEX], type);
    }

    async selectRAMType(type: string): Promise<void> {
        const RAM_DROP_DOWN_INDEX = 1;
        const allDropdown: Locator[] = await this.component.locator(this.productAttrSel).all();
        await this.selectOption(allDropdown[RAM_DROP_DOWN_INDEX], type);
    }

    private async selectOption(dropdown: Locator, type: string): Promise<void> {
        // Loop all the option then search for the option that start with the type value
        const allOptions = await dropdown.locator('option').all();
        let optionIndex = 0;
        for (let optionEle of allOptions) {
            const optionText = await optionEle.textContent();
            if (optionText.startsWith(type)) {
                optionIndex = allOptions.indexOf(optionEle);
                break;
            }

        }
        await dropdown.selectOption({ index: optionIndex });
    }
}

