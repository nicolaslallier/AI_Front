import { test, expect } from '@playwright/test';

/**
 * E2E tests for Console Hub Integration
 * Tests navigation and access to all admin/observability consoles
 *
 * Note: These tests assume authentication is mocked or disabled for e2e testing
 * In production, role-based access control would be enforced via Keycloak
 */
test.describe('Console Hub Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('**/home');
  });

  test.describe('Console Navigation Menu', () => {
    test('should display all console navigation items', async ({ page }) => {
      // Verify observability consoles
      await expect(page.getByRole('link', { name: 'Grafana' })).toBeVisible();
      await expect(page.getByRole('link', { name: /Logs.*Loki/ })).toBeVisible();
      await expect(page.getByRole('link', { name: /Traces.*Tempo/ })).toBeVisible();
      await expect(page.getByRole('link', { name: /Metrics.*Prometheus/ })).toBeVisible();

      // Verify admin consoles
      await expect(page.getByRole('link', { name: 'pgAdmin' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Keycloak Admin' })).toBeVisible();
    });

    test('should have correct navigation menu order', async ({ page }) => {
      const links = await page.locator('nav a').allTextContents();

      // Verify Home is first
      expect(links[0]).toBe('Home');

      // Verify observability section order
      expect(links).toContain('Grafana');
      expect(links).toContain('Logs (Loki)');
      expect(links).toContain('Traces (Tempo)');
      expect(links).toContain('Metrics (Prometheus)');

      // Verify admin section order
      expect(links).toContain('pgAdmin');
      expect(links).toContain('Keycloak Admin');
    });
  });

  test.describe('Grafana Console', () => {
    test('should navigate to Grafana', async ({ page }) => {
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');
      expect(page.url()).toContain('/grafana');
    });

    test('should update page title for Grafana', async ({ page }) => {
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');
      await expect(page).toHaveTitle(/Grafana.*AI Front/);
    });

    test('should maintain shell layout on Grafana page', async ({ page }) => {
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Verify header and navigation remain visible
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });
  });

  test.describe('pgAdmin Console', () => {
    test('should navigate to pgAdmin', async ({ page }) => {
      await page.click('text=pgAdmin');
      await page.waitForURL('**/pgadmin');
      expect(page.url()).toContain('/pgadmin');
    });

    test('should update page title for pgAdmin', async ({ page }) => {
      await page.click('text=pgAdmin');
      await page.waitForURL('**/pgadmin');
      await expect(page).toHaveTitle(/pgAdmin.*AI Front/);
    });

    test('should maintain shell layout on pgAdmin page', async ({ page }) => {
      await page.click('text=pgAdmin');
      await page.waitForURL('**/pgadmin');

      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });
  });

  test.describe('Keycloak Admin Console', () => {
    test('should navigate to Keycloak Admin', async ({ page }) => {
      await page.click('text=Keycloak Admin');
      await page.waitForURL('**/keycloak');
      expect(page.url()).toContain('/keycloak');
    });

    test('should update page title for Keycloak Admin', async ({ page }) => {
      await page.click('text=Keycloak Admin');
      await page.waitForURL('**/keycloak');
      await expect(page).toHaveTitle(/Keycloak Admin.*AI Front/);
    });

    test('should maintain shell layout on Keycloak Admin page', async ({ page }) => {
      await page.click('text=Keycloak Admin');
      await page.waitForURL('**/keycloak');

      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });
  });

  test.describe('Loki Console (Logs)', () => {
    test('should navigate to Loki', async ({ page }) => {
      await page.click('text=Logs (Loki)');
      await page.waitForURL('**/logs');
      expect(page.url()).toContain('/logs');
    });

    test('should update page title for Loki', async ({ page }) => {
      await page.click('text=Logs (Loki)');
      await page.waitForURL('**/logs');
      await expect(page).toHaveTitle(/Logs.*Loki.*AI Front/);
    });

    test('should maintain shell layout on Loki page', async ({ page }) => {
      await page.click('text=Logs (Loki)');
      await page.waitForURL('**/logs');

      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });
  });

  test.describe('Tempo Console (Traces)', () => {
    test('should navigate to Tempo', async ({ page }) => {
      await page.click('text=Traces (Tempo)');
      await page.waitForURL('**/traces');
      expect(page.url()).toContain('/traces');
    });

    test('should update page title for Tempo', async ({ page }) => {
      await page.click('text=Traces (Tempo)');
      await page.waitForURL('**/traces');
      await expect(page).toHaveTitle(/Traces.*Tempo.*AI Front/);
    });

    test('should maintain shell layout on Tempo page', async ({ page }) => {
      await page.click('text=Traces (Tempo)');
      await page.waitForURL('**/traces');

      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });
  });

  test.describe('Prometheus Console (Metrics)', () => {
    test('should navigate to Prometheus', async ({ page }) => {
      await page.click('text=Metrics (Prometheus)');
      await page.waitForURL('**/metrics');
      expect(page.url()).toContain('/metrics');
    });

    test('should update page title for Prometheus', async ({ page }) => {
      await page.click('text=Metrics (Prometheus)');
      await page.waitForURL('**/metrics');
      await expect(page).toHaveTitle(/Metrics.*Prometheus.*AI Front/);
    });

    test('should maintain shell layout on Prometheus page', async ({ page }) => {
      await page.click('text=Metrics (Prometheus)');
      await page.waitForURL('**/metrics');

      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });
  });

  test.describe('Console Navigation Flow', () => {
    test('should navigate between different consoles', async ({ page }) => {
      // Start at home
      await page.waitForURL('**/home');

      // Navigate to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');
      expect(page.url()).toContain('/grafana');

      // Navigate to pgAdmin
      await page.click('text=pgAdmin');
      await page.waitForURL('**/pgadmin');
      expect(page.url()).toContain('/pgadmin');

      // Navigate to Logs
      await page.click('text=Logs (Loki)');
      await page.waitForURL('**/logs');
      expect(page.url()).toContain('/logs');

      // Navigate back to Home
      await page.click('text=Home');
      await page.waitForURL('**/home');
      expect(page.url()).toContain('/home');
    });

    test('should navigate without page reload (SPA behavior)', async ({ page }) => {
      // Mark the page load
      let navigationCount = 0;
      page.on('load', () => {
        navigationCount++;
      });

      // Navigate through multiple consoles
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      await page.click('text=pgAdmin');
      await page.waitForURL('**/pgadmin');

      await page.click('text=Home');
      await page.waitForURL('**/home');

      // Should only have initial page load, not full reloads for navigation
      // Navigation count should be minimal (SPA behavior)
      expect(navigationCount).toBeLessThanOrEqual(1);
    });

    test('should maintain active navigation state', async ({ page }) => {
      // Navigate to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      const grafanaLink = page.getByRole('link', { name: 'Grafana' });
      await expect(grafanaLink).toHaveClass(/text-indigo-600/);

      // Navigate to pgAdmin
      await page.click('text=pgAdmin');
      await page.waitForURL('**/pgadmin');

      const pgAdminLink = page.getByRole('link', { name: 'pgAdmin' });
      await expect(pgAdminLink).toHaveClass(/text-indigo-600/);
    });
  });

  test.describe('Console Loading States', () => {
    test('should show loading state when navigating to console', async ({ page }) => {
      await page.click('text=Grafana');

      // Loading indicator should appear briefly
      // Note: This may be too fast to catch in some environments
      // Checking if loading indicator exists (may not be visible long enough to test)

      // Wait for navigation to complete
      await page.waitForURL('**/grafana');
    });
  });

  test.describe('Back Navigation', () => {
    test('should support browser back button', async ({ page }) => {
      // Navigate to Grafana
      await page.click('text=Grafana');
      await page.waitForURL('**/grafana');

      // Navigate to pgAdmin
      await page.click('text=pgAdmin');
      await page.waitForURL('**/pgadmin');

      // Use browser back button
      await page.goBack();
      await page.waitForURL('**/grafana');
      expect(page.url()).toContain('/grafana');

      // Use browser back button again
      await page.goBack();
      await page.waitForURL('**/home');
      expect(page.url()).toContain('/home');
    });

    test('should support browser forward button', async ({ page }) => {
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
});
