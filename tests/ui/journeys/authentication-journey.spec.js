const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { JourneyReporter } = require('../../../utils/journeyReporter');
const userData = require('../../../data/users.json');

test.describe('Authentication Journey - Golden Path Behaviour Assessment', () => {
  for (const profile of userData.profiles) {
    test(`Login golden path check for ${profile.username}`, async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const reporter = new JourneyReporter('Authentication Journey', profile);

      await test.step('Navigate to login page', async () => {
        await loginPage.goto();

        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();

        reporter.recordStep('Navigate to login page', 'PASSED');
      });

      await test.step(`Attempt login as ${profile.username}`, async () => {
        await loginPage.login(profile.username, userData.password);

        const isInventoryDisplayed = await loginPage.isInventoryDisplayed();
        const errorMessage = await loginPage.getErrorMessage();

        if (!isInventoryDisplayed) {
          reporter.recordStep(
            'Authentication',
            'FAILED',
            errorMessage || 'User did not reach inventory page'
          );

          await testInfo.attach('authentication-observation', {
            body: JSON.stringify(reporter.getSummary(), null, 2),
            contentType: 'application/json'
          });

          throw new Error(
            `Golden path failed for ${profile.username} at Authentication. ` +
            `Observation: ${errorMessage || 'User did not reach inventory page'}`
          );
        }

        reporter.recordStep(
          'Authentication',
          'PASSED',
          'User authenticated and inventory page displayed'
        );

        await expect(page).toHaveURL(/inventory.html/);
      });

      await testInfo.attach('authentication-observation', {
        body: JSON.stringify(reporter.getSummary(), null, 2),
        contentType: 'application/json'
      });
    });
  }
});