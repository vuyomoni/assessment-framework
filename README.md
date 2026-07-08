# Assessment Framework

A journey-based Playwright JavaScript automation framework demonstrating UI automation, API automation, reporting and CI/CD practices.

---

# Overview

This project was developed as a demonstration of senior automation engineering practices rather than simply automating a few test cases.

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

Authentication Journey

Login Page
↓

Enter Credentials
↓

Authenticate
↓

Inventory Page

The `standard_user` represents the Golden Path.

The same journey is then executed against additional user profiles provided by SauceDemo.

The framework records where each user successfully completes or deviates from the expected journey.

This approach provides meaningful behaviour assessment instead of simply reporting that a test passed or failed.

---

# Project Structure

```
assessment-framework
│
├── .github/
│   └── workflows/
│
├── data/
│
├── docs/
│
├── pages/
│
├── tests/
│   ├── ui/
│   └── api/
│
├── utils/
│
├── playwright.config.js
├── package.json
└── README.md
```

---

# Running Locally

Install dependencies

```bash
npm install
```

Install Chromium

```bash
npx playwright install chromium --with-deps
```

Run all journeys

```bash
npm test
```

Run headed

```bash
npm run test:headed
```

Run authentication journey

```bash
npm run test:login
```

---

# Reporting

The framework produces:

- Playwright HTML Report
- Monocart Report

Local reports can be viewed using:

```bash
npm run report
```

or

```bash
npm run report:monocart
```

---

# GitHub Actions

Every push, pull request and manual workflow execution automatically:

1. Installs dependencies
2. Installs Chromium
3. Executes the Playwright journey assessments
4. Publishes the Monocart report to GitHub Pages
5. Uploads the Playwright HTML report as an artifact
6. Marks the workflow as failed if any journey deviates from the expected Golden Path

---

# Viewing Reports

After the GitHub Action completes:

1. Open **Actions**
2. Select the latest workflow run
3. In the workflow summary, click the **Live Monocart Report** link

No local setup or artifact download is required to view the report.

---

# Technologies

- Playwright
- JavaScript
- Monocart Reporter
- GitHub Actions

---

# Notes

This framework intentionally separates the concept of **automation execution** from **business behaviour assessment**.

A failed journey indicates that a user profile deviated from the expected Golden Path. The generated report identifies:

- Journey
- User Profile
- Failure Stage
- Application Observation

This provides reviewers with meaningful diagnostic information rather than only indicating that a test failed.