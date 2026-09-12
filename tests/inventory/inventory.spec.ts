import { expect, test } from '@playwright/test';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';
import { users } from '../../test-data/users';

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test(
    'user can add a product to the cart',
    { tag: '@smoke' },
    async ({ page }) => {
      const inventoryPage = new InventoryPage(page);
      const productName = 'Sauce Labs Backpack';

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
    async ({ page }) => {
      const inventoryPage = new InventoryPage(page);

      await inventoryPage.sortProductsBy('lohi');

      const actualPrices = await inventoryPage.getProductPrices();
      const expectedPrices = [...actualPrices].sort(
        (first, second) => first - second,
      );

      expect(actualPrices).toEqual(expectedPrices);
    },
  );
});
