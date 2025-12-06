<template>
  <div class="w-full h-full">
    <!-- Error State -->
    <keycloak-admin-error v-if="hasError && state.error" :error="state.error" @retry="handleRetry" />

    <!-- Keycloak Admin Iframe -->
    <keycloak-admin-iframe v-else :url="state.url" :is-loading="isLoading" @load="handleLoad" @error="handleError" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import KeycloakAdminError from '../components/keycloak-admin-error.vue';
import KeycloakAdminIframe from '../components/keycloak-admin-iframe.vue';
import { useKeycloakAdmin } from '../composables/use-keycloak-admin';
import { KeycloakAdminErrorType } from '../types/index';

import { Logger } from '@/shared/utils/logger';

/**
 * Keycloak Admin view component
 * Container component that orchestrates Keycloak Admin iframe and error handling
 *
 * Follows the Dependency Inversion Principle by depending on composable abstraction
 * Implements proper error boundaries and retry mechanism
 */
export default defineComponent({
  name: 'KeycloakAdminView',

  components: {
    KeycloakAdminIframe,
    KeycloakAdminError,
  },

  setup() {
    const { state, isLoading, hasError, setLoading, setLoaded, setError, incrementRetryCount } = useKeycloakAdmin();

    /**
     * Handles successful iframe load
     * Transitions state to loaded and clears any errors
     */
    function handleLoad(): void {
      setLoaded();
      Logger.info('Keycloak Admin loaded successfully');
    }

    /**
     * Handles iframe load error
     * Sets error state with appropriate message
     */
    function handleError(): void {
      setError(
        KeycloakAdminErrorType.IFRAME_ERROR,
        'Unable to load Keycloak Admin. Please check that the service is running and accessible.',
        'The iframe failed to load the Keycloak Admin content. This could be due to network issues, CORS restrictions, or Keycloak Admin being unavailable.',
      );
      Logger.error('Keycloak Admin failed to load', { url: state.value.url });
    }

    /**
     * Handles retry action from error component
     * Resets error state and attempts to reload
     */
    function handleRetry(): void {
      incrementRetryCount();
      setLoading();
      Logger.info('Retrying Keycloak Admin load', { retryCount: state.value.retryCount });
    }

    /**
     * Lifecycle hook - set loading state on mount
     */
    onMounted(() => {
      setLoading();
      Logger.info('Keycloak Admin view mounted', { url: state.value.url });
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
