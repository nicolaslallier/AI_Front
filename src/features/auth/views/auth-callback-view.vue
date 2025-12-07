<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="mb-4">
        <div class="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
      <h1 class="text-2xl font-semibold text-gray-900">Authenticating...</h1>
      <p class="mt-2 text-gray-600">Please wait while we complete your login.</p>
      <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getAndClearIntendedRoute, useAuth } from '@/core/auth';
import { Logger } from '@/shared/utils/logger';

/**
 * Authentication callback view
 *
 * Handles the redirect from Keycloak after login.
 * Processes the authorization code and redirects to intended destination.
 *
 * Implements FR-FE-KC-003 (login flow completion).
 */
export default defineComponent({
  name: 'AuthCallbackView',

  setup() {
    const router = useRouter();
    const auth = useAuth();
    const error = ref<string | null>(null);

    /**
     * Processes the authentication callback
     *
     * After Keycloak redirects back, the Keycloak service automatically
     * processes the authorization code. We need to wait for authentication
     * to complete and then redirect to the intended route.
     */
    async function handleCallback(): Promise<void> {
      try {
        Logger.info('Processing authentication callback...');

        // Wait for authentication to complete with polling (max 10 seconds)
        const maxAttempts = 20; // 20 attempts * 500ms = 10 seconds max
        let attempts = 0;

        while (attempts < maxAttempts) {
          // Check if user is authenticated
          if (auth.isAuthenticated.value) {
            Logger.info('Authentication successful, redirecting to intended route');

            // Get intended route or default to home
            const intendedRoute = getAndClearIntendedRoute() || '/home';

            // Redirect to intended destination
            await router.push(intendedRoute);
            return;
          }

          // Wait 500ms before next check
          await new Promise((resolve) => setTimeout(resolve, 500));
          attempts++;

          if (attempts % 4 === 0) {
            Logger.info(`Still waiting for authentication... (${attempts}/20)`);
          }
        }

        // Timeout reached, authentication failed
        throw new Error('Authentication timeout - please try again');
      } catch (err) {
        Logger.error('Authentication callback failed', err);
        error.value = err instanceof Error ? err.message : 'Authentication failed';

        // Clear any stored session to prevent loops
        try {
          sessionStorage.removeItem('kc_session');
        } catch {
          // Ignore storage errors
        }

        // Show error for 3 seconds, then redirect to home
        // This will trigger auth guard which will restart login flow
        setTimeout(() => {
          router.push('/home');
        }, 3000);
      }
    }

    onMounted(() => {
      handleCallback();
    });

    return {
      error,
    };
  },
});
</script>
