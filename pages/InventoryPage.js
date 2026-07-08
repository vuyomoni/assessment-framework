const { expect } = require('@playwright/test');

class InventoryPage {
  constructor(page) {
    this.page = page;

    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.productSort = page.locator('[data-test="product-sort-container"]');

    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async assertInventoryPageLoaded() {
    await expect(this.page).toHaveURL(/inventory.html/);
    await expect(this.inventoryContainer).toBeVisible();
  }

  async assertProductCount(expectedCount = 6) {
    await expect(this.inventoryItems).toHaveCount(expectedCount);
  }

  async assertEachProductHasRequiredDetails() {
    const count = await this.inventoryItems.count();

    for (let i = 0; i < count; i++) {
      const item = this.inventoryItems.nth(i);

      await expect(item.locator('.inventory_item_img img')).toBeVisible();
      await expect(item.locator('[data-test="inventory-item-name"]')).toBeVisible();
      await expect(item.locator('[data-test="inventory-item-desc"]')).toBeVisible();
      await expect(item.locator('[data-test="inventory-item-price"]')).toBeVisible();
      await expect(item.locator('button')).toBeVisible();
    }
  }

  async sortBy(optionValue) {
    await this.productSort.selectOption(optionValue);
  }

  async getDisplayedProductNames() {
    return this.page.locator('[data-test="inventory-item-name"]').allInnerTexts();
  }

  async getDisplayedProductPrices() {
    return this.page.locator('[data-test="inventory-item-price"]').allInnerTexts();
  }

  async assertProductNamesOrder(expectedNames) {
    const actualNames = await this.getDisplayedProductNames();
    expect(actualNames).toEqual(expectedNames);
  }

  async assertProductPricesOrder(expectedPrices) {
    const actualPrices = await this.getDisplayedProductPrices();
    expect(actualPrices).toEqual(expectedPrices);
  }

  async getFirstProductName() {
    return this.page.locator('[data-test="inventory-item-name"]').first().innerText();
  }

  async addProductToCart(productName) {
    const product = this.inventoryItems.filter({
      hasText: productName
    });

    await product.locator('button').click();
  }

  async assertCartBadgeCount(expectedCount) {
    await expect(this.cartBadge).toHaveText(String(expectedCount));
  }

  async addAllProductsToCartAndValidateButtons() {
    const productCount = await this.inventoryItems.count();

    for (let i = 0; i < productCount; i++) {
      const item = this.inventoryItems.nth(i);
      const productName = await item.locator('[data-test="inventory-item-name"]').innerText();
      const button = item.locator('button');

      await expect(button, `Add button should be visible for ${productName}`).toBeVisible();
      await expect(button, `Button should show Add to cart for ${productName}`).toHaveText('Add to cart');

      await button.click();

      await expect(
        button,
        `Button did not change to Remove after adding ${productName}`
      ).toHaveText('Remove');

      await expect(
        this.cartBadge,
        `Cart badge did not update correctly after adding ${productName}`
      ).toHaveText(String(i + 1));
    }
  }

  async assertInventoryMatchesStandardItems(expectedItems) {
    await expect(this.inventoryItems).toHaveCount(expectedItems.length);

    for (const expectedItem of expectedItems) {
      const item = this.inventoryItems.filter({
        has: this.page.locator('[data-test="inventory-item-name"]', {
          hasText: expectedItem.name
        })
      });

      await expect(item, `Expected product '${expectedItem.name}' to be displayed`).toHaveCount(1);
      await expect(item.locator('[data-test="inventory-item-name"]')).toHaveText(expectedItem.name);
      await expect(item.locator('[data-test="inventory-item-desc"]')).toHaveText(expectedItem.description);
      await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText(expectedItem.price);
      await expect(item.locator('.inventory_item_img img')).toBeVisible();

      const imageSrc = await item.locator('.inventory_item_img img').getAttribute('src');

      expect(
        imageSrc,
        `Image mismatch for '${expectedItem.name}'. Expected src to include '${expectedItem.imageSrcIncludes}', but got '${imageSrc}'`
      ).toContain(expectedItem.imageSrcIncludes);
    }
  }

  async openProduct(productName) {
    const product = this.inventoryItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', {
        hasText: productName
      })
    });

    await expect(product, `Expected product '${productName}' to exist before opening details`).toHaveCount(1);
    await product.locator('[data-test="inventory-item-name"]').click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };