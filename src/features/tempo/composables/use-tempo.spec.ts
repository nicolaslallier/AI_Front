import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useTempo } from './use-tempo';
import { TempoLoadingState, TempoErrorType } from '../types/index';

describe('useTempo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with IDLE state', () => {
      const { state } = useTempo();
      expect(state.value.loadingState).toBe(TempoLoadingState.IDLE);
    });

    it('should initialize with null error', () => {
      const { state } = useTempo();
      expect(state.value.error).toBeNull();
    });

    it('should initialize with zero retry count', () => {
      const { state } = useTempo();
      expect(state.value.retryCount).toBe(0);
    });

    it('should initialize with provided URL', () => {
      const testUrl = 'http://test.com/tempo/';
      const { state } = useTempo(testUrl);
      expect(state.value.url).toBe(testUrl);
    });

    it('should use default URL when not provided', () => {
      const { state } = useTempo();
      expect(state.value.url).toBe('http://localhost/tempo/');
    });
  });

  describe('setLoading', () => {
    it('should set loading state to LOADING', () => {
      const { state, setLoading } = useTempo();
      setLoading();
      expect(state.value.loadingState).toBe(TempoLoadingState.LOADING);
    });

    it('should clear error when setting loading', () => {
      const { state, setError, setLoading } = useTempo();
      setError(TempoErrorType.NETWORK_ERROR, 'Test error');
      setLoading();
      expect(state.value.error).toBeNull();
    });
  });

  describe('setLoaded', () => {
    it('should set loading state to LOADED', () => {
      const { state, setLoaded } = useTempo();
      setLoaded();
      expect(state.value.loadingState).toBe(TempoLoadingState.LOADED);
    });

    it('should clear error when setting loaded', () => {
      const { state, setError, setLoaded } = useTempo();
      setError(TempoErrorType.NETWORK_ERROR, 'Test error');
      setLoaded();
      expect(state.value.error).toBeNull();
    });
  });

  describe('setError', () => {
    it('should set loading state to ERROR', () => {
      const { state, setError } = useTempo();
      setError(TempoErrorType.NETWORK_ERROR, 'Network failed');
      expect(state.value.loadingState).toBe(TempoLoadingState.ERROR);
    });

    it('should create error object with correct type', () => {
      const { state, setError } = useTempo();
      setError(TempoErrorType.TIMEOUT_ERROR, 'Timeout occurred');
      expect(state.value.error?.type).toBe(TempoErrorType.TIMEOUT_ERROR);
    });

    it('should create error object with correct message', () => {
      const { state, setError } = useTempo();
      const message = 'Custom error message';
      setError(TempoErrorType.IFRAME_ERROR, message);
      expect(state.value.error?.message).toBe(message);
    });

    it('should create error object with timestamp', () => {
      const { state, setError } = useTempo();
      const beforeTime = new Date();
      setError(TempoErrorType.UNKNOWN_ERROR, 'Unknown error');
      const afterTime = new Date();

      expect(state.value.error?.timestamp).toBeInstanceOf(Date);
      expect(state.value.error?.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(state.value.error?.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should include optional details when provided', () => {
      const { state, setError } = useTempo();
      const details = 'Additional error details';
      setError(TempoErrorType.NETWORK_ERROR, 'Error message', details);
      expect(state.value.error?.details).toBe(details);
    });

    it('should not have details when not provided', () => {
      const { state, setError } = useTempo();
      setError(TempoErrorType.NETWORK_ERROR, 'Error message');
      expect(state.value.error?.details).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should reset to IDLE state', () => {
      const { state, setLoading, reset } = useTempo();
      setLoading();
      reset();
      expect(state.value.loadingState).toBe(TempoLoadingState.IDLE);
    });

    it('should clear error', () => {
      const { state, setError, reset } = useTempo();
      setError(TempoErrorType.NETWORK_ERROR, 'Error');
      reset();
      expect(state.value.error).toBeNull();
    });

    it('should reset retry count to zero', () => {
      const { state, incrementRetryCount, reset } = useTempo();
      incrementRetryCount();
      incrementRetryCount();
      reset();
      expect(state.value.retryCount).toBe(0);
    });

    it('should preserve URL', () => {
      const testUrl = 'http://test.com/tempo/';
      const { state, setLoading, reset } = useTempo(testUrl);
      setLoading();
      reset();
      expect(state.value.url).toBe(testUrl);
    });
  });

  describe('incrementRetryCount', () => {
    it('should increment retry count from zero', () => {
      const { state, incrementRetryCount } = useTempo();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(1);
    });

    it('should increment retry count multiple times', () => {
      const { state, incrementRetryCount } = useTempo();
      incrementRetryCount();
      incrementRetryCount();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(3);
    });
  });

  describe('computed properties', () => {
    it('should compute isLoading as true when state is LOADING', () => {
      const { isLoading, setLoading } = useTempo();
      setLoading();
      expect(isLoading.value).toBe(true);
    });

    it('should compute isLoading as false when state is not LOADING', () => {
      const { isLoading, setLoaded } = useTempo();
      setLoaded();
      expect(isLoading.value).toBe(false);
    });

    it('should compute hasError as true when error exists', () => {
      const { hasError, setError } = useTempo();
      setError(TempoErrorType.NETWORK_ERROR, 'Error');
      expect(hasError.value).toBe(true);
    });

    it('should compute hasError as false when no error', () => {
      const { hasError } = useTempo();
      expect(hasError.value).toBe(false);
    });

    it('should compute isLoaded as true when state is LOADED', () => {
      const { isLoaded, setLoaded } = useTempo();
      setLoaded();
      expect(isLoaded.value).toBe(true);
    });

    it('should compute isLoaded as false when state is not LOADED', () => {
      const { isLoaded, setLoading } = useTempo();
      setLoading();
      expect(isLoaded.value).toBe(false);
    });
  });

  describe('state transitions', () => {
    it('should transition from IDLE to LOADING', () => {
      const { state, setLoading } = useTempo();
      expect(state.value.loadingState).toBe(TempoLoadingState.IDLE);
      setLoading();
      expect(state.value.loadingState).toBe(TempoLoadingState.LOADING);
    });

    it('should transition from LOADING to LOADED', () => {
      const { state, setLoading, setLoaded } = useTempo();
      setLoading();
      setLoaded();
      expect(state.value.loadingState).toBe(TempoLoadingState.LOADED);
    });

    it('should transition from LOADING to ERROR', () => {
      const { state, setLoading, setError } = useTempo();
      setLoading();
      setError(TempoErrorType.NETWORK_ERROR, 'Failed');
      expect(state.value.loadingState).toBe(TempoLoadingState.ERROR);
    });

    it('should transition from ERROR to LOADING on retry', () => {
      const { state, setError, setLoading } = useTempo();
      setError(TempoErrorType.NETWORK_ERROR, 'Failed');
      setLoading();
      expect(state.value.loadingState).toBe(TempoLoadingState.LOADING);
    });
  });
});
