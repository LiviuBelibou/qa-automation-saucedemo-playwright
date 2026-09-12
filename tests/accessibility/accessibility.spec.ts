import AxeBuilder from '@axe-core/playwright';
import { type Page, type TestInfo } from '@playwright/test';
import { expect, test } from '../../fixtures/test.fixture';

async function findSevereAccessibilityViolations(
  page: Page,
  testInfo: TestInfo,
) {
  const scanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(scanResults, null, 2),
    contentType: 'application/json',
  });

  return scanResults.violations.filter(
    (violation) =>
      violation.impact === 'serious' || violation.impact === 'critical',
  );
}

test.describe('Accessibility', () => {
  test(
    'login page has no serious or critical accessibility violations',
    { tag: '@accessibility' },
    async ({ page, app }, testInfo) => {
      await app.loginPage.goto();

      const violations = await findSevereAccessibilityViolations(
        page,
        testInfo,
      );

      expect(violations).toEqual([]);
    },
  );

  test(
    'inventory page has no serious or critical accessibility violations',
    { tag: '@accessibility' },
    async ({ page, authenticatedApp }, testInfo) => {
      await expect(authenticatedApp.inventoryPage.title).toHaveText('Products');

      const violations = await findSevereAccessibilityViolations(
        page,
        testInfo,
      );

      expect(violations).toEqual([]);
    },
  );
});
