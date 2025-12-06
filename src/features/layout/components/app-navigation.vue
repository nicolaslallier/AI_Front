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

/**
 * Application navigation component
 * Renders a horizontal navigation menu with dynamic items
 * Follows the Open/Closed Principle by accepting navigation items through props
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
    /**
     * Computed property that filters out invisible navigation items
     * Items without a visible property default to visible (true)
     *
     * @returns Array of visible navigation items
     */
    const visibleItems = computed((): NavigationItem[] => {
      return props.items.filter((item) => item.visible !== false);
    });

    return {
      visibleItems,
    };
  },
});
</script>
