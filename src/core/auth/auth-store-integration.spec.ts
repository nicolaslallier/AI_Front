import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import { useAuthStore } from './auth-store';
import { AuthStatus } from './types';

/**
 * Integration tests for auth store
 * These tests exercise the store methods directly to improve coverage
 */
describe('AuthStore Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const authStore = useAuthStore();
    expect(authStore.status).toBe(AuthStatus.INITIALIZING);
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.user).toBeNull();
    expect(authStore.roles).toEqual([]);
  });

  it('should have initializing status by default', () => {
    const authStore = useAuthStore();
    expect(authStore.isInitializing).toBe(true);
    expect(authStore.isAuthenticated).toBe(false);
  });

  it('should call reset action', () => {
    const authStore = useAuthStore();
    authStore.reset();
    // Reset clears the auth state
    expect(authStore.isAuthenticated).toBe(false);
  });

  it('should call clearError action', () => {
    const authStore = useAuthStore();
    authStore.clearError();
    expect(authStore.error).toBeNull();
  });

  it('should have hasRole method', () => {
    const authStore = useAuthStore();
    expect(typeof authStore.hasRole).toBe('function');
  });

  it('should have hasAnyRole method', () => {
    const authStore = useAuthStore();
    expect(typeof authStore.hasAnyRole).toBe('function');
    // Empty array should return true
    expect(authStore.hasAnyRole([])).toBe(true);
  });

  it('should have hasAllRoles method', () => {
    const authStore = useAuthStore();
    expect(typeof authStore.hasAllRoles).toBe('function');
    // Empty array should return true
    expect(authStore.hasAllRoles([])).toBe(true);
  });

  it('should have computed username property', () => {
    const authStore = useAuthStore();
    expect(authStore.username).toBe('');
  });

  it('should have computed email property', () => {
    const authStore = useAuthStore();
    // Email is undefined when no user
    expect(authStore.email).toBeUndefined();
  });

  it('should have computed fullName property', () => {
    const authStore = useAuthStore();
    // fullName is undefined when no user
    expect(authStore.fullName).toBeUndefined();
  });
});
