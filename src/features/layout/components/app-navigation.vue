<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex space-x-8 py-4">
        <router-link
          v-for="item in visibleItems"
          :key="item.id"
          :to="item.path"
          class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          active-class="text-indigo-600 bg-indigo-50"
        >
          {{ item.label }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';

import type { NavigationItem } from '../types/index';

import { useAuth } from '@/core/auth';

/**
 * Application navigation component
 *
 * Renders a horizontal navigation menu with dynamic items.
 * Filters navigation items based on visibility and user roles.
 *
 * Implements FR-FE-KC-009 (role-based menu filtering).
 */
export default defineComponent({
  name: 'AppNavigation',

  props: {
    /**
     * Array of navigation items to display
     */
    items: {
      type: Array as PropType<NavigationItem[]>,
      required: true,
    },
  },

  setup(props) {
    const auth = useAuth();

    /**
     * Computed property that filters navigation items based on:
     * 1. Visibility flag
     * 2. User roles (if requiredRoles specified)
     *
     * Items without a visible property default to visible (true).
     * Items without requiredRoles are visible to all authenticated users.
     *
     * Implements FR-FE-KC-009 (role-based UI control).
     *
     * @returns Array of visible navigation items
     */
    const visibleItems = computed((): NavigationItem[] => {
      return props.items.filter((item) => {
        // Check basic visibility flag
        if (item.visible === false) {
          return false;
        }

        // If item has required roles, check if user has them
        if (item.requiredRoles && item.requiredRoles.length > 0) {
          // User must be authenticated to have roles
          if (!auth.isAuthenticated.value) {
            return false;
          }

          // Check if user has any of the required roles
          return auth.hasAnyRole(item.requiredRoles);
        }

        // Item is visible (no role requirements)
        return true;
      });
    });

    return {
      visibleItems,
    };
  },
});
</script>
