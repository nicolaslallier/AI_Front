/**
 * Authentication event bus for micro front-end coordination
 *
 * Provides a centralized event system for broadcasting authentication state changes
 * across the application and micro front-ends.
 *
 * Implements FR-FE-KC-013 and FR-FE-KC-014 for micro front-end session coordination.
 */

import { AuthEvent } from './types';

import type { AuthEventPayload } from './types';

import { Logger } from '@/shared/utils/logger';

/**
 * Type definition for event listener callback
 */
type EventListener = (payload: AuthEventPayload) => void;

/**
 * Authentication event emitter class
 *
 * Implements a simple pub/sub pattern for auth events
 */
class AuthEventEmitter {
  private listeners: Map<AuthEvent, Set<EventListener>> = new Map();

  /**
   * Subscribes to an authentication event
   *
   * @param event - Event type to listen for
   * @param listener - Callback function to execute when event fires
   * @returns Unsubscribe function
   *
   * @example
   * const unsubscribe = authEvents.on(AuthEvent.LOGIN, (payload) => {
   *   console.log('User logged in:', payload.user);
   * });
   * // Later: unsubscribe();
   */
  public on(event: AuthEvent, listener: EventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return (): void => {
      this.off(event, listener);
    };
  }

  /**
   * Unsubscribes from an authentication event
   *
   * @param event - Event type to stop listening to
   * @param listener - Callback function to remove
   */
  public off(event: AuthEvent, listener: EventListener): void {
    const eventListeners = this.listeners.get(event);

    if (eventListeners) {
      eventListeners.delete(listener);

      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Subscribes to an event for a single execution
   *
   * Automatically unsubscribes after the first event emission.
   *
   * @param event - Event type to listen for
   * @param listener - Callback function to execute once
   * @returns Unsubscribe function
   */
  public once(event: AuthEvent, listener: EventListener): () => void {
    const onceListener: EventListener = (payload: AuthEventPayload): void => {
      this.off(event, onceListener);
      listener(payload);
    };

    return this.on(event, onceListener);
  }

  /**
   * Emits an authentication event to all subscribers
   *
   * @param event - Event type to emit
   * @param payload - Event payload data
   */
  public emit(event: AuthEvent, payload: Omit<AuthEventPayload, 'type' | 'timestamp'>): void {
    const fullPayload: AuthEventPayload = {
      type: event,
      timestamp: Date.now(),
      ...payload,
    };

    const eventListeners = this.listeners.get(event);

    if (eventListeners) {
      eventListeners.forEach((listener) => {
        try {
          listener(fullPayload);
        } catch (error) {
          Logger.error(`Error in auth event listener for ${event}`, error);
        }
      });
    }

    // Log event in debug mode
    if (import.meta.env.DEV) {
      Logger.info(`Auth event: ${event}`, fullPayload);
    }
  }

  /**
   * Removes all event listeners
   *
   * Useful for cleanup during application shutdown or testing.
   */
  public clear(): void {
    this.listeners.clear();
  }

  /**
   * Gets the count of listeners for a specific event
   *
   * Useful for debugging and testing.
   *
   * @param event - Event type to count listeners for
   * @returns Number of registered listeners
   */
  public listenerCount(event: AuthEvent): number {
    const eventListeners = this.listeners.get(event);
    return eventListeners ? eventListeners.size : 0;
  }
}

/**
 * Global authentication event emitter instance
 *
 * Use this singleton to emit and listen to authentication events throughout the application.
 *
 * @example
 * // Listening to login events
 * authEvents.on(AuthEvent.LOGIN, (payload) => {
 *   console.log('User logged in:', payload.user);
 * });
 *
 * @example
 * // Emitting a login event
 * authEvents.emit(AuthEvent.LOGIN, {
 *   user: userProfile,
 * });
 */
export const authEvents = new AuthEventEmitter();

/**
 * Helper function to emit login event
 *
 * @param user - User profile that logged in
 */
export function emitLoginEvent(user: AuthEventPayload['user']): void {
  authEvents.emit(AuthEvent.LOGIN, { user });
}

/**
 * Helper function to emit logout event
 */
export function emitLogoutEvent(): void {
  authEvents.emit(AuthEvent.LOGOUT, {});
}

/**
 * Helper function to emit token refresh event
 */
export function emitTokenRefreshEvent(): void {
  authEvents.emit(AuthEvent.TOKEN_REFRESH, {});
}

/**
 * Helper function to emit error event
 *
 * @param error - Error message
 */
export function emitErrorEvent(error: string): void {
  authEvents.emit(AuthEvent.ERROR, { error });
}

/**
 * Helper function to emit session expired event
 */
export function emitSessionExpiredEvent(): void {
  authEvents.emit(AuthEvent.SESSION_EXPIRED, {});
}
