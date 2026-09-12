# SauceDemo Playwright Automation

[![Playwright Tests](https://github.com/LiviuBelibou/qa-automation-saucedemo-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/LiviuBelibou/qa-automation-saucedemo-playwright/actions/workflows/playwright.yml)

End-to-end UI automation framework for
[SauceDemo](https://www.saucedemo.com), built with Playwright and TypeScript.

The project demonstrates maintainable test design, reusable Page Objects,
centralized test data, accessibility checks, cross-browser execution, automated
code-quality checks, and continuous integration with GitHub Actions.

## Test coverage

The framework contains ten independent scenarios:

| Feature       | Scenario                                         | Classification    |
| ------------- | ------------------------------------------------ | ----------------- |
| Login         | Standard user can log in                         | Smoke             |
| Login         | Locked-out user cannot log in                    | Negative          |
| Inventory     | User can add a product to the cart               | Smoke             |
| Inventory     | Products can be sorted by price                  | Regression        |
| Cart          | Added product appears in the cart                | Smoke             |
| Cart          | User can remove a product                        | Regression        |
| Checkout      | User can complete an order                       | Smoke, end-to-end |
| Checkout      | Postal code is required                          | Negative          |
| Accessibility | Login page has no serious or critical violations | Accessibility     |
| Accessibility | Inventory page has no serious or critical issues | Accessibility     |

Each scenario runs against Chromium, Firefox, and WebKit:

```text
10 scenarios × 3 browser engines = 30 test executions
```

## Technology

- TypeScript
- Playwright Test
- Axe Core for Playwright
- Node.js and npm
- Page Object Model
- Custom Playwright fixtures
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
│   ├── accessibility/
│   │   └── accessibility.spec.ts
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

- `tests/` contains business-focused and accessibility test scenarios organized
  by feature.
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

Run regression tests:

```bash
npm run test:regression
```

Run the complete end-to-end journey:

```bash
npm run test:e2e
```

Run accessibility tests:

```bash
npm run test:accessibility
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
- `@accessibility` identifies automated WCAG accessibility scans.

Run any tag directly with:

```bash
npx playwright test --grep @smoke
npx playwright test --grep @negative
npx playwright test --grep @regression
npx playwright test --grep @e2e
npx playwright test --grep @accessibility
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
- Detailed Axe accessibility scan results

Generated results are stored locally in `test-results/` and
`playwright-report/`. These folders are excluded from Git.

## Design decisions

### Centralized configuration

The base URL and environment-specific credentials are stored outside the test
files. This avoids duplication and makes switching environments easier.

### Centralized test data

User credentials, product information, expected prices, inventory expectations,
and checkout data are stored separately from the test scenarios. This reduces
duplication and provides a single place to update expected data.

### Page Object Model

Selectors and browser actions are stored in Page Objects. Tests describe
business behaviour without repeating element-handling code.

### Reusable fixtures

Custom Playwright fixtures create the Page Objects centrally. Tests that require
an authenticated user reuse the same login setup instead of repeating it in
every test file.

### Strong business assertions

Tests verify more than page navigation and element visibility. The checkout
journey confirms the selected product, expected price, subtotal, tax, and final
total calculation.

### Stable locators

The framework uses SauceDemo's `data-test` attributes through Playwright's
`getByTestId()` locator.

### Test isolation

Each test receives an isolated browser context and does not rely on another test
running first.

### Web-first assertions

Playwright assertions automatically wait for the expected condition, reducing
the need for hard-coded delays.

### Accessibility testing

Axe Core scans the login and inventory pages against WCAG 2.0 and WCAG 2.1
Level A and AA rules. The automated quality gate fails when serious or critical
violations are detected.

Complete accessibility testing also requires manual evaluation with keyboards,
screen readers, zoom, and other assistive technologies.

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

This repository focuses on UI end-to-end and automated accessibility testing for
a public demonstration application.

API tests are not included because the project does not rely on a documented
public SauceDemo API. Unsupported endpoints should not be invented merely to
claim API coverage.

Automated accessibility scans can identify many technical violations but do not
replace a complete manual accessibility audit.

WebKit coverage is useful for browser-engine compatibility but does not replace
testing on every real Safari and Apple device configuration.

## Disclaimer

This is an independent test automation project created for educational and
portfolio purposes. It is not affiliated with Sauce Labs or SauceDemo.
