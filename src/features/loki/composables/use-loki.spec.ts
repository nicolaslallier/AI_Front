import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useLoki } from './use-loki';
import { LokiLoadingState, LokiErrorType } from '../types/index';

describe('useLoki', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with IDLE state', () => {
      const { state } = useLoki();
      expect(state.value.loadingState).toBe(LokiLoadingState.IDLE);
    });

    it('should initialize with null error', () => {
      const { state } = useLoki();
      expect(state.value.error).toBeNull();
    });

    it('should initialize with zero retry count', () => {
      const { state } = useLoki();
      expect(state.value.retryCount).toBe(0);
    });

    it('should initialize with provided URL', () => {
      const testUrl = 'http://test.com/loki/';
      const { state } = useLoki(testUrl);
      expect(state.value.url).toBe(testUrl);
    });

    it('should use default URL when not provided', () => {
      const { state } = useLoki();
      expect(state.value.url).toBe('http://localhost/loki/');
    });
  });

  describe('setLoading', () => {
    it('should set loading state to LOADING', () => {
      const { state, setLoading } = useLoki();
      setLoading();
      expect(state.value.loadingState).toBe(LokiLoadingState.LOADING);
    });

    it('should clear error when setting loading', () => {
      const { state, setError, setLoading } = useLoki();
      setError(LokiErrorType.NETWORK_ERROR, 'Test error');
      setLoading();
      expect(state.value.error).toBeNull();
    });
  });

  describe('setLoaded', () => {
    it('should set loading state to LOADED', () => {
      const { state, setLoaded } = useLoki();
      setLoaded();
      expect(state.value.loadingState).toBe(LokiLoadingState.LOADED);
    });

    it('should clear error when setting loaded', () => {
      const { state, setError, setLoaded } = useLoki();
      setError(LokiErrorType.NETWORK_ERROR, 'Test error');
      setLoaded();
      expect(state.value.error).toBeNull();
    });
  });

  describe('setError', () => {
    it('should set loading state to ERROR', () => {
      const { state, setError } = useLoki();
      setError(LokiErrorType.NETWORK_ERROR, 'Network failed');
      expect(state.value.loadingState).toBe(LokiLoadingState.ERROR);
    });

    it('should create error object with correct type', () => {
      const { state, setError } = useLoki();
      setError(LokiErrorType.TIMEOUT_ERROR, 'Timeout occurred');
      expect(state.value.error?.type).toBe(LokiErrorType.TIMEOUT_ERROR);
    });

    it('should create error object with correct message', () => {
      const { state, setError } = useLoki();
      const message = 'Custom error message';
      setError(LokiErrorType.IFRAME_ERROR, message);
      expect(state.value.error?.message).toBe(message);
    });

    it('should create error object with timestamp', () => {
      const { state, setError } = useLoki();
      const beforeTime = new Date();
      setError(LokiErrorType.UNKNOWN_ERROR, 'Unknown error');
      const afterTime = new Date();

      expect(state.value.error?.timestamp).toBeInstanceOf(Date);
      expect(state.value.error?.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(state.value.error?.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should include optional details when provided', () => {
      const { state, setError } = useLoki();
      const details = 'Additional error details';
      setError(LokiErrorType.NETWORK_ERROR, 'Error message', details);
      expect(state.value.error?.details).toBe(details);
    });

    it('should not have details when not provided', () => {
      const { state, setError } = useLoki();
      setError(LokiErrorType.NETWORK_ERROR, 'Error message');
      expect(state.value.error?.details).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should reset to IDLE state', () => {
      const { state, setLoading, reset } = useLoki();
      setLoading();
      reset();
      expect(state.value.loadingState).toBe(LokiLoadingState.IDLE);
    });

    it('should clear error', () => {
      const { state, setError, reset } = useLoki();
      setError(LokiErrorType.NETWORK_ERROR, 'Error');
      reset();
      expect(state.value.error).toBeNull();
    });

    it('should reset retry count to zero', () => {
      const { state, incrementRetryCount, reset } = useLoki();
      incrementRetryCount();
      incrementRetryCount();
      reset();
      expect(state.value.retryCount).toBe(0);
    });

    it('should preserve URL', () => {
      const testUrl = 'http://test.com/loki/';
      const { state, setLoading, reset } = useLoki(testUrl);
      setLoading();
      reset();
      expect(state.value.url).toBe(testUrl);
    });
  });

  describe('incrementRetryCount', () => {
    it('should increment retry count from zero', () => {
      const { state, incrementRetryCount } = useLoki();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(1);
    });

    it('should increment retry count multiple times', () => {
      const { state, incrementRetryCount } = useLoki();
      incrementRetryCount();
      incrementRetryCount();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(3);
    });
  });

  describe('computed properties', () => {
    it('should compute isLoading as true when state is LOADING', () => {
      const { isLoading, setLoading } = useLoki();
      setLoading();
      expect(isLoading.value).toBe(true);
    });

    it('should compute isLoading as false when state is not LOADING', () => {
      const { isLoading, setLoaded } = useLoki();
      setLoaded();
      expect(isLoading.value).toBe(false);
    });

    it('should compute hasError as true when error exists', () => {
      const { hasError, setError } = useLoki();
      setError(LokiErrorType.NETWORK_ERROR, 'Error');
      expect(hasError.value).toBe(true);
    });

    it('should compute hasError as false when no error', () => {
      const { hasError } = useLoki();
      expect(hasError.value).toBe(false);
    });

    it('should compute isLoaded as true when state is LOADED', () => {
      const { isLoaded, setLoaded } = useLoki();
      setLoaded();
      expect(isLoaded.value).toBe(true);
    });

    it('should compute isLoaded as false when state is not LOADED', () => {
      const { isLoaded, setLoading } = useLoki();
      setLoading();
      expect(isLoaded.value).toBe(false);
    });
  });

  describe('state transitions', () => {
    it('should transition from IDLE to LOADING', () => {
      const { state, setLoading } = useLoki();
      expect(state.value.loadingState).toBe(LokiLoadingState.IDLE);
      setLoading();
      expect(state.value.loadingState).toBe(LokiLoadingState.LOADING);
    });

    it('should transition from LOADING to LOADED', () => {
      const { state, setLoading, setLoaded } = useLoki();
      setLoading();
      setLoaded();
      expect(state.value.loadingState).toBe(LokiLoadingState.LOADED);
    });

    it('should transition from LOADING to ERROR', () => {
      const { state, setLoading, setError } = useLoki();
      setLoading();
      setError(LokiErrorType.NETWORK_ERROR, 'Failed');
      expect(state.value.loadingState).toBe(LokiLoadingState.ERROR);
    });

    it('should transition from ERROR to LOADING on retry', () => {
      const { state, setError, setLoading } = useLoki();
      setError(LokiErrorType.NETWORK_ERROR, 'Failed');
      setLoading();
      expect(state.value.loadingState).toBe(LokiLoadingState.LOADING);
    });
  });
});
