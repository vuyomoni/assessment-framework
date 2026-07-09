const { test } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { InventoryPage } = require('../../../pages/InventoryPage');
const { InventoryItemPage } = require('../../../pages/InventoryItemPage');
const { CartPage } = require('../../../pages/CartPage');
const { JourneyReporter } = require('../../../utils/journeyReporter');
test.describe.configure({ timeout: 120000 });
const userData = require('../../../data/users.json');
const productCatalogueData = require('../../../data/productCatalogueStandardData.json');

test.describe('Shopping Cart Journey - Golden Path Behaviour Assessment', () => {
  for (const profile of userData.profiles) {
    test(`Shopping cart journey check for ${profile.username}`, async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const inventoryItemPage = new InventoryItemPage(page);
      const cartPage = new CartPage(page);
      const reporter = new JourneyReporter('Shopping Cart Journey', profile);

      await test.step('Login', async () => {
        await loginPage.goto();
        await loginPage.login(profile.username, userData.password);

        const isInventoryDisplayed = await loginPage.isInventoryDisplayed();
        const errorMessage = await loginPage.getErrorMessage();

        if (!isInventoryDisplayed) {
          reporter.recordStep('Authentication', 'FAILED', errorMessage || 'User did not reach inventory page');

          await testInfo.attach('shopping-cart-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Shopping cart journey failed for ${profile.username} at Authentication. ` +
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

          await testInfo.attach('shopping-cart-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Shopping cart journey failed for ${profile.username} at Inventory page load. ` +
              `Observation: ${error.message}`
          );
        }
      });

      for (let index = 0; index < productCatalogueData.items.length; index++) {
        const expectedItem = productCatalogueData.items[index];

        await test.step(`Add product to cart from details page - ${expectedItem.name}`, async () => {
          try {
            await inventoryPage.openProduct(expectedItem.name);

            await inventoryItemPage.assertInventoryItemPageLoaded();
            await inventoryItemPage.assertItemMatchesExpectedData(expectedItem);

            await inventoryItemPage.addToCart();
            await inventoryItemPage.assertRemoveButtonDisplayed();

            await inventoryPage.assertCartBadgeCount(index + 1);

            reporter.recordStep(
              `Add product from details - ${expectedItem.name}`,
              'PASSED',
              `Product added from details page and cart badge updated to ${index + 1}`
            );

            await inventoryItemPage.clickBackToProducts();
            await inventoryPage.assertInventoryPageLoaded();
          } catch (error) {
            reporter.recordStep(`Add product from details - ${expectedItem.name}`, 'FAILED', error.message);

            await testInfo.attach('shopping-cart-observation', {
              body: JSON.stringify(reporter.getSummary(), null, 2),
              contentType: 'application/json'
            });

            throw new Error(
              `Shopping cart journey failed for ${profile.username} while adding '${expectedItem.name}' from product details. ` +
                `Observation: ${error.message}`
            );
          }
        });
      }

      await test.step('Open shopping cart and validate selected products', async () => {
        try {
          await inventoryPage.openCart();

          await cartPage.assertCartPageLoaded();
          await cartPage.assertProductsDisplayed(productCatalogueData.items);
          await cartPage.assertCheckoutButtonVisible();
          await cartPage.assertContinueShoppingButtonVisible();

          reporter.recordStep(
            'Cart validation',
            'PASSED',
            'Cart contains all selected products and cart actions are available'
          );
        } catch (error) {
          reporter.recordStep('Cart validation', 'FAILED', error.message);

          await testInfo.attach('shopping-cart-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Shopping cart journey failed for ${profile.username} at Cart validation. ` +
              `Observation: ${error.message}`
          );
        }
      });

      await test.step('Remove one product from cart and validate cart updates', async () => {
        try {
          const productToRemove = productCatalogueData.items[0];
          const remainingProducts = productCatalogueData.items.slice(1);

          await cartPage.removeProduct(productToRemove.name);
          await cartPage.assertProductNotDisplayed(productToRemove.name);
          await cartPage.assertProductsDisplayed(remainingProducts);

          reporter.recordStep(
            'Remove product from cart',
            'PASSED',
            `${productToRemove.name} was removed and remaining cart items stayed correct`
          );
        } catch (error) {
          reporter.recordStep('Remove product from cart', 'FAILED', error.message);

          await testInfo.attach('shopping-cart-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Shopping cart journey failed for ${profile.username} at Remove product from cart. ` +
              `Observation: ${error.message}`
          );
        }
      });

      await testInfo.attach('shopping-cart-observation', {
        body: JSON.stringify(reporter.getSummary(), null, 2),
        contentType: 'application/json'
      });
    });
  }
});