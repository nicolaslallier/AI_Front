import { describe, it, expect } from 'vitest';

import { PrometheusLoadingState, PrometheusErrorType } from './index';

import type { PrometheusError, PrometheusState } from './index';

describe('prometheus types', () => {
  describe('PrometheusLoadingState', () => {
    it('should have IDLE state', () => {
      expect(PrometheusLoadingState.IDLE).toBe('idle');
    });

    it('should have LOADING state', () => {
      expect(PrometheusLoadingState.LOADING).toBe('loading');
    });

    it('should have LOADED state', () => {
      expect(PrometheusLoadingState.LOADED).toBe('loaded');
    });

    it('should have ERROR state', () => {
      expect(PrometheusLoadingState.ERROR).toBe('error');
    });

    it('should have exactly 4 states', () => {
      const states = Object.values(PrometheusLoadingState);
      expect(states.length).toBe(4);
    });
  });

  describe('PrometheusErrorType', () => {
    it('should have NETWORK_ERROR type', () => {
      expect(PrometheusErrorType.NETWORK_ERROR).toBe('network_error');
    });

    it('should have TIMEOUT_ERROR type', () => {
      expect(PrometheusErrorType.TIMEOUT_ERROR).toBe('timeout_error');
    });

    it('should have IFRAME_ERROR type', () => {
      expect(PrometheusErrorType.IFRAME_ERROR).toBe('iframe_error');
    });

    it('should have UNKNOWN_ERROR type', () => {
      expect(PrometheusErrorType.UNKNOWN_ERROR).toBe('unknown_error');
    });

    it('should have exactly 4 error types', () => {
      const types = Object.values(PrometheusErrorType);
      expect(types.length).toBe(4);
    });
  });

  describe('PrometheusError', () => {
    it('should accept a valid error object', () => {
      const error: PrometheusError = {
        type: PrometheusErrorType.NETWORK_ERROR,
        message: 'Failed to load Prometheus',
        timestamp: new Date(),
      };

      expect(error.type).toBe(PrometheusErrorType.NETWORK_ERROR);
      expect(error.message).toBe('Failed to load Prometheus');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should accept optional details property', () => {
      const error: PrometheusError = {
        type: PrometheusErrorType.TIMEOUT_ERROR,
        message: 'Request timed out',
        timestamp: new Date(),
        details: 'Connection timeout after 30 seconds',
      };

      expect(error.details).toBe('Connection timeout after 30 seconds');
    });

    it('should work without details property', () => {
      const error: PrometheusError = {
        type: PrometheusErrorType.IFRAME_ERROR,
        message: 'Iframe failed to load',
        timestamp: new Date(),
      };

      expect(error.details).toBeUndefined();
    });
  });

  describe('PrometheusState', () => {
    it('should accept a valid state object', () => {
      const state: PrometheusState = {
        loadingState: PrometheusLoadingState.IDLE,
        error: null,
        url: 'http://localhost/prometheus/',
        retryCount: 0,
      };

      expect(state.loadingState).toBe(PrometheusLoadingState.IDLE);
      expect(state.error).toBeNull();
      expect(state.url).toBe('http://localhost/prometheus/');
      expect(state.retryCount).toBe(0);
    });

    it('should accept state with error', () => {
      const error: PrometheusError = {
        type: PrometheusErrorType.NETWORK_ERROR,
        message: 'Network error',
        timestamp: new Date(),
      };

      const state: PrometheusState = {
        loadingState: PrometheusLoadingState.ERROR,
        error: error,
        url: 'http://localhost/prometheus/',
        retryCount: 1,
      };

      expect(state.loadingState).toBe(PrometheusLoadingState.ERROR);
      expect(state.error).toBe(error);
      expect(state.retryCount).toBe(1);
    });

    it('should track retry count', () => {
      const state: PrometheusState = {
        loadingState: PrometheusLoadingState.LOADING,
        error: null,
        url: 'http://localhost/prometheus/',
        retryCount: 3,
      };

      expect(state.retryCount).toBe(3);
    });

    it('should contain all required properties', () => {
      const state: PrometheusState = {
        loadingState: PrometheusLoadingState.LOADED,
        error: null,
        url: 'http://localhost/prometheus/',
        retryCount: 0,
      };

      expect(state).toHaveProperty('loadingState');
      expect(state).toHaveProperty('error');
      expect(state).toHaveProperty('url');
      expect(state).toHaveProperty('retryCount');
    });
  });

  describe('type relationships', () => {
    it('should use PrometheusLoadingState in PrometheusState', () => {
      const state: PrometheusState = {
        loadingState: PrometheusLoadingState.LOADING,
        error: null,
        url: 'http://localhost/prometheus/',
        retryCount: 0,
      };

      expect(Object.values(PrometheusLoadingState)).toContain(state.loadingState);
    });

    it('should use PrometheusErrorType in PrometheusError', () => {
      const error: PrometheusError = {
        type: PrometheusErrorType.UNKNOWN_ERROR,
        message: 'Unknown error',
        timestamp: new Date(),
      };

      expect(Object.values(PrometheusErrorType)).toContain(error.type);
    });

    it('should use PrometheusError in PrometheusState', () => {
      const error: PrometheusError = {
        type: PrometheusErrorType.IFRAME_ERROR,
        message: 'Iframe error',
        timestamp: new Date(),
      };

      const state: PrometheusState = {
        loadingState: PrometheusLoadingState.ERROR,
        error: error,
        url: 'http://localhost/prometheus/',
        retryCount: 1,
      };

      expect(state.error).toBe(error);
    });
  });
});
