<template>
  <div class="w-full h-full">
    <!-- Error State -->
    <loki-error v-if="hasError && state.error" :error="state.error" @retry="handleRetry" />

    <!-- Loki Iframe -->
    <loki-iframe v-else :url="state.url" :is-loading="isLoading" @load="handleLoad" @error="handleError" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import LokiError from '../components/loki-error.vue';
import LokiIframe from '../components/loki-iframe.vue';
import { useLoki } from '../composables/use-loki';
import { LokiErrorType } from '../types/index';

import { Logger } from '@/shared/utils/logger';

/**
 * Loki view component
 * Container component that orchestrates Loki iframe and error handling
 *
 * Follows the Dependency Inversion Principle by depending on composable abstraction
 * Implements proper error boundaries and retry mechanism
 */
export default defineComponent({
  name: 'LokiView',

  components: {
    LokiIframe,
    LokiError,
  },

  setup() {
    const { state, isLoading, hasError, setLoading, setLoaded, setError, incrementRetryCount } = useLoki();

    /**
     * Handles successful iframe load
     * Transitions state to loaded and clears any errors
     */
    function handleLoad(): void {
      setLoaded();
      Logger.info('Loki loaded successfully');
    }

    /**
     * Handles iframe load error
     * Sets error state with appropriate message
     */
    function handleError(): void {
      setError(
        LokiErrorType.IFRAME_ERROR,
        'Unable to load Loki. Please check that the service is running and accessible.',
        'The iframe failed to load the Loki content. This could be due to network issues, CORS restrictions, or Loki being unavailable.',
      );
      Logger.error('Loki failed to load', { url: state.value.url });
    }

    /**
     * Handles retry action from error component
     * Resets error state and attempts to reload
     */
    function handleRetry(): void {
      incrementRetryCount();
      setLoading();
      Logger.info('Retrying Loki load', { retryCount: state.value.retryCount });
    }

    /**
     * Lifecycle hook - set loading state on mount
     */
    onMounted(() => {
      setLoading();
      Logger.info('Loki view mounted', { url: state.value.url });
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
