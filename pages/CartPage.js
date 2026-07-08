const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;

    this.cartList = page.locator('[data-test="cart-list"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async assertCartPageLoaded() {
    await expect(this.page).toHaveURL(/cart.html/);
    await expect(this.cartList).toBeVisible();
  }

  async assertCartItemCount(expectedCount) {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async assertProductDisplayed(expectedProduct) {
    const item = this.cartItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', {
        hasText: expectedProduct.name
      })
    });

    await expect(item, `Expected cart item '${expectedProduct.name}' to be displayed`).toHaveCount(1);
    await expect(item.locator('[data-test="inventory-item-name"]')).toHaveText(expectedProduct.name);
    await expect(item.locator('[data-test="inventory-item-desc"]')).toHaveText(expectedProduct.description);
    await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText(expectedProduct.price);
    await expect(item.locator('[data-test^="remove"]')).toBeVisible();
    await expect(item.locator('[data-test^="remove"]')).toHaveText('Remove');
  }

  async assertProductsDisplayed(expectedProducts) {
    await this.assertCartItemCount(expectedProducts.length);

    for (const expectedProduct of expectedProducts) {
      await this.assertProductDisplayed(expectedProduct);
    }
  }

  async assertCheckoutButtonVisible() {
    await expect(this.checkoutButton).toBeVisible();
    await expect(this.checkoutButton).toHaveText('Checkout');
  }

  async assertContinueShoppingButtonVisible() {
    await expect(this.continueShoppingButton).toBeVisible();
    await expect(this.continueShoppingButton).toHaveText('Continue Shopping');
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
