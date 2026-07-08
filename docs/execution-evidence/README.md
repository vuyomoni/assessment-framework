# Assessment Framework

Playwright JavaScript framework demonstrating UI and API automation skills.

## Current Implementation

The first implemented UI layer is the Authentication Journey.

The login suite uses a journey-based, data-driven approach.  
The same login journey is executed against each supported SauceDemo user profile and the framework records the observed behaviour.

## Install Dependencies

```bash
npm install
npx playwright install
```

## Run Login Tests

```bash
npm run test:login
```

## View HTML Report

```bash
npm run report
```

## UI Design Principle

The framework validates business journeys and objectively reports behavioural differences across supported user profiles.

For example:
- `standard_user` should provide the baseline login behaviour.
- `locked_out_user` should show the application-level authentication block.
- Other users are assessed using the same journey and reported based on observed behaviour.

## Test Targets

UI target: SauceDemo  
API target: Restful-Booker
