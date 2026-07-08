const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const { users } = require('../../data/users');
const { checkoutCustomer } = require('../../data/checkoutData');

test.describe('UI | Checkout Process', () => {
  test('standard user can complete full checkout journey', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.loginAs(users.standard);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(2);

    await cartPage.checkout();
    await checkoutPage.enterCustomerInformation(checkoutCustomer);

    await expect(checkoutPage.summaryTotal).toContainText('Total: $');

    await checkoutPage.finishCheckout();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});
