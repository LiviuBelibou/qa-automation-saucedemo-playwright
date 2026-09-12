import { expect, test } from '../../fixtures/test.fixture';
import { inventoryProductCount } from '../../test-data/products';
import { users } from '../../test-data/users';

test.describe('Login', () => {
  test(
    'standard user can log in successfully',
    { tag: '@smoke' },
    async ({ page, app }) => {
      await app.loginPage.goto();
      await app.loginPage.login(
        users.standard.username,
        users.standard.password,
      );

      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(app.inventoryPage.title).toHaveText('Products');
      await expect(app.inventoryPage.inventoryItems).toHaveCount(
        inventoryProductCount,
      );
    },
  );

  test(
    'locked-out user cannot log in',
    { tag: '@negative' },
    async ({ page, app }) => {
      await app.loginPage.goto();
      await app.loginPage.login(
        users.lockedOut.username,
        users.lockedOut.password,
      );

      await expect(app.loginPage.errorMessage).toHaveText(
        'Epic sadface: Sorry, this user has been locked out.',
      );
      await expect(app.loginPage.loginButton).toBeVisible();
      await expect(page).toHaveURL('/');
    },
  );
});
