class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async addProductToCart(productName) {
    const product = this.inventoryItems.filter({ hasText: productName });
    await product.locator('button').click();
  }

  async removeProductFromCart(productName) {
    const product = this.inventoryItems.filter({ hasText: productName });
    await product.locator('button').click();
  }

  async sortBy(optionValue) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async openCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };
