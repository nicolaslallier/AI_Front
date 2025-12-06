<template>
  <div v-if="auth.isAuthenticated.value" class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 rounded-lg px-3 py-2 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
        <span class="text-sm font-semibold">
          {{ userInitials }}
        </span>
      </div>
      <div class="hidden text-left sm:block">
        <p class="text-sm font-medium text-gray-900">{{ auth.username.value }}</p>
        <p v-if="showRoles && auth.roles.value.length > 0" class="text-xs text-gray-500">
          {{ auth.roles.value[0] }}
        </p>
      </div>
      <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isDropdownOpen"
      class="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      <div class="border-b border-gray-200 px-4 py-3">
        <p class="text-sm font-semibold text-gray-900">{{ auth.username.value }}</p>
        <p v-if="auth.email.value" class="text-xs text-gray-500">{{ auth.email.value }}</p>
      </div>

      <div v-if="showRoles && auth.roles.value.length > 0" class="border-b border-gray-200 px-4 py-3">
        <p class="mb-2 text-xs font-semibold uppercase text-gray-500">Roles</p>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="role in auth.roles.value"
            :key="role"
            class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
          >
            {{ role }}
          </span>
        </div>
      </div>

      <div class="px-2 py-2">
        <button
          @click="handleLogout"
          :disabled="auth.loading.value"
          class="flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
        >
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          <span v-if="auth.loading.value">Signing out...</span>
          <span v-else>Sign Out</span>
        </button>
      </div>
    </div>

    <!-- Backdrop for closing dropdown -->
    <div v-if="isDropdownOpen" @click="closeDropdown" class="fixed inset-0 z-40" aria-hidden="true"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onUnmounted } from 'vue';

import { useAuth } from '@/core/auth';
import { Logger } from '@/shared/utils/logger';

/**
 * User profile component
 *
 * Displays authenticated user information with a dropdown menu.
 * Shows username, email, roles, and provides logout option.
 *
 * Implements FR-FE-KC-009 (role display for UI control).
 */
export default defineComponent({
  name: 'UserProfile',

  props: {
    /**
     * Show user roles in the profile
     */
    showRoles: {
      type: Boolean,
      default: true,
    },
  },

  setup() {
    const auth = useAuth();
    const isDropdownOpen = ref<boolean>(false);

    /**
     * Gets user initials from username
     */
    const userInitials = computed<string>(() => {
      const username = auth.username.value;
      if (!username) {
        return '??';
      }

      // Get first two letters or first letter of first two words
      const parts = username.split(/[\s._-]+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }

      return username.slice(0, 2).toUpperCase();
    });

    /**
     * Toggles dropdown menu visibility
     */
    function toggleDropdown(): void {
      isDropdownOpen.value = !isDropdownOpen.value;
    }

    /**
     * Closes dropdown menu
     */
    function closeDropdown(): void {
      isDropdownOpen.value = false;
    }

    /**
     * Handles logout action
     */
    async function handleLogout(): Promise<void> {
      try {
        closeDropdown();
        Logger.info('User profile logout clicked');
        await auth.logout();
        // Logout will redirect, so this code won't execute
      } catch (error) {
        Logger.error('Logout failed', error);
        // Error is handled in the auth store
      }
    }

    /**
     * Handles escape key to close dropdown
     */
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape' && isDropdownOpen.value) {
        closeDropdown();
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleEscape);
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape);
    });

    return {
      auth,
      isDropdownOpen,
      userInitials,
      toggleDropdown,
      closeDropdown,
      handleLogout,
    };
  },
});
</script>
