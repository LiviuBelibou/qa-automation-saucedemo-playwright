# SauceDemo Playwright Automation

[![Playwright Tests](https://github.com/LiviuBelibou/qa-automation-saucedemo-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/LiviuBelibou/qa-automation-saucedemo-playwright/actions/workflows/playwright.yml)

End-to-end UI automation framework for
[SauceDemo](https://www.saucedemo.com), built with Playwright and TypeScript.

The project demonstrates maintainable test design, reusable Page Objects,
centralized test data, cross-browser execution, automated quality checks, and
continuous integration with GitHub Actions.

## Test coverage

The framework contains eight independent scenarios:

| Feature   | Scenario                           | Classification    |
| --------- | ---------------------------------- | ----------------- |
| Login     | Standard user can log in           | Smoke             |
| Login     | Locked-out user cannot log in      | Negative          |
| Inventory | User can add a product to the cart | Smoke             |
| Inventory | Products can be sorted by price    | Regression        |
| Cart      | Added product appears in the cart  | Smoke             |
| Cart      | User can remove a product          | Regression        |
| Checkout  | User can complete an order         | Smoke, end-to-end |
| Checkout  | Postal code is required            | Negative          |

Each scenario runs against Chromium, Firefox, and WebKit:

```text
8 scenarios × 3 browser engines = 24 test executions
```

## Technology

- TypeScript
- Playwright Test
- Node.js and npm
- Page Object Model
- dotenv
- ESLint
- Prettier
- GitHub Actions

## Project structure

```text
.
├── .github/
│   └── workflows/
│       └── playwright.yml
├── fixtures/
│   └── test.fixture.ts
├── pages/
│   ├── cart.page.ts
│   ├── checkout.page.ts
│   ├── inventory.page.ts
│   └── login.page.ts
├── test-data/
│   ├── checkout-data.ts
│   ├── products.ts
│   └── users.ts
├── tests/
│   ├── cart/
│   │   └── cart.spec.ts
│   ├── checkout/
│   │   └── checkout.spec.ts
│   ├── inventory/
│   │   └── inventory.spec.ts
│   └── login/
│       └── login.spec.ts
├── .env.example
├── .prettierignore
├── .prettierrc.json
├── eslint.config.mjs
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

### Responsibilities

- `tests/` contains business-focused test scenarios organized by feature.
- `fixtures/` creates Page Objects and provides reusable authenticated test setup.
- `pages/` contains selectors and reusable browser actions.
- `test-data/` contains reusable users, products, and checkout information.
- `playwright.config.ts` controls browsers, timeouts, retries, reporting, and
  environment configuration.
- `.github/workflows/playwright.yml` runs the complete quality gate in CI.

## Prerequisites

Install:

- Node.js 22 or newer
- npm
- Git

## Installation

Clone the repository:

```bash
git clone https://github.com/LiviuBelibou/qa-automation-saucedemo-playwright.git
cd qa-automation-saucedemo-playwright
```

Install dependencies:

```bash
npm ci
```

Install the Playwright browsers:

```bash
npx playwright install
```

Create the local environment file:

```bash
cp .env.example .env
```

## Environment configuration

The framework reads configuration from `.env`:

```env
BASE_URL=https://www.saucedemo.com
SAUCEDEMO_USERNAME=standard_user
SAUCEDEMO_PASSWORD=secret_sauce
```

The local `.env` file is excluded from Git.

SauceDemo credentials are public demonstration credentials. In a production
project, private credentials should be stored in a secure secrets manager or
GitHub Secrets and must not be committed.

## Running tests

Run the complete cross-browser suite:

```bash
npm test
```

Run only Chromium:

```bash
npm run test:chromium
```

Run smoke tests:

```bash
npm run test:smoke
```

Run negative tests:

```bash
npm run test:negative
```

Run tests with visible browsers:

```bash
npm run test:headed
```

Open Playwright UI mode:

```bash
npm run test:ui
```

Run in debug mode:

```bash
npm run test:debug
```

## Test tags

Tests are classified using tags:

- `@smoke` identifies critical application journeys.
- `@negative` verifies rejected actions and validation.
- `@regression` verifies broader application behaviour.
- `@e2e` identifies a complete user journey.

Run a tag directly with:

```bash
npx playwright test --grep @regression
npx playwright test --grep @e2e
```

## Code-quality commands

Run TypeScript validation:

```bash
npm run typecheck
```

Run ESLint:

```bash
npm run lint
```

Verify formatting:

```bash
npm run format:check
```

Format the project:

```bash
npm run format
```

Run the complete quality gate:

```bash
npm run check
```

The quality gate runs:

1. TypeScript validation
2. ESLint
3. Prettier validation
4. The complete Playwright test suite

## Test reports and diagnostics

Open the latest HTML report:

```bash
npm run report
```

When a test fails, the framework can retain:

- A screenshot
- A video
- A Playwright trace
- The HTML test report

Generated results are stored locally in `test-results/` and
`playwright-report/`. These folders are excluded from Git.

## Design decisions

### Centralized configuration

The base URL and environment-specific credentials are stored outside the test
files. This avoids duplication and makes switching environments easier.

### Page Object Model

Selectors and browser actions are stored in Page Objects. Tests describe
business behaviour without repeating element-handling code.

### Reusable fixtures

Custom Playwright fixtures create the Page Objects centrally. Tests that require
an authenticated user reuse the same login setup instead of repeating it in
every test file.

### Stable locators

The framework uses SauceDemo's `data-test` attributes through Playwright's
`getByTestId()` locator.

### Test isolation

Each test receives an isolated browser context and does not rely on another test
running first.

### Web-first assertions

Playwright assertions automatically wait for the expected condition, reducing
the need for hard-coded delays.

### Cross-browser execution

Every scenario runs against Chromium, Firefox, and WebKit to identify
browser-specific problems.

## Continuous integration

GitHub Actions runs the complete quality gate for:

- Pull requests targeting `main`
- Changes pushed to `main`

The `main` branch is protected. Pull requests must satisfy the required `test`
status check before they can be merged.

Playwright reports are uploaded as workflow artifacts for later investigation.

## Scope

This repository focuses on UI end-to-end automation for a public demonstration
application.

API tests are not included because the project does not rely on a documented
public SauceDemo API. Unsupported endpoints should not be invented merely to
claim API coverage.

WebKit coverage is useful for browser-engine compatibility but does not replace
testing on every real Safari and Apple device configuration.

## Disclaimer

This is an independent test automation project created for educational and
portfolio purposes. It is not affiliated with Sauce Labs or SauceDemo.
