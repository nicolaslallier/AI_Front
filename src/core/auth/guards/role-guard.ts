/**
 * Role-based authorization guard
 *
 * Navigation guard that checks if the authenticated user has the required
 * roles to access a route. Redirects to unauthorized page if user lacks
 * necessary permissions.
 *
 * Implements FR-FE-KC-009 (role-based access control).
 */

import { useAuthStore } from '../auth-store';
import { RoleMatchMode } from '../types';
import { getRequiredRoles } from '../use-auth';

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { Logger } from '@/shared/utils/logger';

/**
 * Role guard function
 *
 * Checks if authenticated user has required roles for the route.
 * Should be used after authGuard to ensure user is authenticated.
 *
 * @param to - Target route
 * @param from - Source route
 * @param next - Navigation callback
 *
 * @example
 * // In router configuration
 * router.beforeEach(authGuard);
 * router.beforeEach(roleGuard);
 */
export function roleGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const authStore = useAuthStore();

  // Skip role check for public routes and auth-related routes
  if (to.path === '/auth/callback' || to.path === '/unauthorized') {
    next();
    return;
  }

  // Get required roles from route meta
  const requiredRoles = getRequiredRoles(to.meta);

  // No role requirements, allow access
  if (requiredRoles.length === 0) {
    next();
    return;
  }

  // User must be authenticated to check roles (auth guard should have handled this)
  if (!authStore.isAuthenticated) {
    Logger.warn('Role guard: User not authenticated, should have been caught by auth guard');
    next('/unauthorized');
    return;
  }

  // Determine role match mode (default to ANY)
  const matchMode = (to.meta.roleMatchMode as RoleMatchMode) || RoleMatchMode.ANY;

  // Check if user has required roles
  const hasRequiredRoles =
    matchMode === RoleMatchMode.ALL ? authStore.hasAllRoles(requiredRoles) : authStore.hasAnyRole(requiredRoles);

  if (!hasRequiredRoles) {
    Logger.warn('Role guard: User lacks required roles', {
      user: authStore.username,
      userRoles: authStore.roles,
      requiredRoles,
      matchMode,
      route: to.path,
    });

    // Store error info in route params for unauthorized page to display
    next({
      path: '/unauthorized',
      query: {
        from: to.path,
        required: requiredRoles.join(','),
      },
    });

    return;
  }

  // User has required roles, allow access
  Logger.info('Role guard: Access granted', {
    user: authStore.username,
    userRoles: authStore.roles,
    requiredRoles,
    route: to.path,
  });

  next();
}

/**
 * Creates a route-specific role guard
 *
 * Useful for creating role guards for specific routes inline.
 *
 * @param requiredRoles - Array of roles required
 * @param matchMode - How to match roles (ALL or ANY)
 * @returns Navigation guard function
 *
 * @example
 * // In route definition
 * {
 *   path: '/admin',
 *   component: AdminView,
 *   beforeEnter: createRoleGuard(['ROLE_ADMIN'], RoleMatchMode.ALL),
 * }
 */
export function createRoleGuard(requiredRoles: string[], matchMode: RoleMatchMode = RoleMatchMode.ANY) {
  return (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext): void => {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
      next('/unauthorized');
      return;
    }

    const hasRequiredRoles =
      matchMode === RoleMatchMode.ALL ? authStore.hasAllRoles(requiredRoles) : authStore.hasAnyRole(requiredRoles);

    if (!hasRequiredRoles) {
      Logger.warn('Inline role guard: User lacks required roles', {
        user: authStore.username,
        userRoles: authStore.roles,
        requiredRoles,
        matchMode,
      });

      next({
        path: '/unauthorized',
        query: {
          from: to.path,
          required: requiredRoles.join(','),
        },
      });

      return;
    }

    next();
  };
}
