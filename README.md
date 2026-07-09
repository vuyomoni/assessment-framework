# Assessment Framework

A journey-based Playwright JavaScript automation framework demonstrating UI automation, API automation, reporting and CI/CD practices.

---

# Overview

This project was developed as a demonstration of senior automation engineering practices rather than simply automating isolated test cases.

The framework focuses on:

- UI automation using Playwright
- API automation using Playwright
- Data-driven execution
- Journey-based testing
- Custom reporting using Monocart Reporter
- Continuous Integration using GitHub Actions

---

# Framework Philosophy

Rather than creating isolated test cases, the framework models complete business journeys.

Each journey has a defined **Golden Path**.

Example:

```text
Authentication Journey

Login Page
        ↓
Enter Credentials
        ↓
Authenticate
        ↓
Inventory Page
```

The `standard_user` represents the Golden Path.

The same journey is then executed against additional SauceDemo user profiles.

The framework records where each user successfully completes or deviates from the expected journey.

This approach provides meaningful behaviour assessment instead of simply reporting that a test passed or failed.

---

# Project Structure

```text
assessment-framework
│
├── .github/
│   └── workflows/
│
├── data/
│   └── api/
│
├── docs/
│
├── pages/
│
├── tests/
│   ├── ui/
│   │   └── journeys/
│   └── api/
│
├── utils/
│
├── playwright.config.js
├── package.json
└── README.md
```

---

# UI Automation

The UI framework follows a layered architecture.

```text
Test Data
        ↓
Page Objects
        ↓
Journey Tests
```

Current UI journey coverage:

- Authentication (multiple user types)
- Inventory Management
- Product Catalogue Validation
- Product Details Navigation
- Inventory Sorting
- Shopping Cart Functionality
- Checkout Process

Each journey validates both functional behaviour and the user's progression through the expected Golden Path.

---

# API Automation

The API framework mirrors the same architectural principles used by the UI framework.

```text
Test Data
        ↓
ApiClient
        ↓
Journey Tests
```

Current API coverage:

### Authentication API Journey

- Generate authentication token
- Validate successful authentication
- Validate invalid credentials
- Validate response status
- Validate response payload

### Booking CRUD API Journey

- Create Booking
- Retrieve Booking
- Update Booking
- Partial Update Booking
- Delete Booking
- Verify deleted booking returns 404

Every API request validates:

- HTTP status code
- Response payload
- Business data
- Complete business workflow

For reporting purposes every request and response is attached to the Monocart report.

Passwords and authentication tokens are masked before being written to the report.

---

# Setup & Execution

## Install dependencies

```bash
npm install
```

Install Chromium

```bash
npx playwright install chromium --with-deps
```

---

## Execute all journeys

```bash
npm test
```

---

## Execute headed

```bash
npm run test:headed
```

---

## Execute individual UI journeys

```bash
npm run test:login
npm run test:inventory
npm run test:productCatalogue
npm run test:productDetails
npm run test:inventorySorting
npm run test:cart
npm run test:checkout
```

---

## Execute API journeys

```bash
npm run test:api
```

or

```bash
npx playwright test tests/api/auth.spec.js
npx playwright test tests/api/booking-crud.spec.js
```

---

# Reporting

The framework produces:

- Playwright HTML Report
- Monocart Report
- API Request Attachments
- API Response Attachments
- Journey execution evidence
- Screenshots on failure
- Videos on failure

Local reports can be viewed using:

```bash
npm run report
```

or

```bash
npm run report:monocart
```

---

# CI/CD Strategy

The repository contains two GitHub Actions workflows.

## Playwright Automation Tests

Runs automatically on:

- Push
- Pull Request
- Manual execution

### Automatic Validation Strategy

Push and Pull Request executions intentionally run the **API automation suite**.

This provides:

- Fast feedback
- Shorter CI execution time
- Early detection of backend regressions
- Lower infrastructure cost

## Full UI Assessment

The UI journey assessments are executed:

- Manually using the **Playwright Test Suites** workflow
- During local development
- Before release

This reflects a common CI/CD strategy where fast-running API tests provide continuous validation while longer-running UI journeys are executed on demand.

Both workflows generate Monocart reports and publish them to GitHub Pages.

---

# Viewing Reports

After a GitHub Action completes:

1. Open **Actions**
2. Select the workflow run
3. Open the workflow summary
4. Click the **Live Monocart Report**

No local setup or artifact download is required.

---

# Execution Evidence

Execution evidence is available through:

- GitHub Actions workflow history
- Published Monocart reports
- Playwright HTML reports
- API request and response attachments

Evidence demonstrates:

- Successful UI journeys
- Successful API journeys
- Golden Path deviations
- Behaviour assessment reporting
- CI/CD execution

---

# Technologies

- Playwright
- JavaScript
- Monocart Reporter
- GitHub Actions
- GitHub Pages

---

# Notes

This framework intentionally separates automation execution from business behaviour assessment.

A failed journey identifies:

- Journey
- User Profile
- Failure Stage
- Application Observation

