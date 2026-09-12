import { type Locator, type Page } from '@playwright/test';

export interface CustomerInformation {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface OrderSummary {
  subtotal: number;
  tax: number;
  total: number;
}

export class CheckoutPage {
  readonly page: Page;
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;
  readonly checkoutItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
    this.checkoutItems = page.getByTestId('inventory-item');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
  }

  productByName(productName: string): Locator {
    return this.checkoutItems.filter({ hasText: productName });
  }

  async enterCustomerInformation(customer: CustomerInformation): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
  }

  async continueCheckout(): Promise<void> {
    await this.continueButton.click();
  }

  async getOrderSummary(): Promise<OrderSummary> {
    const [subtotalText, taxText, totalText] = await Promise.all([
      this.subtotalLabel.innerText(),
      this.taxLabel.innerText(),
      this.totalLabel.innerText(),
    ]);

    return {
      subtotal: this.extractCurrency(subtotalText),
      tax: this.extractCurrency(taxText),
      total: this.extractCurrency(totalText),
    };
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }

  private extractCurrency(text: string): number {
    const value = text.match(/\$(\d+\.\d{2})/)?.[1];

    if (!value) {
      throw new Error(`Could not extract a currency value from: "${text}"`);
    }

    return Number.parseFloat(value);
  }
}
