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
     * processes the authorization code. We just need to wait for it to complete
     * and then redirect to the intended route.
     */
    async function handleCallback(): Promise<void> {
      try {
        Logger.info('Processing authentication callback...');

        // Wait a bit for Keycloak to process the callback
        // The Keycloak init should handle the code exchange automatically
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check if user is now authenticated
        if (auth.isAuthenticated.value) {
          Logger.info('Authentication successful, redirecting to intended route');

          // Get intended route or default to home
          const intendedRoute = getAndClearIntendedRoute() || '/home';

          // Redirect to intended destination
          await router.push(intendedRoute);
        } else {
          throw new Error('Authentication failed - user not authenticated after callback');
        }
      } catch (err) {
        Logger.error('Authentication callback failed', err);
        error.value = err instanceof Error ? err.message : 'Authentication failed';

        // Redirect to home after a delay
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
