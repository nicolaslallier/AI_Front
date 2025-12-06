<template>
  <button
    @click="handleLogin"
    :disabled="loading"
    :class="buttonClasses"
    class="rounded-lg px-4 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    <span v-if="loading" class="flex items-center">
      <svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Signing in...
    </span>
    <span v-else>
      {{ label }}
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { useAuth } from '@/core/auth';
import { Logger } from '@/shared/utils/logger';

/**
 * Login button component
 *
 * Triggers Keycloak login redirect when clicked.
 * Shows loading state during authentication process.
 *
 * Implements FR-FE-KC-003 (login flow initiation).
 */
export default defineComponent({
  name: 'AuthLoginButton',

  props: {
    /**
     * Button label text
     */
    label: {
      type: String,
      default: 'Sign In',
    },

    /**
     * Button variant style
     */
    variant: {
      type: String as () => 'primary' | 'secondary',
      default: 'primary',
      validator: (value: string): boolean => ['primary', 'secondary'].includes(value),
    },
  },

  setup(props) {
    const auth = useAuth();

    /**
     * Computed button classes based on variant and state
     */
    const buttonClasses = computed<string>(() => {
      const baseClasses = 'disabled:opacity-50 disabled:cursor-not-allowed';

      if (props.variant === 'primary') {
        return `bg-blue-600 text-white hover:bg-blue-700 ${baseClasses}`;
      }

      return `bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 ${baseClasses}`;
    });

    /**
     * Loading state from auth store
     */
    const loading = computed<boolean>(() => auth.loading.value);

    /**
     * Handles login button click
     */
    async function handleLogin(): Promise<void> {
      try {
        Logger.info('Login button clicked');
        await auth.login();
        // Login will redirect, so this code won't execute
      } catch (error) {
        Logger.error('Login failed', error);
        // Error is handled in the auth store
      }
    }

    return {
      buttonClasses,
      loading,
      handleLogin,
    };
  },
});
</script>
