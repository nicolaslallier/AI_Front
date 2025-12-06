import { test, expect } from '@playwright/test';

test.describe('Application Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Initial Page Load', () => {
    test('should redirect to home page', async ({ page }) => {
      await page.waitForURL('**/home');
      expect(page.url()).toContain('/home');
    });

    test('should display application header', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeVisible();
      await expect(header).toContainText('AI Front');
    });

    test('should display navigation menu', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should have correct page title', async ({ page }) => {
      await page.waitForURL('**/home');
      await expect(page).toHaveTitle(/Home.*AI Front/);
    });
  });

  test.describe('Navigation Menu Structure', () => {
    test('should display all navigation items', async ({ page }) => {
      const navLinks = page.locator('nav a');
      // Home + 6 console items (Grafana, Loki, Tempo, Prometheus, pgAdmin, Keycloak)
      await expect(navLinks).toHaveCount(7);
    });

    test('should have Home navigation item', async ({ page }) => {
      const homeLink = page.getByRole('link', { name: 'Home' });
      await expect(homeLink).toBeVisible();
    });

    test('should have Grafana navigation item', async ({ page }) => {
      const grafanaLink = page.getByRole('link', { name: 'Grafana' });
      await expect(grafanaLink).toBeVisible();
    });

    test('should have all console navigation items', async ({ page }) => {
      // Observability consoles
      await expect(page.getByRole('link', { name: 'Grafana' })).toBeVisible();
      await expect(page.getByRole('link', { name: /Logs.*Loki/ })).toBeVisible();
      await expect(page.getByRole('link', { name: /Traces.*Tempo/ })).toBeVisible();
      await expect(page.getByRole('link', { name: /Metrics.*Prometheus/ })).toBeVisible();

      // Admin consoles
      await expect(page.getByRole('link', { name: 'pgAdmin' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Keycloak Admin' })).toBeVisible();
    });

    test('should display navigation items with Home first', async ({ page }) => {
      const links = await page.locator('nav a').allTextContents();
      expect(links[0]).toBe('Home');

      // Verify all console items are present
      expect(links).toContain('Grafana');
      expect(links).toContain('Logs (Loki)');
      expect(links).toContain('Traces (Tempo)');
      expect(links).toContain('Metrics (Prometheus)');
      expect(links).toContain('pgAdmin');
      expect(links).toContain('Keycloak Admin');
    });
  });

  test.describe('Navigation Functionality', () => {
    test('should navigate between pages without full reload', async ({ page }) => {
      // Navigate to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Should be SPA navigation - no reload after initial load
      const initialUrl = page.url();

      await page.click('text=Home');
      await page.waitForURL('**/home');

      // URL should change
      expect(page.url()).not.toBe(initialUrl);
    });

    test('should update URL when navigating', async ({ page }) => {
      // Start on home
      await page.waitForURL('**/home');
      const homeUrl = page.url();

      // Navigate to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');
      const grafanaUrl = page.url();

      // URLs should be different
      expect(homeUrl).not.toBe(grafanaUrl);
      expect(grafanaUrl).toContain('/grafana');
    });

    test('should update page title when navigating', async ({ page }) => {
      await page.waitForURL('**/home');
      await expect(page).toHaveTitle(/Home.*AI Front/);

      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');
      await expect(page).toHaveTitle(/Grafana.*AI Front/);
    });

    test('should highlight active navigation item', async ({ page }) => {
      await page.waitForURL('**/home');

      // Home should be active
      const homeLink = page.getByRole('link', { name: 'Home' });
      await expect(homeLink).toHaveClass(/text-indigo-600/);

      // Navigate to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Grafana should be active
      const grafanaLink = page.getByRole('link', { name: 'Grafana' });
      await expect(grafanaLink).toHaveClass(/text-indigo-600/);
    });
  });

  test.describe('Shell Persistence', () => {
    test('should maintain header across all pages', async ({ page }) => {
      // Check on home
      await page.waitForURL('**/home');
      let header = page.locator('header');
      await expect(header).toBeVisible();

      // Navigate to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Header should still be visible
      header = page.locator('header');
      await expect(header).toBeVisible();
      await expect(header).toContainText('AI Front');
    });

    test('should maintain navigation across all pages', async ({ page }) => {
      // Check on home
      await page.waitForURL('**/home');
      let nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Navigate to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Navigation should still be visible
      nav = page.locator('nav');
      await expect(nav).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Grafana' })).toBeVisible();
    });
  });

  test.describe('Browser Navigation', () => {
    test('should support browser back button', async ({ page }) => {
      await page.waitForURL('**/home');

      // Navigate forward
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Go back
      await page.goBack();
      await page.waitForURL('**/home');

      expect(page.url()).toContain('/home');
    });

    test('should support browser forward button', async ({ page }) => {
      await page.waitForURL('**/home');

      // Navigate forward
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Go back
      await page.goBack();
      await page.waitForURL('**/home');

      // Go forward again
      await page.goForward();
      await page.waitForURL('**/grafana');

      expect(page.url()).toContain('/grafana');
    });

    test('should handle multiple back and forward operations', async ({ page }) => {
      await page.waitForURL('**/home');

      // Navigate to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Back to home
      await page.goBack();
      await page.waitForURL('**/home');

      // Forward to Grafana
      await page.goForward();
      await page.waitForURL('**/grafana');

      // Back to home again
      await page.goBack();
      await page.waitForURL('**/home');

      expect(page.url()).toContain('/home');
    });
  });

  test.describe('Direct URL Access', () => {
    test('should handle direct access to home route', async ({ page }) => {
      await page.goto('/home');
      await page.waitForURL('**/home');

      const header = page.locator('header');
      const nav = page.locator('nav');

      await expect(header).toBeVisible();
      await expect(nav).toBeVisible();
    });

    test('should handle direct access to Grafana route', async ({ page }) => {
      await page.goto('/grafana');
      await page.waitForURL('**/grafana');

      const header = page.locator('header');
      const nav = page.locator('nav');

      await expect(header).toBeVisible();
      await expect(nav).toBeVisible();
    });

    test('should redirect root to home', async ({ page }) => {
      await page.goto('/');
      await page.waitForURL('**/home');
      expect(page.url()).toContain('/home');
    });
  });

  test.describe('Accessibility', () => {
    test('should have semantic HTML elements', async ({ page }) => {
      await page.waitForURL('**/home');

      const header = page.locator('header');
      const nav = page.locator('nav');
      const main = page.locator('main');

      await expect(header).toBeVisible();
      await expect(nav).toBeVisible();
      await expect(main).toBeVisible();
    });

    test('should have accessible navigation links', async ({ page }) => {
      await page.waitForURL('**/home');

      const links = page.locator('nav a');
      const count = await links.count();

      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        expect(text).toBeTruthy();
        expect(text!.trim().length).toBeGreaterThan(0);
      }
    });

    test('should have descriptive page titles', async ({ page }) => {
      await page.waitForURL('**/home');
      const homeTitle = await page.title();
      expect(homeTitle).toContain('Home');
      expect(homeTitle).toContain('AI Front');

      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');
      const grafanaTitle = await page.title();
      expect(grafanaTitle).toContain('Grafana');
      expect(grafanaTitle).toContain('AI Front');
    });
  });

  test.describe('Responsive Design', () => {
    test('should display navigation on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForURL('**/home');

      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should display navigation on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForURL('**/home');

      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should display navigation on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForURL('**/home');

      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });
  });
});
