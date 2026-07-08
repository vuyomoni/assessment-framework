const { test } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { InventoryPage } = require('../../../pages/InventoryPage');
const { JourneyReporter } = require('../../../utils/journeyReporter');
const userData = require('../../../data/users.json');
const standardItemsData = require('../../../data/productCatalogueStandardData.json');

test.describe('Product  Integrity Journey - Golden Path Behaviour Assessment', () => {
  for (const profile of userData.profiles) {
    test(`Standard items integrity check for ${profile.username}`, async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const reporter = new JourneyReporter('Product Catalogue Integrity Journey', profile);

      await test.step('Login', async () => {
        await loginPage.goto();
        await loginPage.login(profile.username, userData.password);

        const isInventoryDisplayed = await loginPage.isInventoryDisplayed();
        const errorMessage = await loginPage.getErrorMessage();

        if (!isInventoryDisplayed) {
          reporter.recordStep('Authentication', 'FAILED', errorMessage || 'User did not reach inventory page');

          await testInfo.attach('standard-items-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Product Catalogue items journey failed for ${profile.username} at Authentication. ` +
            `Observation: ${errorMessage || 'User did not reach inventory page'}`
          );
        }

        reporter.recordStep('Authentication', 'PASSED', 'User authenticated and reached inventory page');
      });

      await test.step('Validate inventory page loads', async () => {
        try {
          await inventoryPage.assertInventoryPageLoaded();
          reporter.recordStep('Inventory page load', 'PASSED', 'Inventory page loaded successfully');
        } catch (error) {
          reporter.recordStep('Inventory page load', 'FAILED', error.message);

          await testInfo.attach('standard-items-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Product Catalogue items journey failed for ${profile.username} at Inventory page load. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await test.step('Validate all inventory items match standard data', async () => {
        try {
          await inventoryPage.assertInventoryMatchesStandardItems(standardItemsData.items);

          reporter.recordStep(
            'Product Catalogue validation',
            'PASSED',
            'All product names, descriptions, prices and images match standard data'
          );
        } catch (error) {
          reporter.recordStep('Product Catalogue  validation', 'FAILED', error.message);

          await testInfo.attach('product-catalogue-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Product Catalogue journey failed for ${profile.username} at Product Catalogue validation. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await testInfo.attach('Product-Catalogue-observation', {
        body: JSON.stringify(reporter.getSummary(), null, 2),
        contentType: 'application/json'
      });
    });
  }
});