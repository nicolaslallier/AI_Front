<template>
  <section class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">Quick Access</h2>
      <div v-if="visibleItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <quick-access-card
          v-for="item in visibleItems"
          :key="item.id"
          :title="item.title"
          :description="item.description"
          :path="item.path"
          :icon="item.icon"
        />
      </div>
      <div v-else class="text-center text-gray-600 py-8">
        <p>No quick-access items available for your role.</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';

import QuickAccessCard from './quick-access-card.vue';

import type { QuickAccessItem } from '../types';

import { useAuth } from '@/core/auth';

/**
 * Quick access grid component
 *
 * Displays a responsive grid of quick-access cards with role-based filtering.
 * Implements FR-HOME-006 (quick-access buttons for common actions).
 *
 * Design principles:
 * - Role-based access control using existing useAuth composable
 * - Responsive grid layout (1 col mobile, 2 cols tablet, 3-4 cols desktop)
 * - Empty state handling when no items are available
 * - Semantic HTML structure
 *
 * Role filtering follows the same pattern as app-navigation.vue for consistency.
 */
export default defineComponent({
  name: 'QuickAccessGrid',

  components: {
    QuickAccessCard,
  },

  props: {
    /**
     * Array of quick-access items to display
     * Items with requiredRoles will be filtered based on user permissions
     */
    items: {
      type: Array as PropType<QuickAccessItem[]>,
      required: true,
    },
  },

  setup(props) {
    const auth = useAuth();

    /**
     * Computed property that filters items based on user roles
     *
     * Filtering logic:
     * 1. Items without requiredRoles are visible to all authenticated users
     * 2. Items with requiredRoles require user to have at least one of those roles
     * 3. Non-authenticated users see no items (though they shouldn't reach this page)
     *
     * Implements FR-FE-KC-009 (role-based UI control) consistently with navigation.
     *
     * @returns Array of visible quick-access items for the current user
     */
    const visibleItems = computed((): QuickAccessItem[] => {
      return props.items.filter((item) => {
        // If item has required roles, check if user has them
        if (item.requiredRoles && item.requiredRoles.length > 0) {
          // User must be authenticated to have roles
          if (!auth.isAuthenticated.value) {
            return false;
          }

          // Check if user has any of the required roles
          return auth.hasAnyRole(item.requiredRoles);
        }

        // Item has no role requirements, visible to all
        return true;
      });
    });

    return {
      visibleItems,
    };
  },
});
</script>
