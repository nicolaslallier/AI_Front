<template>
  <div class="w-full h-full">
    <!-- Error State -->
    <grafana-error v-if="hasError && state.error" :error="state.error" @retry="handleRetry" />

    <!-- Grafana Iframe -->
    <grafana-iframe v-else :url="state.url" :is-loading="isLoading" @load="handleLoad" @error="handleError" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import GrafanaError from '../components/grafana-error.vue';
import GrafanaIframe from '../components/grafana-iframe.vue';
import { useGrafana } from '../composables/use-grafana';
import { GrafanaErrorType } from '../types/index';

import { Logger } from '@/shared/utils/logger';

/**
 * Grafana view component
 * Container component that orchestrates Grafana iframe and error handling
 *
 * Follows the Dependency Inversion Principle by depending on composable abstraction
 * Implements proper error boundaries and retry mechanism
 */
export default defineComponent({
  name: 'GrafanaView',

  components: {
    GrafanaIframe,
    GrafanaError,
  },

  setup() {
    const { state, isLoading, hasError, setLoading, setLoaded, setError, incrementRetryCount } = useGrafana();

    /**
     * Handles successful iframe load
     * Transitions state to loaded and clears any errors
     */
    function handleLoad(): void {
      setLoaded();
      Logger.info('Grafana loaded successfully');
    }

    /**
     * Handles iframe load error
     * Sets error state with appropriate message
     */
    function handleError(): void {
      setError(
        GrafanaErrorType.IFRAME_ERROR,
        'Unable to load Grafana. Please check that the service is running and accessible.',
        'The iframe failed to load the Grafana content. This could be due to network issues, CORS restrictions, or Grafana being unavailable.',
      );
      Logger.error('Grafana failed to load', { url: state.value.url });
    }

    /**
     * Handles retry action from error component
     * Resets error state and attempts to reload
     */
    function handleRetry(): void {
      incrementRetryCount();
      setLoading();
      Logger.info('Retrying Grafana load', { retryCount: state.value.retryCount });
    }

    /**
     * Lifecycle hook - set loading state on mount
     */
    onMounted(() => {
      setLoading();
      Logger.info('Grafana view mounted', { url: state.value.url });
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
