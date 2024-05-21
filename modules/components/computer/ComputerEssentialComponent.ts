import { Locator } from "@playwright/test";
import BaseItemDetailsComponent from "../BaseItemDetailsComponent";

export default abstract class ComputerEssentialComponent  extends BaseItemDetailsComponent {

    protected component: Locator;

    
    protected constructor(component: Locator) {
        super(component);
        this.component = component;
    }

    public abstract selectProcessorType(type: string): Promise<string>;
    public abstract selectRAMType(type: string): Promise<string>;

    public async selectHDDType(type: string): Promise<string> {
        return await this.selectCompOption(type);
    };

    public async selectOSType(type: string): Promise<string> {
        return await this.selectCompOption(type);
    };

    public async selectSoftwareType(type: string): Promise<string> {
        return await this.selectCompOption(type);
    };

    protected async selectCompOption(type: string): Promise<string> {
        const selectorValue = `//label[contains(text(),"${type}")]`;
        const optionEles: Locator[] = await this.component.locator(selectorValue).all();
        const FIRST_ELE_INDEX = 0;
        const optionEle = optionEles[FIRST_ELE_INDEX];
        await optionEle.scrollIntoViewIfNeeded();
        const optionText = await optionEle.textContent();
        await optionEle.click();
        return optionText;
    }


}