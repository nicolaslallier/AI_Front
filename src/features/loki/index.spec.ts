import { describe, it, expect } from 'vitest';

import { LokiLoadingState, LokiErrorType } from './index';

import type { LokiError, LokiState } from './index';

describe('loki feature exports', () => {
  it('should export LokiLoadingState enum', () => {
    expect(LokiLoadingState).toBeDefined();
    expect(LokiLoadingState.IDLE).toBe('idle');
  });

  it('should export LokiErrorType enum', () => {
    expect(LokiErrorType).toBeDefined();
    expect(LokiErrorType.NETWORK_ERROR).toBe('network_error');
  });

  it('should export LokiError type', () => {
    const error: LokiError = {
      type: LokiErrorType.UNKNOWN_ERROR,
      message: 'Test error',
      timestamp: new Date(),
    };

    expect(error).toBeDefined();
  });

  it('should export LokiState type', () => {
    const state: LokiState = {
      loadingState: LokiLoadingState.IDLE,
      error: null,
      url: 'http://localhost/loki/',
      retryCount: 0,
    };

    expect(state).toBeDefined();
  });
});
