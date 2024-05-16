import { Locator} from "@playwright/test";
import ComputerEssentialComponent from "./ComputerEssentialComponent";
import { selector } from "../SelectorDecorator";

@selector(".StandardComputerComponent.selector")
export default class StandardComputerComponent extends ComputerEssentialComponent {

    constructor(component: Locator) {
        super(component);
    }

    selectProcessorType(type: string): Promise<void> {
        console.log('selectProcessorType | StandardComputerComponent');
        return Promise.resolve(undefined);
    }

    selectRAMType(type: string): Promise<void> {
        return Promise.resolve(undefined);
    }
}

