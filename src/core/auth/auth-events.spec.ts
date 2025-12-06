/**
 * Authentication events unit tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  authEvents,
  emitLoginEvent,
  emitLogoutEvent,
  emitTokenRefreshEvent,
  emitErrorEvent,
  emitSessionExpiredEvent,
} from './auth-events';
import { AuthEvent } from './types';

describe('Authentication Events', () => {
  beforeEach(() => {
    // Clear all event listeners before each test
    authEvents.clear();
  });

  describe('authEvents.on', () => {
    it('should register event listener', () => {
      const listener = vi.fn();
      authEvents.on(AuthEvent.LOGIN, listener);

      expect(authEvents.listenerCount(AuthEvent.LOGIN)).toBe(1);
    });

    it('should call listener when event is emitted', () => {
      const listener = vi.fn();
      authEvents.on(AuthEvent.LOGIN, listener);

      authEvents.emit(AuthEvent.LOGIN, { user: { sub: '123', preferredUsername: 'test', roles: [] } });

      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: AuthEvent.LOGIN,
          user: expect.any(Object),
          timestamp: expect.any(Number),
        }),
      );
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = authEvents.on(AuthEvent.LOGIN, listener);

      expect(authEvents.listenerCount(AuthEvent.LOGIN)).toBe(1);

      unsubscribe();

      expect(authEvents.listenerCount(AuthEvent.LOGIN)).toBe(0);
    });

    it('should support multiple listeners for same event', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      authEvents.on(AuthEvent.LOGIN, listener1);
      authEvents.on(AuthEvent.LOGIN, listener2);

      authEvents.emit(AuthEvent.LOGIN, {});

      expect(listener1).toHaveBeenCalledOnce();
      expect(listener2).toHaveBeenCalledOnce();
    });
  });

  describe('authEvents.off', () => {
    it('should remove event listener', () => {
      const listener = vi.fn();
      authEvents.on(AuthEvent.LOGIN, listener);

      authEvents.off(AuthEvent.LOGIN, listener);

      expect(authEvents.listenerCount(AuthEvent.LOGIN)).toBe(0);
    });

    it('should not affect other listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      authEvents.on(AuthEvent.LOGIN, listener1);
      authEvents.on(AuthEvent.LOGIN, listener2);

      authEvents.off(AuthEvent.LOGIN, listener1);

      expect(authEvents.listenerCount(AuthEvent.LOGIN)).toBe(1);

      authEvents.emit(AuthEvent.LOGIN, {});

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledOnce();
    });
  });

  describe('authEvents.once', () => {
    it('should call listener only once', () => {
      const listener = vi.fn();
      authEvents.once(AuthEvent.LOGIN, listener);

      authEvents.emit(AuthEvent.LOGIN, {});
      authEvents.emit(AuthEvent.LOGIN, {});

      expect(listener).toHaveBeenCalledOnce();
    });

    it('should auto-remove listener after execution', () => {
      const listener = vi.fn();
      authEvents.once(AuthEvent.LOGIN, listener);

      expect(authEvents.listenerCount(AuthEvent.LOGIN)).toBe(1);

      authEvents.emit(AuthEvent.LOGIN, {});

      expect(authEvents.listenerCount(AuthEvent.LOGIN)).toBe(0);
    });
  });

  describe('authEvents.emit', () => {
    it('should add type and timestamp to payload', () => {
      const listener = vi.fn();
      authEvents.on(AuthEvent.LOGIN, listener);

      authEvents.emit(AuthEvent.LOGIN, { user: { sub: '123', preferredUsername: 'test', roles: [] } });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: AuthEvent.LOGIN,
          timestamp: expect.any(Number),
        }),
      );
    });

    it('should handle errors in listeners gracefully', () => {
      const errorListener = vi.fn(() => {
        throw new Error('Listener error');
      });
      const goodListener = vi.fn();

      authEvents.on(AuthEvent.LOGIN, errorListener);
      authEvents.on(AuthEvent.LOGIN, goodListener);

      // Should not throw
      expect(() => authEvents.emit(AuthEvent.LOGIN, {})).not.toThrow();

      // Good listener should still be called
      expect(goodListener).toHaveBeenCalledOnce();
    });
  });

  describe('authEvents.clear', () => {
    it('should remove all listeners', () => {
      authEvents.on(AuthEvent.LOGIN, vi.fn());
      authEvents.on(AuthEvent.LOGOUT, vi.fn());
      authEvents.on(AuthEvent.ERROR, vi.fn());

      authEvents.clear();

      expect(authEvents.listenerCount(AuthEvent.LOGIN)).toBe(0);
      expect(authEvents.listenerCount(AuthEvent.LOGOUT)).toBe(0);
      expect(authEvents.listenerCount(AuthEvent.ERROR)).toBe(0);
    });
  });

  describe('Helper emit functions', () => {
    it('emitLoginEvent should emit login event with user', () => {
      const listener = vi.fn();
      authEvents.on(AuthEvent.LOGIN, listener);

      const user = { sub: '123', preferredUsername: 'test', roles: [] };
      emitLoginEvent(user);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: AuthEvent.LOGIN,
          user,
        }),
      );
    });

    it('emitLogoutEvent should emit logout event', () => {
      const listener = vi.fn();
      authEvents.on(AuthEvent.LOGOUT, listener);

      emitLogoutEvent();

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: AuthEvent.LOGOUT,
        }),
      );
    });

    it('emitTokenRefreshEvent should emit token refresh event', () => {
      const listener = vi.fn();
      authEvents.on(AuthEvent.TOKEN_REFRESH, listener);

      emitTokenRefreshEvent();

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: AuthEvent.TOKEN_REFRESH,
        }),
      );
    });

    it('emitErrorEvent should emit error event with message', () => {
      const listener = vi.fn();
      authEvents.on(AuthEvent.ERROR, listener);

      emitErrorEvent('Test error');

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: AuthEvent.ERROR,
          error: 'Test error',
        }),
      );
    });

    it('emitSessionExpiredEvent should emit session expired event', () => {
      const listener = vi.fn();
      authEvents.on(AuthEvent.SESSION_EXPIRED, listener);

      emitSessionExpiredEvent();

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: AuthEvent.SESSION_EXPIRED,
        }),
      );
    });
  });
});
