/**
 * Authentication state management store
 *
 * Pinia store that manages global authentication state, user profile, and roles.
 * Coordinates with the Keycloak service for all authentication operations.
 *
 * Implements FR-FE-KC-002, FR-FE-KC-008, and state management requirements.
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
  emitErrorEvent,
  emitLoginEvent,
  emitLogoutEvent,
  emitSessionExpiredEvent,
  emitTokenRefreshEvent,
} from './auth-events';
import { getErrorMessage } from './errors';
import { keycloakService } from './keycloak-service';
import { AuthStatus } from './types';

import type { UserProfile } from './types';

import { Logger } from '@/shared/utils/logger';

/**
 * Authentication store
 *
 * Centralized state management for authentication following SOLID principles.
 * Provides reactive state and actions for all auth operations.
 */
// eslint-disable-next-line max-lines-per-function -- Store setup requires many lines for all actions/getters
export const useAuthStore = defineStore('auth', () => {
  // ===========================
  // State
  // ===========================

  /**
   * Current authentication status
   */
  const status = ref<AuthStatus>(AuthStatus.INITIALIZING);

  /**
   * Current authenticated user profile
   */
  const user = ref<UserProfile | null>(null);

  /**
   * User roles array (cached from user profile)
   */
  const roles = ref<string[]>([]);

  /**
   * Authentication error message
   */
  const error = ref<string | null>(null);

  /**
   * Loading state for async operations
   */
  const loading = ref<boolean>(false);

  /**
   * Timestamp of last successful authentication
   */
  const lastAuthenticated = ref<number | null>(null);

  // ===========================
  // Getters
  // ===========================

  /**
   * Checks if user is authenticated
   */
  const isAuthenticated = computed<boolean>(() => {
    return status.value === AuthStatus.AUTHENTICATED && user.value !== null;
  });

  /**
   * Checks if authentication is in progress
   */
  const isAuthenticating = computed<boolean>(() => {
    return status.value === AuthStatus.AUTHENTICATING;
  });

  /**
   * Checks if authentication is initializing
   */
  const isInitializing = computed<boolean>(() => {
    return status.value === AuthStatus.INITIALIZING;
  });

  /**
   * Checks if there's an authentication error
   */
  const hasError = computed<boolean>(() => {
    return status.value === AuthStatus.ERROR && error.value !== null;
  });

  /**
   * Gets the current user's username
   */
  const username = computed<string>(() => {
    return user.value?.preferredUsername || '';
  });

  /**
   * Gets the current user's email
   */
  const email = computed<string | undefined>(() => {
    return user.value?.email;
  });

  /**
   * Gets the current user's full name
   */
  const fullName = computed<string | undefined>(() => {
    return user.value?.name;
  });

  // ===========================
  // Actions
  // ===========================

  /**
   * Initializes the authentication system
   *
   * Checks for existing session and restores user state if available.
   * Implements FR-FE-KC-002.
   *
   * @returns Promise resolving to true if user is authenticated
   */
  async function initialize(): Promise<boolean> {
    try {
      status.value = AuthStatus.INITIALIZING;
      loading.value = true;
      error.value = null;

      Logger.info('Initializing authentication...');

      const authenticated = await keycloakService.initialize();

      if (authenticated) {
        await loadUserProfile();
        status.value = AuthStatus.AUTHENTICATED;
        lastAuthenticated.value = Date.now();

        Logger.info('Authentication initialized - user authenticated', {
          username: user.value?.preferredUsername,
        });

        emitLoginEvent(user.value || undefined);
      } else {
        status.value = AuthStatus.UNAUTHENTICATED;
        user.value = null;
        roles.value = [];

        Logger.info('Authentication initialized - user not authenticated');
      }

      return authenticated;
    } catch (err) {
      const message = getErrorMessage(err);
      error.value = message;
      status.value = AuthStatus.ERROR;
      user.value = null;
      roles.value = [];

      Logger.error('Authentication initialization failed', err);
      emitErrorEvent(message);

      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Logs in the user by redirecting to Keycloak
   *
   * Implements FR-FE-KC-003.
   *
   * @param redirectUri - Optional redirect URI after login
   */
  async function login(redirectUri?: string): Promise<void> {
    try {
      status.value = AuthStatus.AUTHENTICATING;
      loading.value = true;
      error.value = null;

      Logger.info('Starting login flow...');

      await keycloakService.login({ redirectUri });

      // Note: This code won't execute as login redirects the page
    } catch (err) {
      const message = getErrorMessage(err);
      error.value = message;
      status.value = AuthStatus.ERROR;

      Logger.error('Login failed', err);
      emitErrorEvent(message);

      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Logs out the user
   *
   * Clears local state and redirects to Keycloak logout.
   * Implements FR-FE-KC-004.
   *
   * @param redirectUri - Optional redirect URI after logout
   */
  async function logout(redirectUri?: string): Promise<void> {
    try {
      loading.value = true;

      Logger.info('Starting logout flow...');

      // Clear local state immediately
      status.value = AuthStatus.UNAUTHENTICATED;
      user.value = null;
      roles.value = [];
      error.value = null;
      lastAuthenticated.value = null;

      emitLogoutEvent();

      // Redirect to Keycloak logout
      await keycloakService.logout({ redirectUri });

      // Note: This code won't execute as logout redirects the page
    } catch (err) {
      Logger.error('Logout failed', err);
      // Even if logout fails, we've cleared local state
    } finally {
      loading.value = false;
    }
  }

  /**
   * Loads the user profile from Keycloak token
   *
   * Extracts user info and roles from token claims.
   * Implements FR-FE-KC-008 and DATA-FE-KC-001.
   */
  async function loadUserProfile(): Promise<void> {
    const profile = keycloakService.getUserProfile();

    if (profile) {
      user.value = profile;
      roles.value = profile.roles;

      Logger.info('User profile loaded', {
        username: profile.preferredUsername,
        roles: profile.roles,
      });
    } else {
      user.value = null;
      roles.value = [];
    }
  }

  /**
   * Refreshes the access token
   *
   * Implements FR-FE-KC-007 (silent refresh).
   *
   * @returns Promise resolving to true if refresh succeeded
   */
  async function refreshToken(): Promise<boolean> {
    try {
      loading.value = true;

      const refreshed = await keycloakService.refreshToken();

      if (refreshed) {
        // Reload user profile in case roles changed
        await loadUserProfile();
        lastAuthenticated.value = Date.now();

        Logger.info('Token refreshed successfully');
        emitTokenRefreshEvent();
      }

      return refreshed;
    } catch (err) {
      const message = getErrorMessage(err);
      error.value = message;

      Logger.error('Token refresh failed', err);
      emitErrorEvent(message);

      // Session expired, user needs to re-authenticate
      status.value = AuthStatus.UNAUTHENTICATED;
      user.value = null;
      roles.value = [];
      emitSessionExpiredEvent();

      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Gets the current access token
   *
   * Automatically refreshes if token is about to expire.
   *
   * @returns Promise resolving to access token or null
   */
  async function getAccessToken(): Promise<string | null> {
    try {
      return await keycloakService.getToken();
    } catch (err) {
      Logger.error('Failed to get access token', err);
      return null;
    }
  }

  /**
   * Checks if user has a specific role
   *
   * Implements FR-FE-KC-009 (role-based UI control).
   *
   * @param role - Role to check
   * @returns True if user has the role
   */
  function hasRole(role: string): boolean {
    return roles.value.includes(role);
  }

  /**
   * Checks if user has any of the specified roles
   *
   * Implements FR-FE-KC-009 (role-based UI control).
   *
   * @param requiredRoles - Array of roles to check
   * @returns True if user has at least one role
   */
  function hasAnyRole(requiredRoles: string[]): boolean {
    if (requiredRoles.length === 0) {
      return true;
    }
    return requiredRoles.some((role) => hasRole(role));
  }

  /**
   * Checks if user has all of the specified roles
   *
   * Implements FR-FE-KC-009 (role-based UI control).
   *
   * @param requiredRoles - Array of roles to check
   * @returns True if user has all roles
   */
  function hasAllRoles(requiredRoles: string[]): boolean {
    if (requiredRoles.length === 0) {
      return true;
    }
    return requiredRoles.every((role) => hasRole(role));
  }

  /**
   * Checks if the current session is valid
   *
   * @returns True if user is authenticated with valid session
   */
  function isSessionValid(): boolean {
    return isAuthenticated.value && keycloakService.isAuthenticated();
  }

  /**
   * Gets the time remaining until token expiration (in seconds)
   *
   * @returns Seconds until expiration, or 0 if not authenticated
   */
  function getTokenExpiresIn(): number {
    return keycloakService.getTokenExpiresIn();
  }

  /**
   * Clears any authentication errors
   */
  function clearError(): void {
    error.value = null;
  }

  /**
   * Resets the authentication state
   *
   * Used for cleanup and testing.
   */
  function reset(): void {
    status.value = AuthStatus.UNAUTHENTICATED;
    user.value = null;
    roles.value = [];
    error.value = null;
    loading.value = false;
    lastAuthenticated.value = null;
  }

  // ===========================
  // Return public API
  // ===========================

  return {
    // State
    status,
    user,
    roles,
    error,
    loading,
    lastAuthenticated,

    // Getters
    isAuthenticated,
    isAuthenticating,
    isInitializing,
    hasError,
    username,
    email,
    fullName,

    // Actions
    initialize,
    login,
    logout,
    loadUserProfile,
    refreshToken,
    getAccessToken,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isSessionValid,
    getTokenExpiresIn,
    clearError,
    reset,
  };
});
