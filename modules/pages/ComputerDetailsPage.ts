import { Locator, Page } from "@playwright/test";
import ComputerEssentialComponent from "../components/computer/ComputerEssentialComponent";

export type ComputerComponentConstructor<Tun extends ComputerEssentialComponent> = new (component: Locator) => Tun;

export default class ComputerDetailsPage {

    constructor(private page: Page) {
        this.page = page;
    }

    // Boundary Generic type
    computerComp<Tun extends ComputerEssentialComponent>(
        computerComponentClass: ComputerComponentConstructor<Tun>
    ): Tun {
        return new computerComponentClass(this.page.locator(computerComponentClass.selectorValue));
    }

    standardComputerComp() {

    }
}