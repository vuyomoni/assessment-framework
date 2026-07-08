const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');
const { users } = require('../../data/users');

test.describe('UI | Inventory Management', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(users.standard);
  });

  test('standard user can view product inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
    await expect(page.locator('[data-test="inventory-item-name"]').first()).toBeVisible();
  });

  test('standard user can sort inventory by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('lohi');

    const prices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    const numericPrices = prices.map(price => Number(price.replace('$', '')));
    const sortedPrices = [...numericPrices].sort((a, b) => a - b);

    expect(numericPrices).toEqual(sortedPrices);
  });
});
