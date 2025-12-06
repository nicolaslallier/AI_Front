/**
 * Authentication types unit tests
 *
 * Tests for type definitions and enums
 */

import { describe, it, expect } from 'vitest';

import { AuthStatus, TokenStorage, RoleMatchMode, AuthEvent } from './types';

describe('Authentication Types', () => {
  describe('AuthStatus enum', () => {
    it('should have all expected status values', () => {
      expect(AuthStatus.INITIALIZING).toBe('initializing');
      expect(AuthStatus.AUTHENTICATED).toBe('authenticated');
      expect(AuthStatus.UNAUTHENTICATED).toBe('unauthenticated');
      expect(AuthStatus.AUTHENTICATING).toBe('authenticating');
      expect(AuthStatus.ERROR).toBe('error');
    });
  });

  describe('TokenStorage enum', () => {
    it('should have all expected storage strategies', () => {
      expect(TokenStorage.MEMORY).toBe('memory');
      expect(TokenStorage.SESSION).toBe('session');
      expect(TokenStorage.HYBRID).toBe('hybrid');
    });
  });

  describe('RoleMatchMode enum', () => {
    it('should have all expected match modes', () => {
      expect(RoleMatchMode.ALL).toBe('all');
      expect(RoleMatchMode.ANY).toBe('any');
    });
  });

  describe('AuthEvent enum', () => {
    it('should have all expected event types', () => {
      expect(AuthEvent.LOGIN).toBe('auth:login');
      expect(AuthEvent.LOGOUT).toBe('auth:logout');
      expect(AuthEvent.TOKEN_REFRESH).toBe('auth:token-refresh');
      expect(AuthEvent.ERROR).toBe('auth:error');
      expect(AuthEvent.SESSION_EXPIRED).toBe('auth:session-expired');
    });
  });
});
