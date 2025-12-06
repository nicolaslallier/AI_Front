/**
 * Authentication errors unit tests
 */

import { describe, it, expect } from 'vitest';

import {
  AuthError,
  AuthenticationError,
  TokenExpiredError,
  InsufficientPermissionsError,
  KeycloakUnavailableError,
  isAuthError,
  getErrorMessage,
} from './errors';

describe('Authentication Errors', () => {
  describe('AuthError base class', () => {
    it('should create an auth error with message', () => {
      const error = new AuthError('Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('AuthError');
      expect(error.message).toBe('Test error');
      expect(error.timestamp).toBeDefined();
    });

    it('should capture cause if provided', () => {
      const cause = new Error('Original error');
      const error = new AuthError('Test error', cause);

      expect(error.originalError).toBe(cause);
    });
  });

  describe('AuthenticationError', () => {
    it('should create authentication error', () => {
      const error = new AuthenticationError('Login failed');

      expect(error).toBeInstanceOf(AuthError);
      expect(error.name).toBe('AuthenticationError');
      expect(error.message).toBe('Login failed');
    });
  });

  describe('TokenExpiredError', () => {
    it('should create token expired error with default message', () => {
      const error = new TokenExpiredError();

      expect(error).toBeInstanceOf(AuthError);
      expect(error.name).toBe('TokenExpiredError');
      expect(error.message).toBe('Token has expired');
    });

    it('should create token expired error with custom message', () => {
      const error = new TokenExpiredError('Custom expiry message');

      expect(error.message).toBe('Custom expiry message');
    });
  });

  describe('InsufficientPermissionsError', () => {
    it('should create insufficient permissions error with role details', () => {
      const requiredRoles = ['ROLE_ADMIN', 'ROLE_MANAGER'];
      const userRoles = ['ROLE_USER'];
      const error = new InsufficientPermissionsError(requiredRoles, userRoles);

      expect(error).toBeInstanceOf(AuthError);
      expect(error.name).toBe('InsufficientPermissionsError');
      expect(error.requiredRoles).toEqual(requiredRoles);
      expect(error.userRoles).toEqual(userRoles);
      expect(error.message).toContain('ROLE_ADMIN');
      expect(error.message).toContain('ROLE_MANAGER');
      expect(error.message).toContain('ROLE_USER');
    });
  });

  describe('KeycloakUnavailableError', () => {
    it('should create keycloak unavailable error', () => {
      const url = 'http://localhost:8080';
      const error = new KeycloakUnavailableError(url);

      expect(error).toBeInstanceOf(AuthError);
      expect(error.name).toBe('KeycloakUnavailableError');
      expect(error.keycloakUrl).toBe(url);
      expect(error.message).toContain(url);
    });
  });

  describe('isAuthError', () => {
    it('should return true for auth errors', () => {
      const error = new AuthError('Test');
      expect(isAuthError(error)).toBe(true);
    });

    it('should return true for auth error subclasses', () => {
      const error = new TokenExpiredError();
      expect(isAuthError(error)).toBe(true);
    });

    it('should return false for regular errors', () => {
      const error = new Error('Test');
      expect(isAuthError(error)).toBe(false);
    });

    it('should return false for non-error values', () => {
      expect(isAuthError('string')).toBe(false);
      expect(isAuthError(null)).toBe(false);
      expect(isAuthError(undefined)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from auth error', () => {
      const error = new AuthError('Auth error message');
      expect(getErrorMessage(error)).toBe('Auth error message');
    });

    it('should extract message from regular error', () => {
      const error = new Error('Regular error message');
      expect(getErrorMessage(error)).toBe('Regular error message');
    });

    it('should handle string errors', () => {
      expect(getErrorMessage('String error')).toBe('String error');
    });

    it('should handle unknown errors', () => {
      expect(getErrorMessage(null)).toBe('An unknown error occurred');
      expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
      expect(getErrorMessage(123)).toBe('An unknown error occurred');
    });
  });
});
