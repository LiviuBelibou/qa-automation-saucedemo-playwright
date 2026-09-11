import { type Locator, type Page } from '@playwright/test';

export type ProductSortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly productPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  productByName(productName: string): Locator {
    return this.inventoryItems.filter({ hasText: productName });
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.productByName(productName)
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async sortProductsBy(option: ProductSortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.productPrices.allTextContents();

    return priceTexts.map((price) =>
      Number.parseFloat(price.replace('$', '')),
    );
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}