<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md text-center">
      <div class="mb-6">
        <svg
          class="mx-auto h-16 w-16 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
      </div>

      <h1 class="mb-2 text-3xl font-bold text-gray-900">Access Denied</h1>

      <p class="mb-6 text-gray-600">You don't have permission to access this page.</p>

      <div v-if="requiredRoles.length > 0" class="mb-6 rounded-lg bg-gray-100 p-4">
        <p class="mb-2 text-sm font-semibold text-gray-700">Required Roles:</p>
        <div class="flex flex-wrap justify-center gap-2">
          <span
            v-for="role in requiredRoles"
            :key="role"
            class="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800"
          >
            {{ role }}
          </span>
        </div>
      </div>

      <div v-if="auth.isAuthenticated.value && auth.roles.value.length > 0" class="mb-6 rounded-lg bg-blue-50 p-4">
        <p class="mb-2 text-sm font-semibold text-gray-700">Your Current Roles:</p>
        <div class="flex flex-wrap justify-center gap-2">
          <span
            v-for="role in auth.roles.value"
            :key="role"
            class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
          >
            {{ role }}
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          @click="goHome"
          class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Go to Home
        </button>

        <button
          v-if="auth.isAuthenticated.value"
          @click="handleLogout"
          class="rounded-lg border-2 border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Sign Out
        </button>
      </div>

      <p v-if="fromRoute" class="mt-6 text-sm text-gray-500">
        Attempted to access: <span class="font-mono">{{ fromRoute }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuth } from '@/core/auth';

/**
 * Unauthorized access view
 *
 * Displayed when user tries to access a route they don't have permission for.
 * Shows which roles are required and what roles the user currently has.
 *
 * Implements FR-FE-KC-009 (role-based access control feedback).
 */
export default defineComponent({
  name: 'UnauthorizedView',

  setup() {
    const router = useRouter();
    const route = useRoute();
    const auth = useAuth();

    /**
     * Route the user was trying to access
     */
    const fromRoute = computed<string | undefined>(() => {
      return route.query.from as string | undefined;
    });

    /**
     * Roles required for the route
     */
    const requiredRoles = computed<string[]>(() => {
      const required = route.query.required as string | undefined;
      if (required) {
        return required.split(',').filter((r) => r.length > 0);
      }
      return [];
    });

    /**
     * Navigates to home page
     */
    function goHome(): void {
      router.push('/home');
    }

    /**
     * Handles logout action
     */
    async function handleLogout(): Promise<void> {
      try {
        await auth.logout();
      } catch {
        // Error handling is done in the store
        // Just navigate to home as fallback
        router.push('/home');
      }
    }

    return {
      auth,
      fromRoute,
      requiredRoles,
      goHome,
      handleLogout,
    };
  },
});
</script>
