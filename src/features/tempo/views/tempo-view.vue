<template>
  <div class="w-full h-full min-h-full">
    <!-- Error State -->
    <tempo-error v-if="hasError && state.error" :error="state.error" @retry="handleRetry" />

    <!-- Tempo Iframe -->
    <tempo-iframe v-else :url="state.url" :is-loading="isLoading" @load="handleLoad" @error="handleError" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import TempoError from '../components/tempo-error.vue';
import TempoIframe from '../components/tempo-iframe.vue';
import { useTempo } from '../composables/use-tempo';
import { TempoErrorType } from '../types/index';

import { Logger } from '@/shared/utils/logger';

/**
 * Tempo view component
 * Container component that orchestrates Tempo iframe and error handling
 *
 * Follows the Dependency Inversion Principle by depending on composable abstraction
 * Implements proper error boundaries and retry mechanism
 */
export default defineComponent({
  name: 'TempoView',

  components: {
    TempoIframe,
    TempoError,
  },

  setup() {
    const { state, isLoading, hasError, setLoading, setLoaded, setError, incrementRetryCount } = useTempo();

    /**
     * Handles successful iframe load
     * Transitions state to loaded and clears any errors
     */
    function handleLoad(): void {
      setLoaded();
      Logger.info('Tempo loaded successfully');
    }

    /**
     * Handles iframe load error
     * Sets error state with appropriate message
     */
    function handleError(): void {
      setError(
        TempoErrorType.IFRAME_ERROR,
        'Unable to load Tempo. Please check that the service is running and accessible.',
        'The iframe failed to load the Tempo content. This could be due to network issues, CORS restrictions, or Tempo being unavailable.',
      );
      Logger.error('Tempo failed to load', { url: state.value.url });
    }

    /**
     * Handles retry action from error component
     * Resets error state and attempts to reload
     */
    function handleRetry(): void {
      incrementRetryCount();
      setLoading();
      Logger.info('Retrying Tempo load', { retryCount: state.value.retryCount });
    }

    /**
     * Lifecycle hook - set loading state on mount
     */
    onMounted(() => {
      setLoading();
      Logger.info('Tempo view mounted', { url: state.value.url });
    });

    return {
      state,
      isLoading,
      hasError,
      handleLoad,
      handleError,
      handleRetry,
    };
  },
});
</script>
