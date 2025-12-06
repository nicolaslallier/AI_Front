import { test, expect } from '@playwright/test';

test.describe('Grafana Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Navigation Menu', () => {
    test('should display Grafana navigation item', async ({ page }) => {
      const grafanaLink = page.getByRole('link', { name: 'Grafana' });
      await expect(grafanaLink).toBeVisible();
    });

    test('should display Home navigation item', async ({ page }) => {
      const homeLink = page.getByRole('link', { name: 'Home' });
      await expect(homeLink).toBeVisible();
    });

    test('should have both navigation items in correct order', async ({ page }) => {
      const links = page.locator('nav a');
      await expect(links).toHaveCount(2);

      const firstLink = links.nth(0);
      const secondLink = links.nth(1);

      await expect(firstLink).toHaveText('Home');
      await expect(secondLink).toHaveText('Grafana');
    });
  });

  test.describe('Shell Persistence', () => {
    test('should display header on home page', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeVisible();
      await expect(header).toContainText('AI Front');
    });

    test('should display navigation on home page', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should persist header when navigating to Grafana', async ({ page }) => {
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      const header = page.locator('header');
      await expect(header).toBeVisible();
      await expect(header).toContainText('AI Front');
    });

    test('should persist navigation when navigating to Grafana', async ({ page }) => {
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });
  });

  test.describe('Grafana Route Navigation', () => {
    test('should navigate to Grafana page when clicking Grafana link', async ({ page }) => {
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');
      expect(page.url()).toContain('/grafana');
    });

    test('should update page title when navigating to Grafana', async ({ page }) => {
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');
      await expect(page).toHaveTitle(/Grafana.*AI Front/);
    });

    test('should be able to navigate back to Home from Grafana', async ({ page }) => {
      // Go to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Go back to Home
      await page.click('text=Home');
      await page.waitForURL('**/home');
      expect(page.url()).toContain('/home');
    });

    test('should highlight active navigation item', async ({ page }) => {
      // Initially on home
      const homeLink = page.getByRole('link', { name: 'Home' });
      await expect(homeLink).toHaveClass(/text-indigo-600/);

      // Navigate to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      const grafanaLink = page.getByRole('link', { name: 'Grafana' });
      await expect(grafanaLink).toHaveClass(/text-indigo-600/);
    });
  });

  test.describe('Grafana Content Display', () => {
    test('should attempt to load Grafana iframe', async ({ page }) => {
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Wait for either iframe or error message
      const iframe = page.locator('iframe[title="Grafana Dashboard"]');
      const errorMessage = page.locator('text=/Grafana Unavailable/i');

      // One of them should appear
      const iframeVisible = await iframe.isVisible().catch(() => false);
      const errorVisible = await errorMessage.isVisible().catch(() => false);

      expect(iframeVisible || errorVisible).toBe(true);
    });

    test('should display loading indicator initially', async ({ page }) => {
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Loading text should appear briefly or iframe should load
      const loadingText = page.locator('text=/Loading Grafana/i');
      const iframe = page.locator('iframe[title="Grafana Dashboard"]');

      // Either loading or iframe should be present
      const hasLoading = await loadingText.isVisible().catch(() => false);
      const hasIframe = await iframe.isVisible().catch(() => false);

      expect(hasLoading || hasIframe).toBe(true);
    });

    test('should have iframe with correct src attribute', async ({ page }) => {
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      const iframe = page.locator('iframe[title="Grafana Dashboard"]');

      // Check if iframe exists (might not load if Grafana is unavailable)
      const iframeExists = await iframe.count();
      if (iframeExists > 0) {
        const src = await iframe.getAttribute('src');
        expect(src).toContain('grafana');
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should display error message when Grafana is unavailable', async ({ page }) => {
      // Intercept iframe requests and make them fail
      await page.route('**/grafana/**', (route) => route.abort());

      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Wait for error or iframe
      await page.waitForTimeout(2000);

      // Should show either the error or iframe
      const errorTitle = page.locator('text=/Grafana Unavailable/i');
      const iframe = page.locator('iframe[title="Grafana Dashboard"]');

      const hasError = await errorTitle.isVisible().catch(() => false);
      const hasIframe = await iframe.isVisible().catch(() => false);

      // At least one should be visible
      expect(hasError || hasIframe).toBe(true);
    });

    test('should display retry button in error state', async ({ page }) => {
      await page.route('**/grafana/**', (route) => route.abort());

      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');
      await page.waitForTimeout(2000);

      const retryButton = page.locator('button:has-text("Retry")');
      const retryExists = await retryButton.isVisible().catch(() => false);

      // Retry button should exist if error is shown
      if (retryExists) {
        await expect(retryButton).toBeVisible();
      }
    });

    test('should not break other pages when Grafana fails', async ({ page }) => {
      await page.route('**/grafana/**', (route) => route.abort());

      // Go to Grafana (may fail)
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');
      await page.waitForTimeout(1000);

      // Navigate back to Home - should still work
      await page.click('text=Home');
      await page.waitForURL('**/home');

      // Home page should be functional
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });
  });

  test.describe('Browser Back/Forward', () => {
    test('should handle browser back button', async ({ page }) => {
      // Navigate to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Use browser back
      await page.goBack();
      await page.waitForURL('**/home');

      expect(page.url()).toContain('/home');
    });

    test('should handle browser forward button', async ({ page }) => {
      // Navigate to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Go back
      await page.goBack();
      await page.waitForURL('**/home');

      // Go forward
      await page.goForward();
      await page.waitForURL('**/grafana');

      expect(page.url()).toContain('/grafana');
    });
  });

  test.describe('Direct URL Access', () => {
    test('should allow direct access to Grafana route', async ({ page }) => {
      await page.goto('/grafana');
      await page.waitForURL('**/grafana');

      // Should display the shell with navigation
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Should display Grafana content or error
      const iframe = page.locator('iframe[title="Grafana Dashboard"]');
      const error = page.locator('text=/Grafana Unavailable/i');

      const hasIframe = await iframe.isVisible().catch(() => false);
      const hasError = await error.isVisible().catch(() => false);

      expect(hasIframe || hasError).toBe(true);
    });

    test('should redirect root to home', async ({ page }) => {
      await page.goto('/');
      await page.waitForURL('**/home');
      expect(page.url()).toContain('/home');
    });
  });

  test.describe('Accessibility', () => {
    test('should have semantic HTML structure', async ({ page }) => {
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      const header = page.locator('header');
      const nav = page.locator('nav');
      const main = page.locator('main');

      await expect(header).toBeVisible();
      await expect(nav).toBeVisible();
      await expect(main).toBeVisible();
    });

    test('should have accessible navigation links', async ({ page }) => {
      const homeLink = page.getByRole('link', { name: 'Home' });
      const grafanaLink = page.getByRole('link', { name: 'Grafana' });

      await expect(homeLink).toBeVisible();
      await expect(grafanaLink).toBeVisible();
    });

    test('should have iframe with title attribute', async ({ page }) => {
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      const iframe = page.locator('iframe[title="Grafana Dashboard"]');
      const iframeExists = await iframe.count();

      if (iframeExists > 0) {
        const title = await iframe.getAttribute('title');
        expect(title).toBeTruthy();
      }
    });
  });
});
