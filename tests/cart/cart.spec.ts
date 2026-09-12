import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/cart.page';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';
import { users } from '../../test-data/users';

const productName = 'Sauce Labs Backpack';

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.addProductToCart(productName);
    await inventoryPage.openCart();

    await expect(page).toHaveURL(/\/cart\.html$/);
  });

  test(
    'added product appears in the cart',
    { tag: '@smoke' },
    async ({ page }) => {
      const cartPage = new CartPage(page);

      await expect(cartPage.title).toHaveText('Your Cart');
      await expect(cartPage.productByName(productName)).toHaveCount(1);
      await expect(cartPage.cartItems).toHaveCount(1);
    },
  );

  test(
    'user can remove a product from the cart',
    { tag: '@regression' },
    async ({ page }) => {
      const cartPage = new CartPage(page);

      await cartPage.removeProduct(productName);

      await expect(cartPage.productByName(productName)).toHaveCount(0);
      await expect(cartPage.cartItems).toHaveCount(0);
    },
  );
});
