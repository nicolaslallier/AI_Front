/**
 * Authentication composable
 *
 * Provides a clean abstraction layer over the auth store following the
 * Interface Segregation Principle (ISP). Exposes only the necessary
 * authentication functionality to components.
 *
 * This composable can be used in any Vue component to access auth state
 * and perform auth operations.
 *
 * Implements FR-FE-KC-009 and FR-FE-KC-010 requirements.
 */

import { computed, type ComputedRef } from 'vue';

import { useAuthStore } from './auth-store';
import { AuthStatus } from './types';

import type { UserProfile } from './types';

/**
 * Authentication composable interface
 *
 * Provides reactive authentication state and actions
 */
export interface UseAuthReturn {
  // State
  isAuthenticated: ComputedRef<boolean>;
  isAuthenticating: ComputedRef<boolean>;
  isInitializing: ComputedRef<boolean>;
  hasError: ComputedRef<boolean>;
  loading: ComputedRef<boolean>;
  error: ComputedRef<string | null>;
  user: ComputedRef<UserProfile | null>;
  roles: ComputedRef<string[]>;
  username: ComputedRef<string>;
  email: ComputedRef<string | undefined>;
  status: ComputedRef<AuthStatus>;

  // Actions
  login: (redirectUri?: string) => Promise<void>;
  logout: (redirectUri?: string) => Promise<void>;
  refreshToken: () => Promise<boolean>;
  getAccessToken: () => Promise<string | null>;

  // Role checking
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;

  // Utilities
  requireAuth: () => boolean;
  getTokenExpiresIn: () => number;
  clearError: () => void;
}

/**
 * Use authentication composable
 *
 * Provides reactive access to authentication state and operations.
 * This is the primary interface components should use for authentication.
 *
 * @returns Authentication interface with reactive state and actions
 *
 * @example
 * // In a component
 * import { useAuth } from '@/core/auth';
 *
 * export default defineComponent({
 *   setup() {
 *     const auth = useAuth();
 *
 *     return {
 *       auth,
 *     };
 *   },
 * });
 *
 * @example
 * // Check authentication in component
 * const auth = useAuth();
 * if (auth.isAuthenticated.value) {
 *   // User is logged in
 * }
 *
 * @example
 * // Check roles
 * const auth = useAuth();
 * if (auth.hasRole('ROLE_ADMIN')) {
 *   // User has admin role
 * }
 */
// eslint-disable-next-line max-lines-per-function -- Composable requires many reactive properties
export function useAuth(): UseAuthReturn {
  const authStore = useAuthStore();

  // ===========================
  // Reactive state (computed refs)
  // ===========================

  const isAuthenticated = computed<boolean>(() => authStore.isAuthenticated);
  const isAuthenticating = computed<boolean>(() => authStore.isAuthenticating);
  const isInitializing = computed<boolean>(() => authStore.isInitializing);
  const hasError = computed<boolean>(() => authStore.hasError);
  const loading = computed<boolean>(() => authStore.loading);
  const error = computed<string | null>(() => authStore.error);
  const user = computed<UserProfile | null>(() => authStore.user);
  const roles = computed<string[]>(() => authStore.roles);
  const username = computed<string>(() => authStore.username);
  const email = computed<string | undefined>(() => authStore.email);
  const status = computed<AuthStatus>(() => authStore.status);

  // ===========================
  // Actions
  // ===========================

  /**
   * Initiates login flow
   *
   * @param redirectUri - Optional redirect URI after login
   */
  async function login(redirectUri?: string): Promise<void> {
    return authStore.login(redirectUri);
  }

  /**
   * Logs out the user
   *
   * @param redirectUri - Optional redirect URI after logout
   */
  async function logout(redirectUri?: string): Promise<void> {
    return authStore.logout(redirectUri);
  }

  /**
   * Refreshes the access token
   *
   * @returns Promise resolving to true if refresh succeeded
   */
  async function refreshToken(): Promise<boolean> {
    return authStore.refreshToken();
  }

  /**
   * Gets the current access token
   *
   * @returns Promise resolving to access token or null
   */
  async function getAccessToken(): Promise<string | null> {
    return authStore.getAccessToken();
  }

  // ===========================
  // Role checking functions
  // ===========================

  /**
   * Checks if user has a specific role
   *
   * @param role - Role to check
   * @returns True if user has the role
   */
  function hasRole(role: string): boolean {
    return authStore.hasRole(role);
  }

  /**
   * Checks if user has any of the specified roles
   *
   * @param requiredRoles - Array of roles to check
   * @returns True if user has at least one role
   */
  function hasAnyRole(requiredRoles: string[]): boolean {
    return authStore.hasAnyRole(requiredRoles);
  }

  /**
   * Checks if user has all of the specified roles
   *
   * @param requiredRoles - Array of roles to check
   * @returns True if user has all roles
   */
  function hasAllRoles(requiredRoles: string[]): boolean {
    return authStore.hasAllRoles(requiredRoles);
  }

  // ===========================
  // Utility functions
  // ===========================

  /**
   * Ensures user is authenticated
   *
   * Can be used to guard component logic that requires authentication.
   *
   * @returns True if user is authenticated
   * @throws {Error} If user is not authenticated (in development)
   *
   * @example
   * const auth = useAuth();
   * if (!auth.requireAuth()) {
   *   return; // Exit early if not authenticated
   * }
   * // Continue with authenticated logic
   */
  function requireAuth(): boolean {
    const authenticated = authStore.isAuthenticated;

    if (!authenticated && import.meta.env.DEV) {
      console.warn('Authentication required but user is not authenticated');
    }

    return authenticated;
  }

  /**
   * Gets the time remaining until token expiration (in seconds)
   *
   * @returns Seconds until expiration, or 0 if not authenticated
   */
  function getTokenExpiresIn(): number {
    return authStore.getTokenExpiresIn();
  }

  /**
   * Clears any authentication errors
   */
  function clearError(): void {
    authStore.clearError();
  }

  // ===========================
  // Return public interface
  // ===========================

  return {
    // State
    isAuthenticated,
    isAuthenticating,
    isInitializing,
    hasError,
    loading,
    error,
    user,
    roles,
    username,
    email,
    status,

    // Actions
    login,
    logout,
    refreshToken,
    getAccessToken,

    // Role checking
    hasRole,
    hasAnyRole,
    hasAllRoles,

    // Utilities
    requireAuth,
    getTokenExpiresIn,
    clearError,
  };
}

/**
 * Helper function to check if a route requires authentication
 *
 * Can be used in navigation guards or component logic.
 *
 * @param routeMeta - Route meta object
 * @returns True if route requires authentication
 */
export function requiresAuth(routeMeta: Record<string, unknown>): boolean {
  return routeMeta.requiresAuth === true;
}

/**
 * Helper function to get required roles from route meta
 *
 * @param routeMeta - Route meta object
 * @returns Array of required roles, or empty array if none
 */
export function getRequiredRoles(routeMeta: Record<string, unknown>): string[] {
  const roles = routeMeta.requiredRoles;

  if (Array.isArray(roles)) {
    return roles as string[];
  }

  if (typeof roles === 'string') {
    return [roles];
  }

  return [];
}
