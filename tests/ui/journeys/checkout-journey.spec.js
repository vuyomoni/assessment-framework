const { test } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { InventoryPage } = require('../../../pages/InventoryPage');
const { InventoryItemPage } = require('../../../pages/InventoryItemPage');
const { CartPage } = require('../../../pages/CartPage');
const { CheckoutInformationPage } = require('../../../pages/CheckoutInformationPage');
const { CheckoutOverviewPage } = require('../../../pages/CheckoutOverviewPage');
const { CheckoutCompletePage } = require('../../../pages/CheckoutCompletePage');
const { JourneyReporter } = require('../../../utils/journeyReporter');

const userData = require('../../../data/users.json');
const productCatalogueData = require('../../../data/productCatalogueStandardData.json');
const checkoutData = require('../../../data/checkoutData.json');

test.describe('Checkout Journey - Golden Path Behaviour Assessment', () => {
  for (const profile of userData.profiles) {
    test(`Checkout journey check for ${profile.username}`, async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const inventoryItemPage = new InventoryItemPage(page);
      const cartPage = new CartPage(page);
      const checkoutInformationPage = new CheckoutInformationPage(page);
      const checkoutOverviewPage = new CheckoutOverviewPage(page);
      const checkoutCompletePage = new CheckoutCompletePage(page);
      const reporter = new JourneyReporter('Checkout Journey', profile);

      await test.step('Login', async () => {
        await loginPage.goto();
        await loginPage.login(profile.username, userData.password);

        const isInventoryDisplayed = await loginPage.isInventoryDisplayed();
        const errorMessage = await loginPage.getErrorMessage();

        if (!isInventoryDisplayed) {
          reporter.recordStep(
            'Authentication',
            'FAILED',
            errorMessage || 'User did not reach inventory page'
          );

          await testInfo.attach('checkout-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Checkout journey failed for ${profile.username} at Authentication. ` +
            `Observation: ${errorMessage || 'User did not reach inventory page'}`
          );
        }

        reporter.recordStep(
          'Authentication',
          'PASSED',
          'User authenticated and reached inventory page'
        );
      });

      await test.step('Add all products to cart from product details pages', async () => {
        try {
          await inventoryPage.assertInventoryPageLoaded();
          await inventoryPage.assertProductCount(productCatalogueData.items.length);

          for (let index = 0; index < productCatalogueData.items.length; index++) {
            const expectedItem = productCatalogueData.items[index];

            await inventoryPage.openProduct(expectedItem.name);
            await inventoryItemPage.assertInventoryItemPageLoaded();
            await inventoryItemPage.assertItemMatchesExpectedData(expectedItem);

            await inventoryItemPage.addToCart();
            await inventoryItemPage.assertRemoveButtonDisplayed();

            await inventoryPage.assertCartBadgeCount(index + 1);

            await inventoryItemPage.clickBackToProducts();
            await inventoryPage.assertInventoryPageLoaded();
          }

          reporter.recordStep(
            'Add products to cart',
            'PASSED',
            'All products added from product details pages and cart badge updated correctly'
          );
        } catch (error) {
          reporter.recordStep('Add products to cart', 'FAILED', error.message);

          await testInfo.attach('checkout-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Checkout journey failed for ${profile.username} while adding products to cart. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await test.step('Open cart and validate selected products', async () => {
        try {
          await inventoryPage.openCart();

          await cartPage.assertCartPageLoaded();
          await cartPage.assertProductsDisplayed(productCatalogueData.items);
          await cartPage.assertCheckoutButtonVisible();

          reporter.recordStep(
            'Cart validation',
            'PASSED',
            'Cart contains all selected products and checkout is available'
          );
        } catch (error) {
          reporter.recordStep('Cart validation', 'FAILED', error.message);

          await testInfo.attach('checkout-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Checkout journey failed for ${profile.username} at Cart validation. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await test.step('Complete checkout information', async () => {
        try {
          await cartPage.clickCheckout();

          await checkoutInformationPage.assertCheckoutInformationPageLoaded();
          await checkoutInformationPage.completeCheckoutInformation(checkoutData.customer);

          reporter.recordStep(
            'Checkout information',
            'PASSED',
            'Customer checkout information completed successfully'
          );
        } catch (error) {
          const checkoutError = await checkoutInformationPage.getErrorMessage();

          reporter.recordStep(
            'Checkout information',
            'FAILED',
            checkoutError || error.message
          );

          await testInfo.attach('checkout-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Checkout journey failed for ${profile.username} at Checkout information. ` +
            `Observation: ${checkoutError || error.message}`
          );
        }
      });

      await test.step('Validate checkout overview and finish order', async () => {
        try {
          await checkoutOverviewPage.assertCheckoutOverviewPageLoaded();
          await checkoutOverviewPage.assertProductsDisplayed(productCatalogueData.items);
          await checkoutOverviewPage.assertTotalsMatchProducts(productCatalogueData.items);
          await checkoutOverviewPage.finishCheckout();

          reporter.recordStep(
            'Checkout overview',
            'PASSED',
            'Checkout overview matched cart products and order was submitted'
          );
        } catch (error) {
          reporter.recordStep('Checkout overview', 'FAILED', error.message);

          await testInfo.attach('checkout-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Checkout journey failed for ${profile.username} at Checkout overview. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await test.step('Validate checkout completion', async () => {
        try {
          await checkoutCompletePage.assertCheckoutCompletePageLoaded();
          await checkoutCompletePage.assertConfirmationMessage(checkoutData.confirmation);

          reporter.recordStep(
            'Checkout completion',
            'PASSED',
            'Order confirmation page displayed expected confirmation message'
          );
        } catch (error) {
          reporter.recordStep('Checkout completion', 'FAILED', error.message);

          await testInfo.attach('checkout-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Checkout journey failed for ${profile.username} at Checkout completion. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await testInfo.attach('checkout-observation', {
        body: JSON.stringify(reporter.getSummary(), null, 2),
        contentType: 'application/json'
      });
    });
  }
});
