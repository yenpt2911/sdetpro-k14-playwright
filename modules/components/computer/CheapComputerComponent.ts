import { Locator} from "@playwright/test";
import ComputerEssentialComponent from "./ComputerEssentialComponent";
import {selector} from "../SelectorDecorator";

@selector(".CheapComputerComponent.selector")
export default class CheapComputerComponent extends ComputerEssentialComponent {

    constructor(component: Locator) {
        super(component);
    }

    selectProcessorType(type: string): Promise<void> {
        console.log('selectProcessorType | CheapComputerComponent'); 
        return Promise.resolve(undefined);
    }

    selectRAMType(type: string): Promise<void> {
        return Promise.resolve(undefined);
    }
}

