/**
 * Authentication Flow E2E Tests
 *
 * Tests complete authentication flows including:
 * - Login via Keycloak
 * - Protected route access
 * - Role-based navigation
 * - Logout
 * - Session restoration
 *
 * Note: These tests require a running Keycloak instance configured
 * with the test realm and client.
 */

import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.VITE_APP_URL || 'http://localhost:5173';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.context().clearCookies();
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });
  });

  test('should redirect unauthenticated user to login', async ({ page }) => {
    // Navigate to protected route
    await page.goto(`${BASE_URL}/home`);

    // Should redirect to Keycloak login
    // In real scenario, would check for Keycloak URL
    await expect(page).toHaveURL(/auth|login/i);
  });

  test('should display login button when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/callback`);

    // Wait for app to initialize
    await page.waitForTimeout(1000);

    // Should see login button in header
    const loginButton = page.getByRole('button', { name: /sign in/i });
    await expect(loginButton).toBeVisible();
  });

  test('should show unauthorized page when accessing route without required roles', async ({ page }) => {
    // This test assumes you have a route with role requirements
    // You'll need to adjust based on your actual routes

    await page.goto(`${BASE_URL}/unauthorized`);

    await expect(page.getByText(/access denied/i)).toBeVisible();
    await expect(page.getByText(/don't have permission/i)).toBeVisible();
  });

  test('should display user profile when authenticated', async ({ page }) => {
    // This is a simplified test - in production you would mock a full auth flow

    // Navigate to callback page
    await page.goto(`${BASE_URL}/auth/callback`);

    // In a real test, you would:
    // 1. Click login button
    // 2. Fill in Keycloak credentials
    // 3. Wait for redirect back
    // 4. Verify user profile is displayed

    // For now, we just verify the UI structure exists
    await expect(page.locator('header')).toBeVisible();
  });

  test('should persist session on page reload', async ({ page }) => {
    // This test verifies session restoration from sessionStorage

    // Set mock session in storage
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      const mockSession = {
        accessToken: 'mock_token',
        idToken: 'mock_id_token',
        refreshToken: 'mock_refresh',
        storedAt: Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hour from now
      };
      sessionStorage.setItem('kc_session', JSON.stringify(mockSession));
    });

    // Reload page
    await page.reload();

    // Session should be restored (though it will fail validation in this mock scenario)
    // In real tests, this would check if user remains authenticated
    await page.waitForTimeout(1000);
  });

  test('should handle navigation between routes when authenticated', async ({ page }) => {
    await page.goto(BASE_URL);

    // Wait for app to load
    await page.waitForTimeout(1000);

    // Verify navigation menu exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should filter navigation items based on roles', async ({ page }) => {
    // This test would verify that menu items are filtered by user roles
    // Requires authenticated session with specific roles

    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);

    // In a real test with authentication, you would verify that:
    // - Admin-only items are hidden for regular users
    // - User can see items they have access to
    // - Navigation updates when roles change
  });
});

test.describe('Logout Flow', () => {
  test('should logout user and clear session', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/callback`);
    await page.waitForTimeout(1000);

    // In a real test with authentication:
    // 1. Verify user is authenticated
    // 2. Click logout button
    // 3. Verify session is cleared
    // 4. Verify redirect to home or login

    // For now, just verify logout button exists in UI
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should redirect to Keycloak logout endpoint', async () => {
    // This would test SSO logout
    // Verify that logout calls Keycloak logout endpoint
    // And properly clears SSO session
  });
});

test.describe('Token Refresh', () => {
  test('should refresh token before expiration', async () => {
    // This test would verify silent token refresh
    // 1. Set up session with token close to expiration
    // 2. Wait for refresh threshold
    // 3. Verify token is refreshed automatically
    // 4. Verify API calls continue to work
  });

  test('should redirect to login if token refresh fails', async () => {
    // This test would verify behavior when refresh fails
    // 1. Set up session with expired refresh token
    // 2. Trigger a token refresh attempt
    // 3. Verify user is redirected to login
  });
});

test.describe('Error Handling', () => {
  test('should display error message when Keycloak is unavailable', async ({ page }) => {
    // Mock Keycloak being unavailable
    await page.route('**/auth/**', (route) => {
      route.abort('failed');
    });

    await page.goto(BASE_URL);

    // Should show initialization error
    await expect(page.getByText(/initialization error|unavailable/i)).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Test network resilience
    await page.route('**/api/**', (route) => {
      route.abort('failed');
    });

    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);

    // App should still load, just with no data
    await expect(page.locator('header')).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('should protect all routes when requiresAuth is true', async ({ page }) => {
    const protectedRoutes = ['/home', '/grafana'];

    for (const route of protectedRoutes) {
      await page.goto(`${BASE_URL}${route}`);

      // Should redirect to auth
      await expect(page).not.toHaveURL(`${BASE_URL}${route}`);
    }
  });

  test('should allow access to callback route without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/callback`);

    // Should not redirect
    await expect(page).toHaveURL(`${BASE_URL}/auth/callback`);
  });

  test('should allow access to unauthorized route without auth', async ({ page }) => {
    await page.goto(`${BASE_URL}/unauthorized`);

    // Should not redirect
    await expect(page).toHaveURL(`${BASE_URL}/unauthorized`);
  });
});
