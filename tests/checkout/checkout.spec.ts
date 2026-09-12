import { expect, test } from '../../fixtures/test.fixture';
import { checkoutData } from '../../test-data/checkout-data';
import { products } from '../../test-data/products';

const product = products.backpack;

test.describe('Checkout', () => {
  test.beforeEach(async ({ page, authenticatedApp }) => {
    await authenticatedApp.inventoryPage.addProductToCart(product.name);
    await authenticatedApp.inventoryPage.openCart();
    await authenticatedApp.cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });

  test(
    'user can complete an order',
    { tag: ['@smoke', '@e2e'] },
    async ({ page, authenticatedApp }) => {
      const { checkoutPage } = authenticatedApp;

      await checkoutPage.enterCustomerInformation(checkoutData.validCustomer);
      await checkoutPage.continueCheckout();

      await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
      await expect(checkoutPage.title).toHaveText('Checkout: Overview');

      const checkoutProduct = checkoutPage.productByName(product.name);

      await expect(checkoutProduct).toHaveCount(1);
      await expect(
        checkoutProduct.getByTestId('inventory-item-price'),
      ).toHaveText(`$${product.price.toFixed(2)}`);

      const orderSummary = await checkoutPage.getOrderSummary();

      expect(orderSummary.subtotal).toBe(product.price);
      expect(orderSummary.tax).toBeGreaterThanOrEqual(0);
      expect(orderSummary.total).toBeCloseTo(
        orderSummary.subtotal + orderSummary.tax,
        2,
      );

      await checkoutPage.finishCheckout();

      await expect(page).toHaveURL(/\/checkout-complete\.html$/);
      await expect(checkoutPage.title).toHaveText('Checkout: Complete!');
      await expect(checkoutPage.completeHeader).toHaveText(
        'Thank you for your order!',
      );
    },
  );

  test(
    'postal code is required',
    { tag: '@negative' },
    async ({ page, authenticatedApp }) => {
      const { checkoutPage } = authenticatedApp;

      await checkoutPage.enterCustomerInformation({
        ...checkoutData.validCustomer,
        postalCode: '',
      });
      await checkoutPage.continueCheckout();

      await expect(checkoutPage.errorMessage).toHaveText(
        'Error: Postal Code is required',
      );
      await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    },
  );
});
