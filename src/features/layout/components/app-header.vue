<template>
  <header class="bg-indigo-600 text-white shadow-lg">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-bold">{{ title }}</h1>

      <!-- User profile section -->
      <div class="flex items-center space-x-4">
        <!-- Login button if not authenticated -->
        <auth-login-button v-if="!auth.isAuthenticated.value" />

        <!-- User profile if authenticated -->
        <user-profile v-else :show-roles="true" />
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useAuth } from '@/core/auth';
import { AuthLoginButton, UserProfile } from '@/features/auth';

/**
 * Application header component
 *
 * Displays the application title/logo in a consistent header bar.
 * Shows user profile when authenticated, or login button when not.
 *
 * Implements FR-FE-KC-009 (UI based on auth state).
 */
export default defineComponent({
  name: 'AppHeader',

  components: {
    AuthLoginButton,
    UserProfile,
  },

  props: {
    /**
     * Application title to display in the header
     * @default 'AI Front'
     */
    title: {
      type: String,
      default: 'AI Front',
    },
  },

  setup() {
    const auth = useAuth();

    return {
      auth,
    };
  },
});
</script>
