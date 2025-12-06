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
        // Observability & Monitoring section
        {
          id: 'grafana',
          label: 'Grafana',
          path: '/grafana',
          visible: true,
          requiredRoles: ['ROLE_DEVOPS', 'ROLE_SECOPS', 'ROLE_OBS_VIEWER'],
        },
        {
          id: 'loki',
          label: 'Logs (Loki)',
          path: '/logs',
          visible: true,
          requiredRoles: ['ROLE_DEVOPS', 'ROLE_SECOPS', 'ROLE_OBS_VIEWER'],
        },
        {
          id: 'tempo',
          label: 'Traces (Tempo)',
          path: '/traces',
          visible: true,
          requiredRoles: ['ROLE_DEVOPS', 'ROLE_SECOPS', 'ROLE_OBS_VIEWER'],
        },
        {
          id: 'prometheus',
          label: 'Metrics (Prometheus)',
          path: '/metrics',
          visible: true,
          requiredRoles: ['ROLE_DEVOPS', 'ROLE_SECOPS', 'ROLE_OBS_VIEWER'],
        },
        // Administration section
        {
          id: 'pgadmin',
          label: 'pgAdmin',
          path: '/pgadmin',
          visible: true,
          requiredRoles: ['ROLE_DBA', 'ROLE_DB_ADMIN'],
        },
        {
          id: 'keycloak-admin',
          label: 'Keycloak Admin',
          path: '/keycloak',
          visible: true,
          requiredRoles: ['ROLE_IAM_ADMIN'],
        },
      ];
    });

    return {
      navigationItems,
    };
  },
});
</script>
