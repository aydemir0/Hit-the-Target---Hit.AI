import { test, expect } from '@playwright/test';

test.describe('Primary Flow', () => {
  test('Career Chat sends message and receives stream without hitting real AI', async ({ page }) => {
    // Intercept all real AI endpoints to fail immediately
    await page.route('**/*api.groq.com*', route => {
      console.error('Test attempted to hit Groq API!');
      route.abort();
    });
    await page.route('**/*api.anthropic.com*', route => {
      console.error('Test attempted to hit Anthropic API!');
      route.abort();
    });

    // Intercept local chat API
    await page.route('**/api/chat', async route => {
      const body = [
        'data: {"type":"text-start","id":"1"}\n\n',
        'data: {"type":"text-delta","id":"1","delta":"E2E Assistant Response"}\n\n',
        'data: {"type":"text-end","id":"1"}\n\n',
        'data: [DONE]\n\n'
      ].join('');
      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body,
      });
    });

    await page.goto('/analysis');

    // Make sure we are on the page
    await expect(page.getByText('Career Analysis Chat')).toBeVisible();

    // Fill message and send
    const input = page.getByLabel(/Type your message/i);
    await input.fill('Hello from Playwright');
    await page.getByRole('button', { name: /Send/i }).click();

    // Verify user message appears
    await expect(page.getByText('Hello from Playwright')).toBeVisible();

    // Verify mocked assistant response appears
    await expect(page.getByText('E2E Assistant Response')).toBeVisible();

    // Wait and verify input becomes enabled again
    await expect(input).toBeEnabled();
  });
});
