# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\journeys\authentication-journey.spec.js >> Authentication Journey - Golden Path Behaviour Assessment >> Login golden path check for locked_out_user
- Location: tests\ui\journeys\authentication-journey.spec.js:8:5

# Error details

```
Error: Golden path failed for locked_out_user at Authentication. Observation: Epic sadface: Sorry, this user has been locked out.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: Swag Labs
  - generic [ref=e5]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - textbox "Username" [ref=e11]: locked_out_user
        - img [ref=e12]
      - generic [ref=e14]:
        - textbox "Password" [ref=e15]: secret_sauce
        - img [ref=e16]
      - 'heading "Epic sadface: Sorry, this user has been locked out." [level=3] [ref=e19]':
        - button [ref=e20] [cursor=pointer]:
          - img [ref=e21]
        - text: "Epic sadface: Sorry, this user has been locked out."
      - button "Login" [active] [ref=e23] [cursor=pointer]
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "Accepted usernames are:" [level=4] [ref=e27]
        - text: standard_user
        - text: locked_out_user
        - text: problem_user
        - text: performance_glitch_user
        - text: error_user
        - text: visual_user
      - generic [ref=e28]:
        - heading "Password for all users:" [level=4] [ref=e29]
        - text: secret_sauce
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const { LoginPage } = require('../../../pages/LoginPage');
  3  | const { JourneyReporter } = require('../../../utils/journeyReporter');
  4  | const userData = require('../../../data/users.json');
  5  | 
  6  | test.describe('Authentication Journey - Golden Path Behaviour Assessment', () => {
  7  |   for (const profile of userData.profiles) {
  8  |     test(`Login golden path check for ${profile.username}`, async ({ page }, testInfo) => {
  9  |       const loginPage = new LoginPage(page);
  10 |       const reporter = new JourneyReporter('Authentication Journey', profile);
  11 | 
  12 |       await test.step('Navigate to login page', async () => {
  13 |         await loginPage.goto();
  14 | 
  15 |         await expect(loginPage.usernameInput).toBeVisible();
  16 |         await expect(loginPage.passwordInput).toBeVisible();
  17 | 
  18 |         reporter.recordStep('Navigate to login page', 'PASSED');
  19 |       });
  20 | 
  21 |       await test.step(`Attempt login as ${profile.username}`, async () => {
  22 |         await loginPage.login(profile.username, userData.password);
  23 | 
  24 |         const isInventoryDisplayed = await loginPage.isInventoryDisplayed();
  25 |         const errorMessage = await loginPage.getErrorMessage();
  26 | 
  27 |         if (!isInventoryDisplayed) {
  28 |           reporter.recordStep(
  29 |             'Authentication',
  30 |             'FAILED',
  31 |             errorMessage || 'User did not reach inventory page'
  32 |           );
  33 | 
  34 |           await testInfo.attach('authentication-observation', {
  35 |             body: JSON.stringify(reporter.getSummary(), null, 2),
  36 |             contentType: 'application/json'
  37 |           });
  38 | 
> 39 |           throw new Error(
     |                 ^ Error: Golden path failed for locked_out_user at Authentication. Observation: Epic sadface: Sorry, this user has been locked out.
  40 |             `Golden path failed for ${profile.username} at Authentication. ` +
  41 |             `Observation: ${errorMessage || 'User did not reach inventory page'}`
  42 |           );
  43 |         }
  44 | 
  45 |         reporter.recordStep(
  46 |           'Authentication',
  47 |           'PASSED',
  48 |           'User authenticated and inventory page displayed'
  49 |         );
  50 | 
  51 |         await expect(page).toHaveURL(/inventory.html/);
  52 |       });
  53 | 
  54 |       await testInfo.attach('authentication-observation', {
  55 |         body: JSON.stringify(reporter.getSummary(), null, 2),
  56 |         contentType: 'application/json'
  57 |       });
  58 |     });
  59 |   }
  60 | });
```