const { expect } = require('@playwright/test');

class InventoryItemPage {
  constructor(page) {
    this.page = page;

    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemDescription = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.itemImage = page.locator('.inventory_details_img');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async assertInventoryItemPageLoaded() {
    await expect(this.page).toHaveURL(/inventory-item.html/);
    await expect(this.itemName).toBeVisible();
    await expect(this.itemDescription).toBeVisible();
    await expect(this.itemPrice).toBeVisible();
    await expect(this.itemImage).toBeVisible();
  }

  async assertItemMatchesExpectedData(expectedItem) {
    await expect(this.itemName).toHaveText(expectedItem.name);
    await expect(this.itemDescription).toHaveText(expectedItem.description);
    await expect(this.itemPrice).toHaveText(expectedItem.price);

    const imageSrc = await this.itemImage.getAttribute('src');

    expect(
      imageSrc,
      `Image mismatch for '${expectedItem.name}'. Expected src to include '${expectedItem.imageSrcIncludes}', but got '${imageSrc}'`
    ).toContain(expectedItem.imageSrcIncludes);
  }

  async clickBackToProducts() {
    await this.backToProductsButton.click();
  }
}

module.exports = { InventoryItemPage };