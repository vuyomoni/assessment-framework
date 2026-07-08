const { test } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { InventoryPage } = require('../../../pages/InventoryPage');
const { JourneyReporter } = require('../../../utils/journeyReporter');
const userData = require('../../../data/users.json');

test.describe('Add All Inventory Items To Cart Journey - Golden Path Behaviour Assessment', () => {
  for (const profile of userData.profiles) {
    test(`Add all inventory items to cart golden path check for ${profile.username}`, async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const reporter = new JourneyReporter('Add All Inventory Items To Cart Journey', profile);

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

          await testInfo.attach('add-all-items-cart-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Add all items cart journey failed for ${profile.username} at Authentication. ` +
            `Observation: ${errorMessage || 'User did not reach inventory page'}`
          );
        }

        reporter.recordStep(
          'Authentication',
          'PASSED',
          'User authenticated and reached inventory page'
        );
      });

      await test.step('Validate inventory page loads', async () => {
        try {
          await inventoryPage.assertInventoryPageLoaded();

          reporter.recordStep(
            'Inventory page load',
            'PASSED',
            'Inventory page loaded successfully'
          );
        } catch (error) {
          reporter.recordStep('Inventory page load', 'FAILED', error.message);

          await testInfo.attach('add-all-items-cart-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Add all items cart journey failed for ${profile.username} at Inventory page load. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await test.step('Validate 6 products are displayed', async () => {
        try {
          await inventoryPage.assertProductCount(6);

          reporter.recordStep(
            'Product count validation',
            'PASSED',
            'Expected 6 products displayed'
          );
        } catch (error) {
          reporter.recordStep('Product count validation', 'FAILED', error.message);

          await testInfo.attach('add-all-items-cart-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Add all items cart journey failed for ${profile.username} at Product count validation. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await test.step('Add all products and validate button state and cart badge', async () => {
        try {
          await inventoryPage.addAllProductsToCartAndValidateButtons();
          await inventoryPage.assertCartBadgeCount(6);

          reporter.recordStep(
            'Add all products to cart',
            'PASSED',
            'All product buttons changed to Remove and cart badge reached 6'
          );
        } catch (error) {
          reporter.recordStep('Add all products to cart', 'FAILED', error.message);

          await testInfo.attach('add-all-items-cart-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Add all items cart journey failed for ${profile.username} at Add all products to cart. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await testInfo.attach('add-all-items-cart-observation', {
        body: JSON.stringify(reporter.getSummary(), null, 2),
        contentType: 'application/json'
      });
    });
  }
});