import { expect, test } from '../../fixtures/test.fixture';
import { products } from '../../test-data/products';

const product = products.backpack;

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ page, authenticatedApp }) => {
    await authenticatedApp.inventoryPage.addProductToCart(product.name);
    await authenticatedApp.inventoryPage.openCart();

    await expect(page).toHaveURL(/\/cart\.html$/);
  });

  test(
    'added product appears in the cart',
    { tag: '@smoke' },
    async ({ authenticatedApp }) => {
      const { cartPage } = authenticatedApp;
      const cartProduct = cartPage.productByName(product.name);

      await expect(cartPage.title).toHaveText('Your Cart');
      await expect(cartProduct).toHaveCount(1);
      await expect(cartPage.cartItems).toHaveCount(1);
      await expect(cartProduct.getByTestId('inventory-item-price')).toHaveText(
        `$${product.price.toFixed(2)}`,
      );
    },
  );

  test(
    'user can remove a product from the cart',
    { tag: '@regression' },
    async ({ authenticatedApp }) => {
      const { cartPage } = authenticatedApp;

      await cartPage.removeProduct(product.name);

      await expect(cartPage.productByName(product.name)).toHaveCount(0);
      await expect(cartPage.cartItems).toHaveCount(0);
    },
  );
});
