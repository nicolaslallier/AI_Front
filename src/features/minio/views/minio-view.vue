<template>
  <div class="w-full h-full min-h-full">
    <!-- Error State -->
    <minio-error v-if="hasError && state.error" :error="state.error" @retry="handleRetry" />

    <!-- MinIO Iframe -->
    <minio-iframe v-else :url="state.url" :is-loading="isLoading" @load="handleLoad" @error="handleError" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import MinioError from '../components/minio-error.vue';
import MinioIframe from '../components/minio-iframe.vue';
import { useMinio } from '../composables/use-minio';
import { MinioErrorType } from '../types/index';

import { Logger } from '@/shared/utils/logger';

/**
 * MinIO view component
 * Container component that orchestrates MinIO console iframe and error handling
 *
 * Follows the Dependency Inversion Principle by depending on composable abstraction
 * Implements proper error boundaries and retry mechanism
 */
export default defineComponent({
  name: 'MinioView',

  components: {
    MinioIframe,
    MinioError,
  },

  setup() {
    const { state, isLoading, hasError, setLoading, setLoaded, setError, incrementRetryCount } = useMinio();

    /**
     * Handles successful iframe load
     * Transitions state to loaded and clears any errors
     */
    function handleLoad(): void {
      setLoaded();
      Logger.info('MinIO console loaded successfully');
    }

    /**
     * Handles iframe load error
     * Sets error state with appropriate message
     */
    function handleError(): void {
      setError(
        MinioErrorType.IFRAME_ERROR,
        'Unable to load MinIO console. Please check that the service is running and accessible.',
        'The iframe failed to load the MinIO console content. This could be due to network issues, CORS restrictions, or MinIO being unavailable.',
      );
      Logger.error('MinIO console failed to load', { url: state.value.url });
    }

    /**
     * Handles retry action from error component
     * Resets error state and attempts to reload
     */
    function handleRetry(): void {
      incrementRetryCount();
      setLoading();
      Logger.info('Retrying MinIO console load', { retryCount: state.value.retryCount });
    }

    /**
     * Lifecycle hook - set loading state on mount
     */
    onMounted(() => {
      setLoading();
      Logger.info('MinIO view mounted', { url: state.value.url });
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
