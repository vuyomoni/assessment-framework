# Assessment Framework

A professional Playwright JavaScript automation framework demonstrating UI and API test automation skills.

## Objective

This framework is designed to demonstrate senior-level automation thinking, not only basic test scripting. It shows:

- UI automation using Playwright against SauceDemo
- API automation using Playwright against Restful-Booker
- Authentication coverage for multiple user types
- Booking CRUD API coverage including DELETE
- Test data management outside test files
- Page Object Model for UI maintainability
- Reusable API client abstraction
- HTML and JSON test reporting
- GitHub Actions CI/CD execution

## Test Targets

| Layer | Target | Purpose |
|---|---|---|
| UI | SauceDemo | E-commerce authentication, inventory, cart, and checkout validation |
| API | Restful-Booker | Authentication and booking CRUD operations |

## Project Structure

```text
assessment-framework/
├─ .github/workflows/playwright.yml
├─ data/
│  ├─ bookingData.js
│  ├─ checkoutData.js
│  └─ users.js
├─ evidence/
├─ pages/
│  ├─ CartPage.js
│  ├─ CheckoutPage.js
│  ├─ InventoryPage.js
│  └─ LoginPage.js
├─ tests/
│  ├─ api/
│  │  ├─ auth.spec.js
│  │  └─ booking-crud.spec.js
│  └─ ui/
│     ├─ auth.spec.js
│     ├─ cart.spec.js
│     ├─ checkout.spec.js
│     └─ inventory.spec.js
├─ utils/
│  ├─ apiClient.js
│  └─ testHelpers.js
├─ package.json
├─ playwright.config.js
└─ README.md
```

## Prerequisites

- Node.js 20 or later
- npm
- Git

## Setup

Clone the repository and install dependencies:

```bash
npm install
npx playwright install --with-deps
```

## Running Tests

Run all tests:

```bash
npm test
```

Run UI tests only:

```bash
npm run test:ui
```

Run API tests only:

```bash
npm run test:api
```

Run tests in headed mode:

```bash
npm run test:headed
```

Open the Playwright HTML report:

```bash
npm run report
```

## Test Data Management

Test data is separated from test logic:

| File | Purpose |
|---|---|
| `data/users.js` | SauceDemo users and expected behaviours |
| `data/checkoutData.js` | Checkout customer information |
| `data/bookingData.js` | Dynamic booking payload creation |

This keeps tests readable, maintainable, and easier to extend.

## UI Coverage

### Authentication

- `standard_user` successful login
- `locked_out_user` negative login validation
- `problem_user` successful login smoke validation
- `performance_glitch_user` successful login with adjusted timeout
- `error_user` successful login smoke validation
- `visual_user` successful login smoke validation

### Inventory

- Product inventory is visible
- Product count validation
- Product sorting by price low to high

### Cart

- Add product to cart
- Remove product from cart
- Validate selected product details in cart

### Checkout

- Add multiple products
- Open cart
- Enter checkout information
- Validate order total is present
- Complete checkout successfully

## API Coverage

### Authentication

- Generate token
- Validate token exists and is a string

### Booking CRUD

- Create booking
- Get booking
- Full update booking
- Partial update booking
- Delete booking
- Verify deleted booking returns `404`

## Reporting

The framework produces:

- Console list reporter output
- Playwright HTML report in `playwright-report/`
- JSON result output in `test-results/results.json`
- Screenshots, videos, and traces retained on failure

## CI/CD

GitHub Actions pipeline is included under:

```text
.github/workflows/playwright.yml
```

The pipeline:

1. Checks out the repository
2. Sets up Node.js
3. Installs dependencies
4. Installs Playwright browsers
5. Executes tests
6. Uploads Playwright reports and test results as artifacts

## Environment Variables

The framework uses sensible defaults, but these can be overridden:

| Variable | Default |
|---|---|
| `UI_BASE_URL` | `https://www.saucedemo.com` |
| `API_BASE_URL` | `https://restful-booker.herokuapp.com` |
| `BOOKER_USERNAME` | `admin` |
| `BOOKER_PASSWORD` | `password123` |

Example:

```bash
UI_BASE_URL=https://www.saucedemo.com API_BASE_URL=https://restful-booker.herokuapp.com npm test
```

## Design Notes

This framework intentionally avoids hard-coded waits, duplicated selectors, fixed booking IDs, and test dependencies. UI tests use Page Objects. API tests create their own data, extract runtime IDs, clean up with DELETE, and verify state after deletion.
