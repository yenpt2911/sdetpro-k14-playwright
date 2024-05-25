import { Page } from "@playwright/test";

import ProductItemComponent from "../components/ProductItemComponent";
import FooterComponent from "../components/global/footer/FootetComponent";
import HeaderComponent from "../components/global/header/HeaderComponent";
import PageBodyComponent from "../components/PageBodyComponent";
import CartItemRowComponent from "../components/cart/CartItemRowComponent";
import TotalComponent from "../components/cart/TotalComponent";

export default class ShoppingCartPage {

    constructor(private page: Page) {
        this.page = page;
    }

    async cartItemRowComponentList(): Promise<CartItemRowComponent[]> {
        const cartItemRowComponents = await this.page.locator(CartItemRowComponent.selectorValue).all();
        return cartItemRowComponents.map(comp => new CartItemRowComponent(comp));
    }
   
    public totalComponent(): TotalComponent {
        return new TotalComponent(this.page.locator(TotalComponent.selectorValue));
    }
}