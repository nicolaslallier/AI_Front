/**
 * Authentication route guard
 *
 * Global navigation guard that protects routes requiring authentication.
 * Redirects unauthenticated users to Keycloak login and stores intended
 * destination for post-login redirect.
 *
 * Implements FR-FE-KC-010 (route protection).
 */

import { useAuthStore } from '../auth-store';
import { getRequiredRoles, requiresAuth } from '../use-auth';

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { Logger } from '@/shared/utils/logger';

/**
 * Session storage key for storing intended route before login
 */
const INTENDED_ROUTE_KEY = 'intended_route';

/**
 * Authentication guard function
 *
 * Checks if route requires authentication and verifies user is authenticated.
 * If not authenticated, stores intended route and initiates login flow.
 *
 * @param to - Target route
 * @param from - Source route
 * @param next - Navigation callback
 *
 * @example
 * // In router configuration
 * router.beforeEach(authGuard);
 */
export async function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const authStore = useAuthStore();

  // Allow access to auth callback route (needed for login redirect)
  if (to.path === '/auth/callback') {
    next();
    return;
  }

  // Allow access to unauthorized page
  if (to.path === '/unauthorized') {
    next();
    return;
  }

  // Check if route requires authentication
  const routeRequiresAuth = requiresAuth(to.meta);

  if (!routeRequiresAuth) {
    // Route is public, allow access
    next();
    return;
  }

  // Wait for auth initialization if needed
  if (authStore.isInitializing) {
    Logger.info('Auth guard: Waiting for authentication initialization...');
    // In a real implementation, you might want to wait for initialization
    // For now, we'll proceed and check authentication status
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    Logger.info('Auth guard: User not authenticated, storing intended route and redirecting to login', {
      intendedRoute: to.fullPath,
    });

    // Store intended route for post-login redirect
    storeIntendedRoute(to.fullPath);

    // Initiate login flow
    try {
      await authStore.login();
      // Login will redirect to Keycloak, so this code won't execute
    } catch (error) {
      Logger.error('Auth guard: Login initiation failed', error);
      next('/unauthorized');
    }

    return;
  }

  // User is authenticated, check role requirements if any
  const requiredRoles = getRequiredRoles(to.meta);

  if (requiredRoles.length > 0) {
    // Route requires specific roles, delegate to role guard
    // The role guard will be checked after this guard
    next();
    return;
  }

  // User is authenticated and no role requirements, allow access
  Logger.info('Auth guard: Access granted', {
    user: authStore.username,
    route: to.path,
  });

  next();
}

/**
 * Stores the intended route in session storage
 *
 * @param route - Full path of the intended route
 */
export function storeIntendedRoute(route: string): void {
  try {
    sessionStorage.setItem(INTENDED_ROUTE_KEY, route);
  } catch (error) {
    Logger.error('Failed to store intended route', error);
  }
}

/**
 * Retrieves and clears the intended route from session storage
 *
 * @returns Intended route path or null if not set
 */
export function getAndClearIntendedRoute(): string | null {
  try {
    const route = sessionStorage.getItem(INTENDED_ROUTE_KEY);

    if (route) {
      sessionStorage.removeItem(INTENDED_ROUTE_KEY);
      return route;
    }

    return null;
  } catch (error) {
    Logger.error('Failed to retrieve intended route', error);
    return null;
  }
}
