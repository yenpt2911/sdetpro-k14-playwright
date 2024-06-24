import { Locator } from "@playwright/test";
import { selector } from "../SelectorDecorator";
import CheckoutDetailsComponent from "./CheckoutDetailsComponent";

@selector("#opc-billing")
export default class BillingAddressComponent extends CheckoutDetailsComponent {
    static selectorValue(selectorValue: any): any {
        throw new Error("Method not implemented.");
    }
    protected component: Locator;

    private readonly inputAddressDropdownSel = '#billing-address-select';
    private readonly firstnameSel = '#BillingNewAddress_FirstName';
    private readonly lastnameSel = '#BillingNewAddress_LastName';
    private readonly emailAddressSel = '#BillingNewAddress_Email';
    private readonly countryDropdownSel = '#BillingNewAddress_CountryId';
    private readonly stateDropdownSel = '#BillingNewAddress_StateProvinceId';
    private readonly citySel = '#BillingNewAddress_City';
    private readonly address1Sel = '#BillingNewAddress_Address1';
    private readonly zipCodeSel = '#BillingNewAddress_ZipPostalCode';
    private readonly phonenumberSel = '#BillingNewAddress_PhoneNumber';

    protected constructor(component: Locator) {
        super(component);
        this.component = component;
    }

    public async selectInputNewAddress() {
        const inputSelectDropDownEle = await this.component.locator(this.inputAddressDropdownSel);
        const isUsingExistingAddDropdownDisplayed = await inputSelectDropDownEle.count() > 0;
        if (isUsingExistingAddDropdownDisplayed) {
            await inputSelectDropDownEle.selectOption({ label: "New Address" });
        }
    }
    public async inputFirstname(firstname: string): Promise<void> {
        await this.component.locator(this.firstnameSel).fill(firstname);
    }

    public async inputLastname(lastname: string): Promise<void> {
        await this.component.locator(this.lastnameSel).fill(lastname);
    }

    public async inputEmailAddress(emailAddress: string): Promise<void> {
        await this.component.locator(this.emailAddressSel).fill(emailAddress);
    }

    public async selectCountry(country: string): Promise<void> {
        await this.component.locator(this.countryDropdownSel).selectOption({label: country});
    }

    public async selectState(stateProvice: string): Promise<void> {
        await this.component.locator(this.stateDropdownSel).selectOption({ label: stateProvice });
    }

    public async inputCity(city: string): Promise<void> {
        await this.component.locator(this.citySel).fill(city);
    }

    public async inputAddress(address1: string): Promise<void> {
        await this.component.locator(this.address1Sel).fill(address1);
    }

    public async inputZipCode(zipCode: string): Promise<void> {
        await this.component.locator(this.zipCodeSel).fill(zipCode);
    }

    public async inputPhonenumber(phonenumber: string): Promise<void> {
        await this.component.locator(this.phonenumberSel).fill(phonenumber);
    }


}
