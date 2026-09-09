import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('accessibility', () => {
  test('homepage should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');
    // wait for network idle to ensure everything renders
    await page.waitForLoadState('networkidle');
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('analysis page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/analysis');
    await page.waitForLoadState('networkidle');
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
