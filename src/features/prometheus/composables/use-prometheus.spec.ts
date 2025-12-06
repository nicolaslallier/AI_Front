import { describe, it, expect, beforeEach, vi } from 'vitest';

import { usePrometheus } from './use-prometheus';
import { PrometheusLoadingState, PrometheusErrorType } from '../types/index';

describe('usePrometheus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with IDLE state', () => {
      const { state } = usePrometheus();
      expect(state.value.loadingState).toBe(PrometheusLoadingState.IDLE);
    });

    it('should initialize with null error', () => {
      const { state } = usePrometheus();
      expect(state.value.error).toBeNull();
    });

    it('should initialize with zero retry count', () => {
      const { state } = usePrometheus();
      expect(state.value.retryCount).toBe(0);
    });

    it('should initialize with provided URL', () => {
      const testUrl = 'http://test.com/prometheus/';
      const { state } = usePrometheus(testUrl);
      expect(state.value.url).toBe(testUrl);
    });

    it('should use default URL when not provided', () => {
      const { state } = usePrometheus();
      expect(state.value.url).toBe('http://localhost/prometheus/');
    });
  });

  describe('setLoading', () => {
    it('should set loading state to LOADING', () => {
      const { state, setLoading } = usePrometheus();
      setLoading();
      expect(state.value.loadingState).toBe(PrometheusLoadingState.LOADING);
    });

    it('should clear error when setting loading', () => {
      const { state, setError, setLoading } = usePrometheus();
      setError(PrometheusErrorType.NETWORK_ERROR, 'Test error');
      setLoading();
      expect(state.value.error).toBeNull();
    });
  });

  describe('setLoaded', () => {
    it('should set loading state to LOADED', () => {
      const { state, setLoaded } = usePrometheus();
      setLoaded();
      expect(state.value.loadingState).toBe(PrometheusLoadingState.LOADED);
    });

    it('should clear error when setting loaded', () => {
      const { state, setError, setLoaded } = usePrometheus();
      setError(PrometheusErrorType.NETWORK_ERROR, 'Test error');
      setLoaded();
      expect(state.value.error).toBeNull();
    });
  });

  describe('setError', () => {
    it('should set loading state to ERROR', () => {
      const { state, setError } = usePrometheus();
      setError(PrometheusErrorType.NETWORK_ERROR, 'Network failed');
      expect(state.value.loadingState).toBe(PrometheusLoadingState.ERROR);
    });

    it('should create error object with correct type', () => {
      const { state, setError } = usePrometheus();
      setError(PrometheusErrorType.TIMEOUT_ERROR, 'Timeout occurred');
      expect(state.value.error?.type).toBe(PrometheusErrorType.TIMEOUT_ERROR);
    });

    it('should create error object with correct message', () => {
      const { state, setError } = usePrometheus();
      const message = 'Custom error message';
      setError(PrometheusErrorType.IFRAME_ERROR, message);
      expect(state.value.error?.message).toBe(message);
    });

    it('should create error object with timestamp', () => {
      const { state, setError } = usePrometheus();
      const beforeTime = new Date();
      setError(PrometheusErrorType.UNKNOWN_ERROR, 'Unknown error');
      const afterTime = new Date();

      expect(state.value.error?.timestamp).toBeInstanceOf(Date);
      expect(state.value.error?.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(state.value.error?.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should include optional details when provided', () => {
      const { state, setError } = usePrometheus();
      const details = 'Additional error details';
      setError(PrometheusErrorType.NETWORK_ERROR, 'Error message', details);
      expect(state.value.error?.details).toBe(details);
    });

    it('should not have details when not provided', () => {
      const { state, setError } = usePrometheus();
      setError(PrometheusErrorType.NETWORK_ERROR, 'Error message');
      expect(state.value.error?.details).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should reset to IDLE state', () => {
      const { state, setLoading, reset } = usePrometheus();
      setLoading();
      reset();
      expect(state.value.loadingState).toBe(PrometheusLoadingState.IDLE);
    });

    it('should clear error', () => {
      const { state, setError, reset } = usePrometheus();
      setError(PrometheusErrorType.NETWORK_ERROR, 'Error');
      reset();
      expect(state.value.error).toBeNull();
    });

    it('should reset retry count to zero', () => {
      const { state, incrementRetryCount, reset } = usePrometheus();
      incrementRetryCount();
      incrementRetryCount();
      reset();
      expect(state.value.retryCount).toBe(0);
    });

    it('should preserve URL', () => {
      const testUrl = 'http://test.com/prometheus/';
      const { state, setLoading, reset } = usePrometheus(testUrl);
      setLoading();
      reset();
      expect(state.value.url).toBe(testUrl);
    });
  });

  describe('incrementRetryCount', () => {
    it('should increment retry count from zero', () => {
      const { state, incrementRetryCount } = usePrometheus();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(1);
    });

    it('should increment retry count multiple times', () => {
      const { state, incrementRetryCount } = usePrometheus();
      incrementRetryCount();
      incrementRetryCount();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(3);
    });
  });

  describe('computed properties', () => {
    it('should compute isLoading as true when state is LOADING', () => {
      const { isLoading, setLoading } = usePrometheus();
      setLoading();
      expect(isLoading.value).toBe(true);
    });

    it('should compute isLoading as false when state is not LOADING', () => {
      const { isLoading, setLoaded } = usePrometheus();
      setLoaded();
      expect(isLoading.value).toBe(false);
    });

    it('should compute hasError as true when error exists', () => {
      const { hasError, setError } = usePrometheus();
      setError(PrometheusErrorType.NETWORK_ERROR, 'Error');
      expect(hasError.value).toBe(true);
    });

    it('should compute hasError as false when no error', () => {
      const { hasError } = usePrometheus();
      expect(hasError.value).toBe(false);
    });

    it('should compute isLoaded as true when state is LOADED', () => {
      const { isLoaded, setLoaded } = usePrometheus();
      setLoaded();
      expect(isLoaded.value).toBe(true);
    });

    it('should compute isLoaded as false when state is not LOADED', () => {
      const { isLoaded, setLoading } = usePrometheus();
      setLoading();
      expect(isLoaded.value).toBe(false);
    });
  });

  describe('state transitions', () => {
    it('should transition from IDLE to LOADING', () => {
      const { state, setLoading } = usePrometheus();
      expect(state.value.loadingState).toBe(PrometheusLoadingState.IDLE);
      setLoading();
      expect(state.value.loadingState).toBe(PrometheusLoadingState.LOADING);
    });

    it('should transition from LOADING to LOADED', () => {
      const { state, setLoading, setLoaded } = usePrometheus();
      setLoading();
      setLoaded();
      expect(state.value.loadingState).toBe(PrometheusLoadingState.LOADED);
    });

    it('should transition from LOADING to ERROR', () => {
      const { state, setLoading, setError } = usePrometheus();
      setLoading();
      setError(PrometheusErrorType.NETWORK_ERROR, 'Failed');
      expect(state.value.loadingState).toBe(PrometheusLoadingState.ERROR);
    });

    it('should transition from ERROR to LOADING on retry', () => {
      const { state, setError, setLoading } = usePrometheus();
      setError(PrometheusErrorType.NETWORK_ERROR, 'Failed');
      setLoading();
      expect(state.value.loadingState).toBe(PrometheusLoadingState.LOADING);
    });
  });
});
