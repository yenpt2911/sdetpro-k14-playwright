import { Locator } from "@playwright/test";

export default abstract class ComputerEssentialComponent {

    protected component: Locator;
    
    protected constructor(component: Locator) {
        this.component = component;
    }

    public abstract selectProcessorType(type: string): Promise<void>;
    public abstract selectRAMType(type: string): Promise<void>;

    public async selectHDDType(type: string): Promise<void> {
        await this.selectCompOption(type);
    };

    public async selectOSType(type: string): Promise<void> {
        await this.selectCompOption(type);
    };

    public async selectSoftwareType(type: string): Promise<void> {
        await this.selectCompOption(type);
    };

    protected async selectCompOption(type: string): Promise<void> {
        const selectorValue = `//label[contains(text(),"${type}")]`;
        const optionEles: Locator[] = await this.component.locator(selectorValue).all();
        const FIRST_ELE_INDEX = 0;
        await optionEles[FIRST_ELE_INDEX].scrollIntoViewIfNeeded();
        await optionEles[FIRST_ELE_INDEX].click();
    }


}