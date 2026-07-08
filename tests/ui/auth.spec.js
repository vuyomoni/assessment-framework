const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');
const { users } = require('../../data/users');

test.describe('UI | Authentication', () => {
  const successfulUsers = [
    users.standard,
    users.problem,
    users.error,
    users.visual
  ];

  for (const user of successfulUsers) {
    test(`${user.username} can login successfully`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.goto();
      await loginPage.loginAs(user);

      await expect(page).toHaveURL(/inventory.html/);
      await expect(inventoryPage.title).toHaveText('Products');
    });
  }

  test('locked_out_user receives clear authentication error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginAs(users.lockedOut);

    await expect(loginPage.errorMessage).toHaveText(users.lockedOut.expectedError);
  });

  test('performance_glitch_user can login with controlled timeout', async ({ page }) => {
    test.setTimeout(60_000);
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.loginAs(users.performanceGlitch);

    await expect(inventoryPage.title).toHaveText('Products', { timeout: 30_000 });
  });
});
