const { expect } = require('@playwright/test');

class CheckoutCompletePage {
  constructor(page) {
    this.page = page;

    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async assertCheckoutCompletePageLoaded() {
    await expect(this.page).toHaveURL(/checkout-complete.html/);
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeText).toBeVisible();
    await expect(this.backHomeButton).toBeVisible();
  }

  async assertConfirmationMessage(expectedConfirmation) {
    await expect(this.completeHeader).toHaveText(expectedConfirmation.header);
    await expect(this.completeText).toHaveText(expectedConfirmation.message);
  }

  async clickBackHome() {
    await this.backHomeButton.click();
  }
}

module.exports = { CheckoutCompletePage };
