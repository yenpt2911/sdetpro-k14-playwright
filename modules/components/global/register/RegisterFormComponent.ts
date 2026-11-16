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
    // verified live: unobtrusive validation populates these spans after a failed submit
    private firstNameErrorSel = '[data-valmsg-for="FirstName"]';
    private lastNameErrorSel = '[data-valmsg-for="LastName"]';
    private emailErrorSel = '[data-valmsg-for="Email"]';
    private passwordErrorSel = '[data-valmsg-for="Password"]';
    private confirmPasswordErrorSel = '[data-valmsg-for="ConfirmPassword"]';
    // verified live: server-side errors (e.g. duplicate email) render here, not in the per-field spans above
    private validationSummarySel = '.validation-summary-errors';

    constructor(component: Locator) {
        this.component = component;
    }

    public async selectGender(gender: 'male' | 'female'): Promise<void> {
        const genderSel = gender === 'male' ? this.genderMaleSel : this.genderFemaleSel;
        await this.component.locator(genderSel).check();
    }

    private async fillField(selector: string, value: string): Promise<void> {
        await this.component.locator(selector).fill(value);
    }

    public async inputFirstName(firstName: string): Promise<void> {
        await this.fillField(this.firstNameSel, firstName);
    }

    public async inputLastName(lastName: string): Promise<void> {
        await this.fillField(this.lastNameSel, lastName);
    }

    public async inputEmail(email: string): Promise<void> {
        await this.fillField(this.emailSel, email);
    }

    public async inputPassword(password: string): Promise<void> {
        await this.fillField(this.passwordSel, password);
    }

    public async inputConfirmPassword(confirmPassword: string): Promise<void> {
        await this.fillField(this.confirmPasswordSel, confirmPassword);
    }

    public async clickRegisterButton(): Promise<void> {
        await this.component.locator(this.registerBtnSel).click();
    }

    public async getFieldErrorMessages(): Promise<string[]> {
        const errorSelectors = [
            this.firstNameErrorSel,
            this.lastNameErrorSel,
            this.emailErrorSel,
            this.passwordErrorSel,
            this.confirmPasswordErrorSel,
        ];
        const messages: string[] = [];
        for (const sel of errorSelectors) {
            const text = (await this.component.locator(sel).textContent())?.trim() ?? '';
            if (text) {
                messages.push(text);
            }
        }
        return messages;
    }

    public async getValidationSummaryMessage(): Promise<string> {
        return (await this.component.locator(this.validationSummarySel).textContent())?.trim() ?? '';
    }
}
