import { describe, it, expect } from 'vitest';

import { PrometheusLoadingState, PrometheusErrorType } from './index';

import type { PrometheusError, PrometheusState } from './index';

describe('prometheus feature exports', () => {
  it('should export PrometheusLoadingState enum', () => {
    expect(PrometheusLoadingState).toBeDefined();
    expect(PrometheusLoadingState.IDLE).toBe('idle');
  });

  it('should export PrometheusErrorType enum', () => {
    expect(PrometheusErrorType).toBeDefined();
    expect(PrometheusErrorType.NETWORK_ERROR).toBe('network_error');
  });

  it('should export PrometheusError type', () => {
    const error: PrometheusError = {
      type: PrometheusErrorType.UNKNOWN_ERROR,
      message: 'Test error',
      timestamp: new Date(),
    };

    expect(error).toBeDefined();
  });

  it('should export PrometheusState type', () => {
    const state: PrometheusState = {
      loadingState: PrometheusLoadingState.IDLE,
      error: null,
      url: 'http://localhost/prometheus/',
      retryCount: 0,
    };

    expect(state).toBeDefined();
  });
});
