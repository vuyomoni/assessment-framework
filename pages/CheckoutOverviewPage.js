const { expect } = require('@playwright/test');

class CheckoutOverviewPage {
  constructor(page) {
    this.page = page;

    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async assertCheckoutOverviewPageLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-two.html/);
    await expect(this.cartItems.first()).toBeVisible();
    await expect(this.finishButton).toBeVisible();
  }

  async assertProductDisplayed(expectedProduct) {
    const item = this.cartItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', {
        hasText: expectedProduct.name
      })
    });

    await expect(item, `Expected checkout overview item '${expectedProduct.name}' to be displayed`).toHaveCount(1);
    await expect(item.locator('[data-test="inventory-item-name"]')).toHaveText(expectedProduct.name);
    await expect(item.locator('[data-test="inventory-item-desc"]')).toHaveText(expectedProduct.description);
    await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText(expectedProduct.price);
  }

  async assertProductsDisplayed(expectedProducts) {
    await expect(this.cartItems).toHaveCount(expectedProducts.length);

    for (const expectedProduct of expectedProducts) {
      await this.assertProductDisplayed(expectedProduct);
    }
  }

  async assertTotalsMatchProducts(expectedProducts) {
    const expectedSubtotal = expectedProducts.reduce((sum, item) => {
      return sum + Number(item.price.replace('$', ''));
    }, 0);

    const subtotalText = await this.itemTotal.innerText();
    const taxText = await this.tax.innerText();
    const totalText = await this.total.innerText();

    const actualSubtotal = Number(subtotalText.replace('Item total: $', ''));
    const actualTax = Number(taxText.replace('Tax: $', ''));
    const actualTotal = Number(totalText.replace('Total: $', ''));

    expect(actualSubtotal, 'Checkout item total should match sum of product prices').toBeCloseTo(expectedSubtotal, 2);
    expect(actualTotal, 'Checkout total should equal subtotal plus tax').toBeCloseTo(actualSubtotal + actualTax, 2);
  }

  async finishCheckout() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutOverviewPage };
