const { test } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { InventoryPage } = require('../../../pages/InventoryPage');
const { JourneyReporter } = require('../../../utils/journeyReporter');

const userData = require('../../../data/users.json');
const sortData = require('../../../data/productCatalogueSortData.json');

test.describe('Inventory Sorting Journey - Golden Path Behaviour Assessment', () => {
  for (const profile of userData.profiles) {
    test(`Inventory sorting check for ${profile.username}`, async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const reporter = new JourneyReporter('Inventory Sorting Journey', profile);

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

          await testInfo.attach('inventory-sorting-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Inventory sorting journey failed for ${profile.username} at Authentication. ` +
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
          await inventoryPage.assertProductCount(6);

          reporter.recordStep(
            'Inventory page load',
            'PASSED',
            'Inventory page loaded and 6 products displayed'
          );
        } catch (error) {
          reporter.recordStep('Inventory page load', 'FAILED', error.message);

          await testInfo.attach('inventory-sorting-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Inventory sorting journey failed for ${profile.username} at Inventory page load. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await test.step('Validate Name A to Z sorting', async () => {
        try {
          await inventoryPage.sortBy('az');
          await inventoryPage.assertProductNamesOrder(sortData.nameAscending);

          reporter.recordStep(
            'Name A to Z sorting',
            'PASSED',
            'Products sorted correctly by name ascending'
          );
        } catch (error) {
          reporter.recordStep('Name A to Z sorting', 'FAILED', error.message);

          await testInfo.attach('inventory-sorting-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Inventory sorting journey failed for ${profile.username} at Name A to Z sorting. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await test.step('Validate Name Z to A sorting', async () => {
        try {
          await inventoryPage.sortBy('za');
          await inventoryPage.assertProductNamesOrder(sortData.nameDescending);

          reporter.recordStep(
            'Name Z to A sorting',
            'PASSED',
            'Products sorted correctly by name descending'
          );
        } catch (error) {
          reporter.recordStep('Name Z to A sorting', 'FAILED', error.message);

          await testInfo.attach('inventory-sorting-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Inventory sorting journey failed for ${profile.username} at Name Z to A sorting. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await test.step('Validate Price Low to High sorting', async () => {
        try {
          await inventoryPage.sortBy('lohi');
          await inventoryPage.assertProductPricesOrder(sortData.priceLowHigh);

          reporter.recordStep(
            'Price Low to High sorting',
            'PASSED',
            'Products sorted correctly by price ascending'
          );
        } catch (error) {
          reporter.recordStep('Price Low to High sorting', 'FAILED', error.message);

          await testInfo.attach('inventory-sorting-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Inventory sorting journey failed for ${profile.username} at Price Low to High sorting. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await test.step('Validate Price High to Low sorting', async () => {
        try {
          await inventoryPage.sortBy('hilo');
          await inventoryPage.assertProductPricesOrder(sortData.priceHighLow);

          reporter.recordStep(
            'Price High to Low sorting',
            'PASSED',
            'Products sorted correctly by price descending'
          );
        } catch (error) {
          reporter.recordStep('Price High to Low sorting', 'FAILED', error.message);

          await testInfo.attach('inventory-sorting-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Inventory sorting journey failed for ${profile.username} at Price High to Low sorting. ` +
            `Observation: ${error.message}`
          );
        }
      });

      await testInfo.attach('inventory-sorting-observation', {
        body: JSON.stringify(reporter.getSummary(), null, 2),
        contentType: 'application/json'
      });
    });
  }
});