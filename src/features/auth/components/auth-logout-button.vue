<template>
  <button
    @click="handleLogout"
    :disabled="loading"
    :class="buttonClasses"
    class="rounded-lg px-4 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
      Signing out...
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
 * Logout button component
 *
 * Triggers Keycloak logout (SSO + local session clear) when clicked.
 * Shows loading state during logout process.
 *
 * Implements FR-FE-KC-004 (logout flow).
 */
export default defineComponent({
  name: 'AuthLogoutButton',

  props: {
    /**
     * Button label text
     */
    label: {
      type: String,
      default: 'Sign Out',
    },

    /**
     * Button variant style
     */
    variant: {
      type: String as () => 'primary' | 'secondary' | 'danger',
      default: 'secondary',
      validator: (value: string): boolean => ['primary', 'secondary', 'danger'].includes(value),
    },

    /**
     * Show confirmation dialog before logout
     */
    confirm: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const auth = useAuth();

    /**
     * Computed button classes based on variant and state
     */
    const buttonClasses = computed<string>(() => {
      const baseClasses = 'disabled:opacity-50 disabled:cursor-not-allowed';

      if (props.variant === 'danger') {
        return `bg-red-600 text-white hover:bg-red-700 ${baseClasses}`;
      }

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
     * Handles logout button click
     */
    async function handleLogout(): Promise<void> {
      try {
        // Show confirmation if enabled
        if (props.confirm) {
          const confirmed = window.confirm('Are you sure you want to sign out?');
          if (!confirmed) {
            return;
          }
        }

        Logger.info('Logout button clicked');
        await auth.logout();
        // Logout will redirect, so this code won't execute
      } catch (error) {
        Logger.error('Logout failed', error);
        // Error is handled in the auth store
      }
    }

    return {
      buttonClasses,
      loading,
      handleLogout,
    };
  },
});
</script>
