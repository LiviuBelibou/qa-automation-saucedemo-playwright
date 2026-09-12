import { expect, test as base } from '@playwright/test';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';
import { users } from '../test-data/users';

type ApplicationPages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

type ApplicationFixtures = {
  app: ApplicationPages;
  authenticatedApp: ApplicationPages;
};

export const test = base.extend<ApplicationFixtures>({
  app: async ({ page }, use) => {
    await use({
      loginPage: new LoginPage(page),
      inventoryPage: new InventoryPage(page),
      cartPage: new CartPage(page),
      checkoutPage: new CheckoutPage(page),
    });
  },

  authenticatedApp: async ({ page, app }, use) => {
    await app.loginPage.goto();
    await app.loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/\/inventory\.html$/);

    await use(app);
  },
});

export { expect };
