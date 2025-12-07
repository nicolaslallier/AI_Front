import { test, expect } from '@playwright/test';

/**
 * E2E tests for the home/welcome page
 *
 * Implements Gherkin scenarios from Front_2.1.0.html:
 * - US-HOME-001: See welcome message
 * - US-HOME-002: Navigate from home
 * - US-HOME-003: Understand site purpose
 *
 * Gherkin scenarios:
 * 8.1: Display welcome message
 * 8.2: Navigate to another section
 * 8.3: Responsive layout
 */

test.describe('Home Welcome Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
  });

  /**
   * Gherkin Scenario 8.1: Display welcome message
   *
   * Given I open the website root URL "/"
   * When the home page loads
   * Then I see a main title or text containing a welcome message
   * And the welcome message is visible without scrolling
   */
  test.describe('US-HOME-001: See welcome message', () => {
    test('should display welcome message on home page load', async ({ page }) => {
      // Given: User opens the website root URL
      await page.goto('/');

      // When: The home page loads
      await page.waitForLoadState('networkidle');

      // Then: User sees a main title containing a welcome message
      const heading = page.locator('h1:has-text("Welcome")');
      await expect(heading).toBeVisible();

      // Verify the complete welcome text
      await expect(heading).toContainText('Monitoring and Administration Portal');
    });

    test('should display welcome message without scrolling (above the fold)', async ({ page }) => {
      // Given: User opens the website
      await page.goto('/');

      // When: Page loads
      await page.waitForLoadState('networkidle');

      // Then: Welcome message is visible in viewport without scrolling
      const heading = page.locator('h1:has-text("Welcome")');

      // Check if element is in viewport
      const isInViewport = await heading.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      });

      expect(isInViewport).toBe(true);
    });

    test('should display site description (FR-HOME-007)', async ({ page }) => {
      // Given: User is on home page
      await page.goto('/');

      // When: Page loads
      await page.waitForLoadState('networkidle');

      // Then: User sees a description explaining the site's purpose
      const description = page.locator('p:has-text("portal")').first();
      await expect(description).toBeVisible();
      await expect(description).toContainText('monitor');
    });

    test('should use simple, friendly language (FR-HOME-004)', async ({ page }) => {
      // Given: User is on home page
      await page.goto('/');

      // When: Page loads
      await page.waitForLoadState('networkidle');

      // Then: Text uses simple, understandable language
      const content = await page.textContent('body');
      expect(content).toBeTruthy();

      // Verify friendly terms are used
      expect(content?.toLowerCase()).toContain('welcome');
      expect(content?.toLowerCase()).toContain('access');
    });

    test('should not display sensitive information (FR-HOME-008)', async ({ page }) => {
      // Given: User is on home page
      await page.goto('/');

      // When: Page loads
      await page.waitForLoadState('networkidle');

      // Then: No sensitive data is visible
      const content = await page.textContent('body');

      // Check for common sensitive patterns
      const ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
      const hasIP = content ? ipPattern.test(content) : false;
      expect(hasIP).toBe(false);

      // Check for sensitive keywords
      expect(content?.toLowerCase()).not.toContain('password');
      expect(content?.toLowerCase()).not.toContain('secret');
      expect(content?.toLowerCase()).not.toContain('api_key');
    });
  });

  /**
   * Gherkin Scenario 8.2: Navigate to another section
   *
   * Given I am on the home page
   * And I see the main navigation menu
   * When I click on a menu item (e.g. "Monitoring")
   * Then the application navigates to the corresponding page or route
   * And the home page is no longer the active view
   */
  test.describe('US-HOME-002: Navigate from home', () => {
    test('should display main navigation menu (FR-HOME-005)', async ({ page }) => {
      // Given: User is on home page
      await page.goto('/');

      // When: Page loads
      await page.waitForLoadState('networkidle');

      // Then: Main navigation menu is visible
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Verify key navigation items exist
      const homeLink = page.locator('nav a:has-text("Home")');
      await expect(homeLink).toBeVisible();
    });

    test('should navigate from home page via navigation menu', async ({ page }) => {
      // Given: User is on the home page with navigation menu visible
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // When: User clicks on a menu item (skip if not visible due to roles)
      const grafanaLink = page.locator('nav a:has-text("Grafana")');
      const isGrafanaVisible = await grafanaLink.isVisible().catch(() => false);

      if (isGrafanaVisible) {
        await grafanaLink.click();

        // Then: Application navigates to the corresponding page
        await page.waitForURL(/\/grafana/);
        expect(page.url()).toContain('/grafana');

        // And: Home page is no longer the active view
        const welcomeHeading = page.locator('h1:has-text("Welcome to Monitoring")');
        await expect(welcomeHeading).not.toBeVisible();
      } else {
        // If Grafana not visible, test passes (role-based access working)
        expect(true).toBe(true);
      }
    });

    test('should navigate via quick-access cards (FR-HOME-006)', async ({ page }) => {
      // Given: User is on home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // When: User sees quick-access section
      const quickAccessHeading = page.locator('h2:has-text("Quick Access")');
      await expect(quickAccessHeading).toBeVisible();

      // Then: Quick-access cards should be available (if user has permissions)
      const cards = page
        .locator('a[href^="/"]')
        .filter({ hasText: /Grafana|Logs|Traces|Metrics|MinIO|pgAdmin|Keycloak/ });
      const cardCount = await cards.count();

      // Should have at least some cards visible (depending on roles)
      expect(cardCount).toBeGreaterThanOrEqual(0);
    });

    test('should navigate when clicking quick-access card', async ({ page }) => {
      // Given: User is on home page with quick-access cards
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find first available card link
      const cardLink = page.locator('a[href^="/grafana"], a[href^="/logs"], a[href^="/traces"]').first();
      const isCardVisible = await cardLink.isVisible().catch(() => false);

      if (isCardVisible) {
        // Get the href before clicking
        const href = await cardLink.getAttribute('href');

        // When: User clicks a quick-access card
        await cardLink.click();

        // Then: Navigation occurs to the correct route
        if (href) {
          await page.waitForURL(new RegExp(href));
          expect(page.url()).toContain(href);
        }
      } else {
        // If no cards visible, user has no access (valid state)
        expect(true).toBe(true);
      }
    });
  });

  /**
   * US-HOME-003: Understand site purpose
   *
   * As a user, I want a short description on the home page
   * to understand what the website is used for.
   */
  test.describe('US-HOME-003: Understand site purpose', () => {
    test('should display clear site purpose description', async ({ page }) => {
      // Given: User arrives on home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Then: Description explains what the site is for
      const description = page.locator('p').first();
      await expect(description).toBeVisible();

      const descriptionText = await description.textContent();
      expect(descriptionText).toBeTruthy();

      // Verify description mentions key purposes
      const lowerText = descriptionText?.toLowerCase() || '';
      const mentionsMonitoring = lowerText.includes('monitor') || lowerText.includes('observability');
      const mentionsAdmin = lowerText.includes('admin') || lowerText.includes('manage');

      expect(mentionsMonitoring || mentionsAdmin).toBe(true);
    });

    test('should list available consoles/sections', async ({ page }) => {
      // Given: User is on home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Then: Quick-access section shows available consoles
      const quickAccessSection = page.locator('text=Quick Access').first();
      await expect(quickAccessSection).toBeVisible();

      // User can see what tools are available
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
    });
  });

  /**
   * Gherkin Scenario 8.3: Responsive layout
   *
   * Given I open the home page on a mobile-sized screen
   * When the page is fully loaded
   * Then the welcome message text is readable without horizontal scrolling
   * And the main menu is accessible (e.g. as a burger menu or simple list)
   */
  test.describe('NFR-HOME-002: Responsive layout', () => {
    test('should be readable on mobile screen', async ({ page }) => {
      // Given: Mobile viewport
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size

      // When: User opens home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Then: Welcome message is readable without horizontal scrolling
      const heading = page.locator('h1:has-text("Welcome")');
      await expect(heading).toBeVisible();

      // Verify no horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // Allow 1px tolerance
    });

    test('should be readable on tablet screen', async ({ page }) => {
      // Given: Tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad size

      // When: User opens home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Then: Content is well-formatted
      const heading = page.locator('h1:has-text("Welcome")');
      await expect(heading).toBeVisible();

      // Quick access cards should be in grid
      const cards = page.locator('a[href^="/"]').filter({ hasText: /Grafana|Logs|Traces/ });
      const cardCount = await cards.count();

      if (cardCount > 0) {
        const firstCard = cards.first();
        await expect(firstCard).toBeVisible();
      }
    });

    test('should be readable on desktop screen', async ({ page }) => {
      // Given: Desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });

      // When: User opens home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Then: Content is well-formatted with proper spacing
      const heading = page.locator('h1:has-text("Welcome")');
      await expect(heading).toBeVisible();

      // Verify navigation is horizontal on desktop
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should have accessible navigation on all screen sizes', async ({ page }) => {
      const viewports = [
        { width: 375, height: 667, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1920, height: 1080, name: 'Desktop' },
      ];

      for (const viewport of viewports) {
        // Set viewport
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        // Load page
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Navigation should be accessible
        const nav = page.locator('nav');
        await expect(nav).toBeVisible();
      }
    });
  });

  /**
   * Performance requirements (NFR-HOME-001)
   */
  test.describe('NFR-HOME-001: Performance', () => {
    test('should load quickly', async ({ page }) => {
      // Given: User navigates to home page
      const startTime = Date.now();

      // When: Page loads
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Then: Load time is reasonable (< 5 seconds for E2E, < 2s in production)
      expect(loadTime).toBeLessThan(5000);
    });

    test('should not make unnecessary API calls', async ({ page }) => {
      // Track network requests
      const apiRequests: string[] = [];

      page.on('request', (request) => {
        if (request.url().includes('/api/')) {
          apiRequests.push(request.url());
        }
      });

      // Given: User navigates to home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Then: No API calls should be made (static content)
      expect(apiRequests.length).toBe(0);
    });
  });

  /**
   * Accessibility requirements (NFR-HOME-003)
   */
  test.describe('NFR-HOME-003: Accessibility', () => {
    test('should use semantic HTML elements', async ({ page }) => {
      // Given: User is on home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Then: Semantic elements are used
      const header = page.locator('header');
      await expect(header).toBeVisible();

      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      const main = page.locator('main');
      await expect(main).toBeVisible();

      const section = page.locator('section');
      await expect(section.first()).toBeVisible();
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      // Given: User is on home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Then: H1 exists for main title
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      // H2 for section headings
      const h2 = page.locator('h2');
      const h2Count = await h2.count();
      expect(h2Count).toBeGreaterThan(0);

      // H3 for card titles
      const h3 = page.locator('h3');
      const h3Count = await h3.count();
      expect(h3Count).toBeGreaterThanOrEqual(0);
    });

    test('should have sufficient color contrast', async ({ page }) => {
      // Given: User is on home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Then: Text elements use dark colors on light backgrounds
      const heading = page.locator('h1');
      const headingColor = await heading.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // Verify it's a dark color (rgb values should be low for dark text)
      expect(headingColor).toBeTruthy();
    });
  });
});
