const { test } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { InventoryPage } = require('../../../pages/InventoryPage');
const { InventoryItemPage } = require('../../../pages/InventoryItemPage');
const { JourneyReporter } = require('../../../utils/journeyReporter');
const userData = require('../../../data/users.json');
const productCatalogueData = require('../../../data/productCatalogueStandardData.json');

test.describe('Product Details Navigation Journey - Golden Path Behaviour Assessment', () => {
  for (const profile of userData.profiles) {
    test(`Product details navigation check for ${profile.username}`, async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const inventoryItemPage = new InventoryItemPage(page);
      const reporter = new JourneyReporter('Product Details Navigation Journey', profile);

      await test.step('Login', async () => {
        await loginPage.goto();
        await loginPage.login(profile.username, userData.password);

        const isInventoryDisplayed = await loginPage.isInventoryDisplayed();
        const errorMessage = await loginPage.getErrorMessage();

        if (!isInventoryDisplayed) {
          reporter.recordStep('Authentication', 'FAILED', errorMessage || 'User did not reach inventory page');

          await testInfo.attach('product-details-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Product details journey failed for ${profile.username} at Authentication. ` +
            `Observation: ${errorMessage || 'User did not reach inventory page'}`
          );
        }

        reporter.recordStep('Authentication', 'PASSED', 'User authenticated and reached inventory page');
      });

      await test.step('Validate inventory page loads', async () => {
        try {
          await inventoryPage.assertInventoryPageLoaded();
          await inventoryPage.assertProductCount(productCatalogueData.items.length);

          reporter.recordStep(
            'Inventory page load',
            'PASSED',
            'Inventory page loaded and expected product count displayed'
          );
        } catch (error) {
          reporter.recordStep('Inventory page load', 'FAILED', error.message);

          await testInfo.attach('product-details-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Product details journey failed for ${profile.username} at Inventory page load. ` +
            `Observation: ${error.message}`
          );
        }
      });

      for (const expectedItem of productCatalogueData.items) {
        await test.step(`Open and validate product details for ${expectedItem.name}`, async () => {
          try {
            await inventoryPage.openProduct(expectedItem.name);

            await inventoryItemPage.assertInventoryItemPageLoaded();
            await inventoryItemPage.assertItemMatchesExpectedData(expectedItem);

            reporter.recordStep(
              `Product details validation - ${expectedItem.name}`,
              'PASSED',
              'Product details page matched expected catalogue data'
            );

            await inventoryItemPage.clickBackToProducts();
            await inventoryPage.assertInventoryPageLoaded();
          } catch (error) {
            reporter.recordStep(
              `Product details validation - ${expectedItem.name}`,
              'FAILED',
              error.message
            );

            await testInfo.attach('product-details-observation', {
              body: JSON.stringify(reporter.getSummary(), null, 2),
              contentType: 'application/json'
            });

            throw new Error(
              `Product details journey failed for ${profile.username} while validating '${expectedItem.name}'. ` +
              `Observation: ${error.message}`
            );
          }
        });
      }

      await testInfo.attach('product-details-observation', {
        body: JSON.stringify(reporter.getSummary(), null, 2),
        contentType: 'application/json'
      });
    });
  }
});