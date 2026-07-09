const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { InventoryPage } = require('../../../pages/InventoryPage');
const { InventoryItemPage } = require('../../../pages/InventoryItemPage');
const { CartPage } = require('../../../pages/CartPage');
const { CheckoutInformationPage } = require('../../../pages/CheckoutInformationPage');
const { JourneyReporter } = require('../../../utils/journeyReporter');

const userData = require('../../../data/users.json');
const productCatalogueData = require('../../../data/productCatalogueStandardData.json');
const checkoutValidationData = require('../../../data/checkoutValidationData.json');

test.describe('Checkout Validation Journey - Error Handling Assessment', () => {
  const profile = userData.profiles.find((user) => user.username === 'standard_user');

  for (const scenario of checkoutValidationData.scenarios) {
    test(`Checkout validation - ${scenario.name}`, async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const inventoryItemPage = new InventoryItemPage(page);
      const cartPage = new CartPage(page);
      const checkoutInformationPage = new CheckoutInformationPage(page);
      const reporter = new JourneyReporter('Checkout Validation Journey', profile);

      await test.step('Login', async () => {
        await loginPage.goto();
        await loginPage.login(profile.username, userData.password);
      });

      await test.step('Add one product to cart from product details page', async () => {
        const product = productCatalogueData.items[0];

        await inventoryPage.assertInventoryPageLoaded();
        await inventoryPage.openProduct(product.name);
        await inventoryItemPage.assertInventoryItemPageLoaded();
        await inventoryItemPage.assertItemMatchesExpectedData(product);
        await inventoryItemPage.addToCart();
        await inventoryItemPage.assertRemoveButtonDisplayed();
        await inventoryPage.assertCartBadgeCount(1);

        reporter.recordStep('Add product to cart', 'PASSED', `${product.name} added to cart`);
      });

      await test.step('Open checkout information page', async () => {
        await inventoryPage.openCart();
        await cartPage.assertCartPageLoaded();
        await cartPage.assertCheckoutButtonVisible();
        await cartPage.clickCheckout();
        await checkoutInformationPage.assertCheckoutInformationPageLoaded();

        reporter.recordStep('Checkout information page', 'PASSED', 'Checkout form opened');
      });

      await test.step(`Validate error message for ${scenario.name}`, async () => {
        await checkoutInformationPage.completeCheckoutInformation(scenario.customer);

        const actualError = await checkoutInformationPage.getErrorMessage();

        expect(actualError).toBe(scenario.expectedError);

        reporter.recordStep(
          `Validation error - ${scenario.name}`,
          'PASSED',
          `Expected validation error displayed: ${scenario.expectedError}`
        );
      });

      await testInfo.attach('checkout-validation-observation', {
        body: JSON.stringify(reporter.getSummary(), null, 2),
        contentType: 'application/json'
      });
    });
  }
});