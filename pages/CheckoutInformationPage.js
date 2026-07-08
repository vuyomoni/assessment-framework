const { expect } = require('@playwright/test');

class CheckoutInformationPage {
  constructor(page) {
    this.page = page;

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async assertCheckoutInformationPageLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-one.html/);
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
  }

  async completeCheckoutInformation(customer) {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async getErrorMessage() {
    if (await this.errorMessage.isVisible()) {
      return (await this.errorMessage.innerText()).trim();
    }

    return null;
  }
}

module.exports = { CheckoutInformationPage };
