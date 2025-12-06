<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <app-header />
    <app-navigation :items="navigationItems" />
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import AppHeader from './app-header.vue';
import AppNavigation from './app-navigation.vue';

import type { NavigationItem } from '../types/index';

/**
 * Application shell component
 * Main layout wrapper that provides consistent header, navigation, and content structure
 * Follows the Dependency Inversion Principle by depending on navigation item abstraction
 */
export default defineComponent({
  name: 'AppShell',

  components: {
    AppHeader,
    AppNavigation,
  },

  setup() {
    /**
     * Navigation items configuration
     * Centralized definition of application navigation structure
     *
     * @returns Array of navigation items
     */
    const navigationItems = computed((): NavigationItem[] => {
      return [
        {
          id: 'home',
          label: 'Home',
          path: '/home',
          visible: true,
        },
        {
          id: 'grafana',
          label: 'Grafana',
          path: '/grafana',
          visible: true,
        },
      ];
    });

    return {
      navigationItems,
    };
  },
});
</script>
