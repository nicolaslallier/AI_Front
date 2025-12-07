import { ref, computed, type Ref } from 'vue';

import { MinioLoadingState, MinioErrorType, type MinioState, type MinioError } from '../types/index';

import { config } from '@/core/config';

/**
 * Composable return type for useMinio
 */
export interface UseMinioReturn {
  state: Ref<MinioState>;
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: MinioErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
}

/**
 * Creates computed properties for MinIO state
 *
 * @param state - Reactive MinIO state reference
 * @returns Computed properties for loading, error, and loaded states
 */
function createComputedProperties(state: Ref<MinioState>): {
  isLoading: Ref<boolean>;
  hasError: Ref<boolean>;
  isLoaded: Ref<boolean>;
} {
  const isLoading = computed((): boolean => {
    return state.value.loadingState === MinioLoadingState.LOADING;
  });

  const hasError = computed((): boolean => {
    return state.value.error !== null;
  });

  const isLoaded = computed((): boolean => {
    return state.value.loadingState === MinioLoadingState.LOADED;
  });

  return { isLoading, hasError, isLoaded };
}

/**
 * Creates state management functions for MinIO
 *
 * @param state - Reactive MinIO state reference
 * @returns State management functions
 */
function createStateFunctions(state: Ref<MinioState>): {
  setLoading: () => void;
  setLoaded: () => void;
  setError: (type: MinioErrorType, message: string, details?: string) => void;
  reset: () => void;
  incrementRetryCount: () => void;
} {
  /**
   * Sets the state to loading and clears any existing errors
   */
  function setLoading(): void {
    state.value.loadingState = MinioLoadingState.LOADING;
    state.value.error = null;
  }

  /**
   * Sets the state to loaded successfully and clears any existing errors
   */
  function setLoaded(): void {
    state.value.loadingState = MinioLoadingState.LOADED;
    state.value.error = null;
  }

  /**
   * Sets an error state with the provided error information
   *
   * @param type - The type of error that occurred
   * @param message - Human-readable error message
   * @param details - Optional technical details for debugging
   */
  function setError(type: MinioErrorType, message: string, details?: string): void {
    const error: MinioError = {
      type,
      message,
      timestamp: new Date(),
      details,
    };

    state.value.loadingState = MinioLoadingState.ERROR;
    state.value.error = error;
  }

  /**
   * Resets the state to initial values
   */
  function reset(): void {
    state.value.loadingState = MinioLoadingState.IDLE;
    state.value.error = null;
    state.value.retryCount = 0;
  }

  /**
   * Increments the retry count
   */
  function incrementRetryCount(): void {
    state.value.retryCount += 1;
  }

  return { setLoading, setLoaded, setError, reset, incrementRetryCount };
}

/**
 * MinIO composable
 * Manages state and operations for MinIO console integration
 *
 * Follows the Single Responsibility Principle by focusing on MinIO state management
 * Separates business logic from UI components for better testability
 *
 * @param url - Optional MinIO console URL override
 * @returns MinIO state and control functions
 *
 * @example
 * const { state, isLoading, setLoading, setLoaded, setError } = useMinio();
 *
 * // Set loading state
 * setLoading();
 *
 * // Set loaded state
 * setLoaded();
 *
 * // Set error state
 * setError(MinioErrorType.NETWORK_ERROR, 'Failed to load MinIO console');
 */
export function useMinio(url?: string): UseMinioReturn {
  const state = ref<MinioState>({
    loadingState: MinioLoadingState.IDLE,
    error: null,
    url: url || config.minioUrl,
    retryCount: 0,
  });

  const computedProperties = createComputedProperties(state);
  const stateFunctions = createStateFunctions(state);

  return {
    state,
    ...computedProperties,
    ...stateFunctions,
  };
}
