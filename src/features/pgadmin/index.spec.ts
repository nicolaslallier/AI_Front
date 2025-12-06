import { describe, it, expect } from 'vitest';

import { PgAdminLoadingState, PgAdminErrorType } from './index';

import type { PgAdminError, PgAdminState } from './index';

describe('pgadmin feature exports', () => {
  it('should export PgAdminLoadingState enum', () => {
    expect(PgAdminLoadingState).toBeDefined();
    expect(PgAdminLoadingState.IDLE).toBe('idle');
  });

  it('should export PgAdminErrorType enum', () => {
    expect(PgAdminErrorType).toBeDefined();
    expect(PgAdminErrorType.NETWORK_ERROR).toBe('network_error');
  });

  it('should export PgAdminError type', () => {
    const error: PgAdminError = {
      type: PgAdminErrorType.UNKNOWN_ERROR,
      message: 'Test error',
      timestamp: new Date(),
    };

    expect(error).toBeDefined();
  });

  it('should export PgAdminState type', () => {
    const state: PgAdminState = {
      loadingState: PgAdminLoadingState.IDLE,
      error: null,
      url: 'http://localhost/pgadmin/',
      retryCount: 0,
    };

    expect(state).toBeDefined();
  });
});
