import { expect, test } from '@playwright/test';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';
import { users } from '../../test-data/users';

test.describe('Login', () => {
  test(
    'standard user can log in successfully',
    { tag: '@smoke' },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.goto();
      await loginPage.login(
        users.standard.username,
        users.standard.password,
      );

      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.title).toHaveText('Products');
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    },
  );

  test(
    'locked-out user cannot log in',
    { tag: '@negative' },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login(
        users.lockedOut.username,
        users.lockedOut.password,
      );

      await expect(loginPage.errorMessage).toHaveText(
        'Epic sadface: Sorry, this user has been locked out.',
      );
      await expect(loginPage.loginButton).toBeVisible();
    },
  );
});