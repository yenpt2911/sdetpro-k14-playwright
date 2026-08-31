import { test, expect, type Locator, type Page } from '@playwright/test';

class HomePage {
  private readonly topMenu: Locator;

  constructor(private readonly page: Page) {
    this.topMenu = page.locator('.top-menu');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/\/$/);
    await expect(this.page.getByRole('heading', { level: 2, name: 'Welcome to our store' })).toBeVisible();
  }

  async openComputers(): Promise<void> {
    await this.topMenu.getByRole('link', { name: 'Computers' }).click();
    await expect(this.page).toHaveURL(/\/computers$/);
    await expect(this.page.getByRole('heading', { level: 1, name: 'Computers' })).toBeVisible();
  }
}

class ComputersPage {
  private readonly categoryGrid: Locator;

  constructor(private readonly page: Page) {
    this.categoryGrid = page.locator('.sub-category-grid');
  }

  async openDesktops(): Promise<void> {
    await this.categoryGrid
      .getByRole('heading', { level: 2, name: 'Desktops' })
      .getByRole('link', { name: 'Desktops' })
      .click();
    await expect(this.page).toHaveURL(/\/desktops$/);
    await expect(this.page.getByRole('heading', { level: 1, name: 'Desktops' })).toBeVisible();
  }
}

class DesktopsPage {
  private readonly firstProductCard: Locator;
  private readonly firstProductLink: Locator;

  constructor(private readonly page: Page) {
    this.firstProductCard = page.locator('.product-grid .item-box').first();
    this.firstProductLink = this.firstProductCard
      .getByRole('heading', { level: 2 })
      .getByRole('link');
  }

  async openFirstProduct(): Promise<string> {
    await expect(this.firstProductCard).toBeVisible();
    await expect(this.firstProductLink).toHaveText(/\S+/);

    const productName = (await this.firstProductLink.textContent())?.trim() ?? '';
    await this.firstProductLink.click();

    await expect(this.page.getByRole('heading', { level: 1, name: productName })).toBeVisible();
    return productName;
  }
}

class ProductDetailsPage {
  private readonly productSection: Locator;
  private readonly successNotification: Locator;

  constructor(private readonly page: Page) {
    this.productSection = page.locator('.product-essential');
    this.successNotification = page.locator('.bar-notification.success');
  }

  async addToCart(): Promise<void> {
    await expect(this.productSection).toBeVisible();
    await this.productSection.getByRole('button', { name: 'Add to cart' }).click();
    await expect(this.successNotification).toContainText('The product has been added to your shopping cart');
  }

  async openShoppingCartFromNotification(): Promise<void> {
    await this.successNotification.getByRole('link', { name: 'shopping cart' }).click();
    await expect(this.page).toHaveURL(/\/cart$/);
  }
}

class ShoppingCartPage {
  private readonly cartRows: Locator;

  constructor(private readonly page: Page) {
    this.cartRows = page.locator('.cart-item-row');
  }

  async verifyProductInCart(productName: string): Promise<void> {
    await expect(this.page.getByRole('heading', { level: 1, name: 'Shopping cart' })).toBeVisible();
    await expect(this.cartRows).toHaveCount(1);
    await expect(this.page.getByRole('link', { name: productName })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Shopping cart (1)' })).toBeVisible();
    await expect(this.page.locator('input.qty-input')).toHaveValue('1');
  }
}

test('adds the first desktop product to the shopping cart from Computers > Desktops', async ({ page }) => {
  const homePage = new HomePage(page);
  const computersPage = new ComputersPage(page);
  const desktopsPage = new DesktopsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const shoppingCartPage = new ShoppingCartPage(page);

  await homePage.goto();
  await homePage.openComputers();
  await computersPage.openDesktops();

  const productName = await desktopsPage.openFirstProduct();

  await productDetailsPage.addToCart();
  await productDetailsPage.openShoppingCartFromNotification();

  await shoppingCartPage.verifyProductInCart(productName);
});