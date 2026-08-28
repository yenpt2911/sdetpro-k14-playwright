import { Locator } from "@playwright/test";
import { selector } from "../../SelectorDecorator";

@selector(".registration-page")
export default class RegisterFormComponent {

    protected component: Locator;

    private genderMaleSel = '#gender-male';
    private genderFemaleSel = '#gender-female';
    private firstNameSel = '#FirstName';
    private lastNameSel = '#LastName';
    private emailSel = '#Email';
    private passwordSel = '#Password';
    private confirmPasswordSel = '#ConfirmPassword';
    private registerBtnSel = '#register-button';

    constructor(component: Locator) {
        this.component = component;
    }

    public async selectGender(gender: 'male' | 'female'): Promise<void> {
        const genderSel = gender === 'male' ? this.genderMaleSel : this.genderFemaleSel;
        await this.component.locator(genderSel).check();
    }

    public async inputFirstName(firstName: string): Promise<void> {
        await this.component.locator(this.firstNameSel).fill(firstName);
    }

    public async inputLastName(lastName: string): Promise<void> {
        await this.component.locator(this.lastNameSel).fill(lastName);
    }

    public async inputEmail(email: string): Promise<void> {
        await this.component.locator(this.emailSel).fill(email);
    }

    public async inputPassword(password: string): Promise<void> {
        await this.component.locator(this.passwordSel).fill(password);
    }

    public async inputConfirmPassword(confirmPassword: string): Promise<void> {
        await this.component.locator(this.confirmPasswordSel).fill(confirmPassword);
    }

    public async clickRegisterButton(): Promise<void> {
        await this.component.locator(this.registerBtnSel).click();
    }
}
