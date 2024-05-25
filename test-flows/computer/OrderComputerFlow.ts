import { Page } from "@playwright/test"
import ComputerDetailsPage, { ComputerComponentConstructor } from "../../modules/pages/ComputerDetailsPage";
import ComputerEssentialComponent from "../../modules/components/computer/ComputerEssentialComponent";
import ShoppingCartPage from "../../modules/pages/ShoppingCartPage";
import CheckoutOptionsPage from "../../modules/pages/CheckoutOptionsPage";
import defaultCheckoutUser from "../../test-data/DefaultCheckoutUser.json"
import CheckoutPage from "../../modules/pages/CheckoutPage";
import BillingAddressComponent from "../../modules/components/checkout/BillingAddressComponent";
import ShippingAddressComponent from "../../modules/components/checkout/ShippingAddressComponent";
import ShippingMethodComponent from "../../modules/components/checkout/ShippingMethodComponent";


export default class OrderComputerFlow {

    private totalPrice: number;
    private productQuantity: number;

    constructor(
        private readonly page: Page,
        private readonly computerComponentClass: ComputerComponentConstructor<ComputerEssentialComponent>,
        private readonly computerData: any
    ) {
        this.page = page;
        this.computerComponentClass = computerComponentClass;
        this.computerData = computerData;
    }

    async buildCompSpecAndAddToCart(): Promise<void> {

        // Build computer spec
        const computerDetailPage: ComputerDetailsPage = new ComputerDetailsPage(this.page);
        const computerComp = computerDetailPage.computerComp(this.computerComponentClass);
        await computerComp.unselectDefaultOptions();
        const selectedProcessorText = await computerComp.selectProcessorType(this.computerData.processorType);
        const selectedRAMText = await computerComp.selectRAMType(this.computerData.ram);
        const selectedHDDText = await computerComp.selectHDDType(this.computerData.hdd);
        const selectSoftwareText = await computerComp.selectSoftwareType(this.computerData.software);
        console.log(`Additional Price selectedProcessorText: ${this.extractAdditionalPrice(selectedProcessorText)}`);
        console.log(`Additional Price selectedRAMText: ${this.extractAdditionalPrice(selectedRAMText)}`);
        console.log(`Additional Price selectedHDDText: ${this.extractAdditionalPrice(selectedHDDText)}`);

        let additionalOsPrice = 0;
        if (this.computerData.os) {
            const selectedOSText = await computerComp.selectOSType(this.computerData.os);
            additionalOsPrice = this.extractAdditionalPrice(selectedOSText);
        }
        // Calculate current product's price
        const basePrice = await computerComp.getProductPrice();
        const additionalPrices =
            this.extractAdditionalPrice(selectedProcessorText)
            + this.extractAdditionalPrice(selectedRAMText)
            + this.extractAdditionalPrice(selectedHDDText)
            + this.extractAdditionalPrice(selectSoftwareText)
            + additionalOsPrice;

        this.productQuantity = await computerComp.getProductQuantity();
        this.totalPrice = (basePrice + additionalPrices) * this.productQuantity;


        // Handle waiting add to cart
        computerComp.clickOnAddToCartBtn();
        const barNotificationText = await computerDetailPage.getBarNotificationText();
        if (!barNotificationText.startsWith("The product has been added")) {
            throw new Error('Failed to add product to cart');
        }

        // Navigate to the shopping cart
        await computerDetailPage.headerComponent().clickOnShoppingCartLink();

        //await this.page.waitForTimeout(3 * 1000);
    }

    public async verifyShoppingCart(): Promise<void> {
        const shoppingCartPage: ShoppingCartPage = new ShoppingCartPage(this.page);
        const cartItemRowComponentList = await shoppingCartPage.cartItemRowComponentList();
        const totalComponent = shoppingCartPage.totalComponent();
        for (let cartItemRowComponent of cartItemRowComponentList) {
            const unitPrice = await cartItemRowComponent.unitPrice();
            const quantity = await cartItemRowComponent.quantity();
            const subTotal = await cartItemRowComponent.subTotal();
            console.log(`unitPrice: ${unitPrice}, quantity: ${quantity}, subTotal: ${subTotal}`);
        }
        const priceCategories = await totalComponent.priceCategories();
        console.log(`priceCategories: ${JSON.stringify(priceCategories)}`);

    }

    public async agreeTOSAndCheckout(): Promise<void> {
        const shoppingCartPage: ShoppingCartPage = new ShoppingCartPage(this.page);
        await shoppingCartPage.totalComponent().acceptTOS();
        await shoppingCartPage.totalComponent().clickOnCheckoutBtn();

        // Exceptional case that the flow step is handling 2 pages
        const checkoutOptionsPage: CheckoutOptionsPage = new CheckoutOptionsPage(this.page);
        await checkoutOptionsPage.checkoutAsGuest();
        await this.page.waitForTimeout(3 * 1000);
    }

    public async inputBillingAddress(): Promise<void>{
        const { firstName, lastName, email, country, state, city, add1, zipCode, phoneNum } = defaultCheckoutUser;
        const checkoutPage: CheckoutPage = new CheckoutPage(this.page);
        const billingAddressComponent: BillingAddressComponent = checkoutPage.billingAddressComponent();
        await billingAddressComponent.inputFirstname(firstName);
        await billingAddressComponent.inputLastname(lastName)
        await billingAddressComponent.inputEmailAddress(email);
        await billingAddressComponent.selectCountry(country);
        await billingAddressComponent.selectState(state);
        await billingAddressComponent.inputCity(city);
        await billingAddressComponent.inputAddress(add1);
        await billingAddressComponent.inputZipCode(zipCode);
        await billingAddressComponent.inputPhonenumber(phoneNum);
        await billingAddressComponent.clickOnContinueButton();

        await this.page.waitForTimeout(3 * 1000);
    }

    public async inputShippingAddress(): Promise<void> {
        const checkoutPage: CheckoutPage = new CheckoutPage(this.page);
        const shippingAddressComponent: ShippingAddressComponent = checkoutPage.shippingAddressComponent();
        await shippingAddressComponent.clickOnContinueButton();
    }

    public async selectShippingMethod(): Promise<void> {
        /**
        * 1. Ramdomly select a method: Math.floor(Math.random()* sizeOfInterableData) -> in-range index
        * Ex:
        * const randomIndex = Math.floor(Math.random() * myArray.length)
        * console.log(randomIndex)
        * console.log(myArray[randomIndex])
        */
        const checkoutPage: CheckoutPage = new CheckoutPage(this.page);
        const shippingMethodComponent: ShippingMethodComponent = checkoutPage.shippingMethodComponent();

        await shippingMethodComponent.clickOnContinueButton();

    }

    private extractAdditionalPrice(fullText: string): number {

        const regex = /\+\d+\.\d+/g;
        const matches = fullText.match(regex);
        if (matches) {
            return Number(matches[0].replace('+', ''));
        }
        return 0;
    }
}