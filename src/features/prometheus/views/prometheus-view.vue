<template>
  <div class="w-full h-full">
    <!-- Error State -->
    <prometheus-error v-if="hasError && state.error" :error="state.error" @retry="handleRetry" />

    <!-- Prometheus Iframe -->
    <prometheus-iframe v-else :url="state.url" :is-loading="isLoading" @load="handleLoad" @error="handleError" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import PrometheusError from '../components/prometheus-error.vue';
import PrometheusIframe from '../components/prometheus-iframe.vue';
import { usePrometheus } from '../composables/use-prometheus';
import { PrometheusErrorType } from '../types/index';

import { Logger } from '@/shared/utils/logger';

/**
 * Prometheus view component
 * Container component that orchestrates Prometheus iframe and error handling
 *
 * Follows the Dependency Inversion Principle by depending on composable abstraction
 * Implements proper error boundaries and retry mechanism
 */
export default defineComponent({
  name: 'PrometheusView',

  components: {
    PrometheusIframe,
    PrometheusError,
  },

  setup() {
    const { state, isLoading, hasError, setLoading, setLoaded, setError, incrementRetryCount } = usePrometheus();

    /**
     * Handles successful iframe load
     * Transitions state to loaded and clears any errors
     */
    function handleLoad(): void {
      setLoaded();
      Logger.info('Prometheus loaded successfully');
    }

    /**
     * Handles iframe load error
     * Sets error state with appropriate message
     */
    function handleError(): void {
      setError(
        PrometheusErrorType.IFRAME_ERROR,
        'Unable to load Prometheus. Please check that the service is running and accessible.',
        'The iframe failed to load the Prometheus content. This could be due to network issues, CORS restrictions, or Prometheus being unavailable.',
      );
      Logger.error('Prometheus failed to load', { url: state.value.url });
    }

    /**
     * Handles retry action from error component
     * Resets error state and attempts to reload
     */
    function handleRetry(): void {
      incrementRetryCount();
      setLoading();
      Logger.info('Retrying Prometheus load', { retryCount: state.value.retryCount });
    }

    /**
     * Lifecycle hook - set loading state on mount
     */
    onMounted(() => {
      setLoading();
      Logger.info('Prometheus view mounted', { url: state.value.url });
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
