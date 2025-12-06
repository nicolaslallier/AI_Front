import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useGrafana } from './use-grafana';
import { GrafanaLoadingState, GrafanaErrorType } from '../types/index';

describe('useGrafana', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with IDLE state', () => {
      const { state } = useGrafana();
      expect(state.value.loadingState).toBe(GrafanaLoadingState.IDLE);
    });

    it('should initialize with null error', () => {
      const { state } = useGrafana();
      expect(state.value.error).toBeNull();
    });

    it('should initialize with zero retry count', () => {
      const { state } = useGrafana();
      expect(state.value.retryCount).toBe(0);
    });

    it('should initialize with provided URL', () => {
      const testUrl = 'http://test.com/grafana/';
      const { state } = useGrafana(testUrl);
      expect(state.value.url).toBe(testUrl);
    });

    it('should use default URL when not provided', () => {
      const { state } = useGrafana();
      expect(state.value.url).toBe('http://localhost/grafana/');
    });
  });

  describe('setLoading', () => {
    it('should set loading state to LOADING', () => {
      const { state, setLoading } = useGrafana();
      setLoading();
      expect(state.value.loadingState).toBe(GrafanaLoadingState.LOADING);
    });

    it('should clear error when setting loading', () => {
      const { state, setError, setLoading } = useGrafana();
      setError(GrafanaErrorType.NETWORK_ERROR, 'Test error');
      setLoading();
      expect(state.value.error).toBeNull();
    });
  });

  describe('setLoaded', () => {
    it('should set loading state to LOADED', () => {
      const { state, setLoaded } = useGrafana();
      setLoaded();
      expect(state.value.loadingState).toBe(GrafanaLoadingState.LOADED);
    });

    it('should clear error when setting loaded', () => {
      const { state, setError, setLoaded } = useGrafana();
      setError(GrafanaErrorType.NETWORK_ERROR, 'Test error');
      setLoaded();
      expect(state.value.error).toBeNull();
    });
  });

  describe('setError', () => {
    it('should set loading state to ERROR', () => {
      const { state, setError } = useGrafana();
      setError(GrafanaErrorType.NETWORK_ERROR, 'Network failed');
      expect(state.value.loadingState).toBe(GrafanaLoadingState.ERROR);
    });

    it('should create error object with correct type', () => {
      const { state, setError } = useGrafana();
      setError(GrafanaErrorType.TIMEOUT_ERROR, 'Timeout occurred');
      expect(state.value.error?.type).toBe(GrafanaErrorType.TIMEOUT_ERROR);
    });

    it('should create error object with correct message', () => {
      const { state, setError } = useGrafana();
      const message = 'Custom error message';
      setError(GrafanaErrorType.IFRAME_ERROR, message);
      expect(state.value.error?.message).toBe(message);
    });

    it('should create error object with timestamp', () => {
      const { state, setError } = useGrafana();
      const beforeTime = new Date();
      setError(GrafanaErrorType.UNKNOWN_ERROR, 'Unknown error');
      const afterTime = new Date();

      expect(state.value.error?.timestamp).toBeInstanceOf(Date);
      expect(state.value.error?.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(state.value.error?.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should include optional details when provided', () => {
      const { state, setError } = useGrafana();
      const details = 'Additional error details';
      setError(GrafanaErrorType.NETWORK_ERROR, 'Error message', details);
      expect(state.value.error?.details).toBe(details);
    });

    it('should not have details when not provided', () => {
      const { state, setError } = useGrafana();
      setError(GrafanaErrorType.NETWORK_ERROR, 'Error message');
      expect(state.value.error?.details).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should reset to IDLE state', () => {
      const { state, setLoading, reset } = useGrafana();
      setLoading();
      reset();
      expect(state.value.loadingState).toBe(GrafanaLoadingState.IDLE);
    });

    it('should clear error', () => {
      const { state, setError, reset } = useGrafana();
      setError(GrafanaErrorType.NETWORK_ERROR, 'Error');
      reset();
      expect(state.value.error).toBeNull();
    });

    it('should reset retry count to zero', () => {
      const { state, incrementRetryCount, reset } = useGrafana();
      incrementRetryCount();
      incrementRetryCount();
      reset();
      expect(state.value.retryCount).toBe(0);
    });

    it('should preserve URL', () => {
      const testUrl = 'http://test.com/grafana/';
      const { state, setLoading, reset } = useGrafana(testUrl);
      setLoading();
      reset();
      expect(state.value.url).toBe(testUrl);
    });
  });

  describe('incrementRetryCount', () => {
    it('should increment retry count from zero', () => {
      const { state, incrementRetryCount } = useGrafana();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(1);
    });

    it('should increment retry count multiple times', () => {
      const { state, incrementRetryCount } = useGrafana();
      incrementRetryCount();
      incrementRetryCount();
      incrementRetryCount();
      expect(state.value.retryCount).toBe(3);
    });
  });

  describe('computed properties', () => {
    it('should compute isLoading as true when state is LOADING', () => {
      const { isLoading, setLoading } = useGrafana();
      setLoading();
      expect(isLoading.value).toBe(true);
    });

    it('should compute isLoading as false when state is not LOADING', () => {
      const { isLoading, setLoaded } = useGrafana();
      setLoaded();
      expect(isLoading.value).toBe(false);
    });

    it('should compute hasError as true when error exists', () => {
      const { hasError, setError } = useGrafana();
      setError(GrafanaErrorType.NETWORK_ERROR, 'Error');
      expect(hasError.value).toBe(true);
    });

    it('should compute hasError as false when no error', () => {
      const { hasError } = useGrafana();
      expect(hasError.value).toBe(false);
    });

    it('should compute isLoaded as true when state is LOADED', () => {
      const { isLoaded, setLoaded } = useGrafana();
      setLoaded();
      expect(isLoaded.value).toBe(true);
    });

    it('should compute isLoaded as false when state is not LOADED', () => {
      const { isLoaded, setLoading } = useGrafana();
      setLoading();
      expect(isLoaded.value).toBe(false);
    });
  });

  describe('state transitions', () => {
    it('should transition from IDLE to LOADING', () => {
      const { state, setLoading } = useGrafana();
      expect(state.value.loadingState).toBe(GrafanaLoadingState.IDLE);
      setLoading();
      expect(state.value.loadingState).toBe(GrafanaLoadingState.LOADING);
    });

    it('should transition from LOADING to LOADED', () => {
      const { state, setLoading, setLoaded } = useGrafana();
      setLoading();
      setLoaded();
      expect(state.value.loadingState).toBe(GrafanaLoadingState.LOADED);
    });

    it('should transition from LOADING to ERROR', () => {
      const { state, setLoading, setError } = useGrafana();
      setLoading();
      setError(GrafanaErrorType.NETWORK_ERROR, 'Failed');
      expect(state.value.loadingState).toBe(GrafanaLoadingState.ERROR);
    });

    it('should transition from ERROR to LOADING on retry', () => {
      const { state, setError, setLoading } = useGrafana();
      setError(GrafanaErrorType.NETWORK_ERROR, 'Failed');
      setLoading();
      expect(state.value.loadingState).toBe(GrafanaLoadingState.LOADING);
    });
  });
});
