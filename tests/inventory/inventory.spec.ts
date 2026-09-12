import { expect, test } from '../../fixtures/test.fixture';
import { inventoryProductCount, products } from '../../test-data/products';

test.describe('Inventory', () => {
  test(
    'user can add a product to the cart',
    { tag: '@smoke' },
    async ({ authenticatedApp }) => {
      const { inventoryPage } = authenticatedApp;
      const productName = products.backpack.name;

      await inventoryPage.addProductToCart(productName);

      await expect(inventoryPage.cartBadge).toHaveText('1');
      await expect(
        inventoryPage
          .productByName(productName)
          .getByRole('button', { name: 'Remove' }),
      ).toBeVisible();
    },
  );

  test(
    'user can sort products by price from low to high',
    { tag: '@regression' },
    async ({ authenticatedApp }) => {
      const { inventoryPage } = authenticatedApp;

      await expect(inventoryPage.productPrices).toHaveCount(
        inventoryProductCount,
      );

      await inventoryPage.sortProductsBy('lohi');

      await expect(inventoryPage.sortDropdown).toHaveValue('lohi');

      const actualPrices = await inventoryPage.getProductPrices();
      const expectedPrices = [...actualPrices].sort(
        (first, second) => first - second,
      );

      expect(actualPrices).toHaveLength(inventoryProductCount);
      expect(actualPrices).toEqual(expectedPrices);
    },
  );
});
