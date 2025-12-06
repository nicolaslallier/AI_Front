import { describe, it, expect } from 'vitest';

import { GrafanaLoadingState, GrafanaErrorType } from './index';

import type { GrafanaError, GrafanaState } from './index';

describe('grafana feature exports', () => {
  it('should export GrafanaLoadingState enum', () => {
    expect(GrafanaLoadingState).toBeDefined();
    expect(GrafanaLoadingState.IDLE).toBe('idle');
  });

  it('should export GrafanaErrorType enum', () => {
    expect(GrafanaErrorType).toBeDefined();
    expect(GrafanaErrorType.NETWORK_ERROR).toBe('network_error');
  });

  it('should export GrafanaError type', () => {
    const error: GrafanaError = {
      type: GrafanaErrorType.UNKNOWN_ERROR,
      message: 'Test error',
      timestamp: new Date(),
    };

    expect(error).toBeDefined();
  });

  it('should export GrafanaState type', () => {
    const state: GrafanaState = {
      loadingState: GrafanaLoadingState.IDLE,
      error: null,
      url: 'http://localhost/grafana/',
      retryCount: 0,
    };

    expect(state).toBeDefined();
  });
});
