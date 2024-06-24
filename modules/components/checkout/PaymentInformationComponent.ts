import { Locator } from "@playwright/test";
import { selector } from "../SelectorDecorator";
import CheckoutDetailsComponent from "./CheckoutDetailsComponent";
import CREDIT_CARD_TYPE from "../../../constants/CreditCardType";

@selector("#opc-payment_info")
export default class PaymentInformationComponent extends CheckoutDetailsComponent {
    protected component: Locator;

    private creditCardDropdownSel = '#CreditCardType';
    private cardHolderNameSel = '#CardholderName';
    private cardNumberSel = '#CardNumber';
    private cardExpirationMonthDropdownSel = '#ExpireMonth';
    private cardExpirationYearDropdownSel = '#ExpireYear';
    private cardCodeSel = '#CardCode';

    protected constructor(component: Locator) {
        super(component);
        this.component = component;
    }

    public async selectCardType(creditCardType: string): Promise<void> {
        const creditCardDropdown = await this.component.locator(this.creditCardDropdownSel);
        switch (creditCardType) {
            case CREDIT_CARD_TYPE.visa:
                await creditCardDropdown.selectOption({ label: CREDIT_CARD_TYPE.visa });
                break;
            case CREDIT_CARD_TYPE.masterCard:
                await creditCardDropdown.selectOption({ label: CREDIT_CARD_TYPE.masterCard });
                break;
            case CREDIT_CARD_TYPE.discover:
                await creditCardDropdown.selectOption({ label: CREDIT_CARD_TYPE.discover });
                break;
            case CREDIT_CARD_TYPE.amex:
                await creditCardDropdown.selectOption({ label: CREDIT_CARD_TYPE.amex });
                break;
        }
    }
    public async inputCardHolderName(cardHolerName: string): Promise<void> {
        await this.component.locator(this.cardHolderNameSel).fill(cardHolerName);
    }

    public async inputCardNumber(cardNumber: string): Promise<void> {
        await this.component.locator(this.cardNumberSel).fill(cardNumber);
    }

    public async selectExpirationMonth(month: string): Promise<void> {
        await this.component.locator(this.cardExpirationMonthDropdownSel).selectOption({label: month});
    }

    public async selectExpirationYear(year: string): Promise<void> {
        await this.component.locator(this.cardExpirationYearDropdownSel).selectOption({label: year});
    }

    public async inputCardCode(cardCode: string): Promise<void> {
        await this.component.locator(this.cardCodeSel).fill(cardCode);
    }

}
