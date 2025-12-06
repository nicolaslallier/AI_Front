import { describe, it, expect } from 'vitest';

import { TempoLoadingState, TempoErrorType } from './index';

import type { TempoError, TempoState } from './index';

describe('tempo feature exports', () => {
  it('should export TempoLoadingState enum', () => {
    expect(TempoLoadingState).toBeDefined();
    expect(TempoLoadingState.IDLE).toBe('idle');
  });

  it('should export TempoErrorType enum', () => {
    expect(TempoErrorType).toBeDefined();
    expect(TempoErrorType.NETWORK_ERROR).toBe('network_error');
  });

  it('should export TempoError type', () => {
    const error: TempoError = {
      type: TempoErrorType.UNKNOWN_ERROR,
      message: 'Test error',
      timestamp: new Date(),
    };

    expect(error).toBeDefined();
  });

  it('should export TempoState type', () => {
    const state: TempoState = {
      loadingState: TempoLoadingState.IDLE,
      error: null,
      url: 'http://localhost/tempo/',
      retryCount: 0,
    };

    expect(state).toBeDefined();
  });
});
