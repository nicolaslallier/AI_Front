/**
 * useAuth composable unit tests
 */

import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';

import { useAuthStore } from './auth-store';
import { AuthStatus } from './types';
import { useAuth, requiresAuth, getRequiredRoles } from './use-auth';

describe('useAuth composable', () => {
  beforeEach(() => {
    // Create fresh Pinia instance for each test
    setActivePinia(createPinia());
  });

  describe('reactive state', () => {
    it('should expose authentication state', () => {
      const auth = useAuth();

      expect(auth.isAuthenticated).toBeDefined();
      expect(auth.isAuthenticating).toBeDefined();
      expect(auth.isInitializing).toBeDefined();
      expect(auth.loading).toBeDefined();
      expect(auth.error).toBeDefined();
      expect(auth.user).toBeDefined();
      expect(auth.roles).toBeDefined();
      expect(auth.username).toBeDefined();
    });

    it('should reflect store state', () => {
      const authStore = useAuthStore();
      authStore.status = AuthStatus.AUTHENTICATED;
      authStore.user = {
        sub: '123',
        preferredUsername: 'testuser',
        roles: ['ROLE_USER'],
      };
      authStore.roles = ['ROLE_USER'];

      const auth = useAuth();

      expect(auth.isAuthenticated.value).toBe(true);
      expect(auth.username.value).toBe('testuser');
      expect(auth.roles.value).toEqual(['ROLE_USER']);
    });
  });

  describe('role checking methods', () => {
    it('should check if user has specific role', () => {
      const authStore = useAuthStore();
      authStore.roles = ['ROLE_USER', 'ROLE_ADMIN'];

      const auth = useAuth();

      expect(auth.hasRole('ROLE_USER')).toBe(true);
      expect(auth.hasRole('ROLE_ADMIN')).toBe(true);
      expect(auth.hasRole('ROLE_SUPERUSER')).toBe(false);
    });

    it('should check if user has any of specified roles', () => {
      const authStore = useAuthStore();
      authStore.roles = ['ROLE_USER'];

      const auth = useAuth();

      expect(auth.hasAnyRole(['ROLE_USER', 'ROLE_ADMIN'])).toBe(true);
      expect(auth.hasAnyRole(['ROLE_ADMIN', 'ROLE_SUPERUSER'])).toBe(false);
      expect(auth.hasAnyRole([])).toBe(true); // Empty array returns true
    });

    it('should check if user has all of specified roles', () => {
      const authStore = useAuthStore();
      authStore.roles = ['ROLE_USER', 'ROLE_ADMIN'];

      const auth = useAuth();

      expect(auth.hasAllRoles(['ROLE_USER'])).toBe(true);
      expect(auth.hasAllRoles(['ROLE_USER', 'ROLE_ADMIN'])).toBe(true);
      expect(auth.hasAllRoles(['ROLE_USER', 'ROLE_SUPERUSER'])).toBe(false);
      expect(auth.hasAllRoles([])).toBe(true); // Empty array returns true
    });
  });

  describe('requireAuth utility', () => {
    it('should return true if authenticated', () => {
      const authStore = useAuthStore();
      authStore.status = AuthStatus.AUTHENTICATED;
      authStore.user = { sub: '123', preferredUsername: 'test', roles: [] };

      const auth = useAuth();

      expect(auth.requireAuth()).toBe(true);
    });

    it('should return false if not authenticated', () => {
      const authStore = useAuthStore();
      authStore.status = AuthStatus.UNAUTHENTICATED;

      const auth = useAuth();

      expect(auth.requireAuth()).toBe(false);
    });
  });
});

describe('Helper functions', () => {
  describe('requiresAuth', () => {
    it('should return true if requiresAuth meta is true', () => {
      expect(requiresAuth({ requiresAuth: true })).toBe(true);
    });

    it('should return false if requiresAuth meta is false', () => {
      expect(requiresAuth({ requiresAuth: false })).toBe(false);
    });

    it('should return false if requiresAuth meta is missing', () => {
      expect(requiresAuth({})).toBe(false);
    });
  });

  describe('getRequiredRoles', () => {
    it('should return roles array from meta', () => {
      const roles = getRequiredRoles({ requiredRoles: ['ROLE_ADMIN', 'ROLE_USER'] });
      expect(roles).toEqual(['ROLE_ADMIN', 'ROLE_USER']);
    });

    it('should return array with single role if meta is string', () => {
      const roles = getRequiredRoles({ requiredRoles: 'ROLE_ADMIN' });
      expect(roles).toEqual(['ROLE_ADMIN']);
    });

    it('should return empty array if no required roles', () => {
      expect(getRequiredRoles({})).toEqual([]);
      expect(getRequiredRoles({ requiredRoles: null })).toEqual([]);
      expect(getRequiredRoles({ requiredRoles: undefined })).toEqual([]);
    });
  });
});
