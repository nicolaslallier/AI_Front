<template>
  <div class="w-full h-full min-h-full">
    <!-- Error State -->
    <pgadmin-error v-if="hasError && state.error" :error="state.error" @retry="handleRetry" />

    <!-- pgAdmin Iframe -->
    <pgadmin-iframe v-else :url="state.url" :is-loading="isLoading" @load="handleLoad" @error="handleError" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import PgAdminError from '../components/pgadmin-error.vue';
import PgAdminIframe from '../components/pgadmin-iframe.vue';
import { usePgAdmin } from '../composables/use-pgadmin';
import { PgAdminErrorType } from '../types/index';

import { Logger } from '@/shared/utils/logger';

/**
 * pgAdmin view component
 * Container component that orchestrates pgAdmin iframe and error handling
 *
 * Follows the Dependency Inversion Principle by depending on composable abstraction
 * Implements proper error boundaries and retry mechanism
 */
export default defineComponent({
  name: 'PgAdminView',

  /* eslint-disable vue/no-unused-components */
  components: {
    PgAdminIframe,
    PgAdminError,
  },
  /* eslint-enable vue/no-unused-components */

  setup() {
    const { state, isLoading, hasError, setLoading, setLoaded, setError, incrementRetryCount } = usePgAdmin();

    /**
     * Handles successful iframe load
     * Transitions state to loaded and clears any errors
     */
    function handleLoad(): void {
      setLoaded();
      Logger.info('pgAdmin loaded successfully');
    }

    /**
     * Handles iframe load error
     * Sets error state with appropriate message
     */
    function handleError(): void {
      setError(
        PgAdminErrorType.IFRAME_ERROR,
        'Unable to load pgAdmin. Please check that the service is running and accessible.',
        'The iframe failed to load the pgAdmin content. This could be due to network issues, CORS restrictions, or pgAdmin being unavailable.',
      );
      Logger.error('pgAdmin failed to load', { url: state.value.url });
    }

    /**
     * Handles retry action from error component
     * Resets error state and attempts to reload
     */
    function handleRetry(): void {
      incrementRetryCount();
      setLoading();
      Logger.info('Retrying pgAdmin load', { retryCount: state.value.retryCount });
    }

    /**
     * Lifecycle hook - set loading state on mount
     */
    onMounted(() => {
      setLoading();
      Logger.info('pgAdmin view mounted', { url: state.value.url });
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
