import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';
import { checkoutData } from '../../test-data/checkout-data';
import { users } from '../../test-data/users';

const productName = 'Sauce Labs Backpack';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.addProductToCart(productName);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });

  test(
    'user can complete an order',
    { tag: ['@smoke', '@e2e'] },
    async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);

      await checkoutPage.enterCustomerInformation(checkoutData.validCustomer);
      await checkoutPage.continueCheckout();

      await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
      await expect(checkoutPage.title).toHaveText('Checkout: Overview');
      await expect(checkoutPage.subtotalLabel).toBeVisible();
      await expect(checkoutPage.taxLabel).toBeVisible();
      await expect(checkoutPage.totalLabel).toBeVisible();

      await checkoutPage.finishCheckout();

      await expect(page).toHaveURL(/\/checkout-complete\.html$/);
      await expect(checkoutPage.title).toHaveText('Checkout: Complete!');
      await expect(checkoutPage.completeHeader).toHaveText(
        'Thank you for your order!',
      );
    },
  );

  test('postal code is required', { tag: '@negative' }, async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.enterCustomerInformation({
      ...checkoutData.validCustomer,
      postalCode: '',
    });
    await checkoutPage.continueCheckout();

    await expect(checkoutPage.errorMessage).toHaveText(
      'Error: Postal Code is required',
    );
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });
});
