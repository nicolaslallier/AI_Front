<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <app-header class="flex-shrink-0" />
    <app-navigation :items="navigationItems" class="flex-shrink-0" />
    <main class="flex-1 overflow-auto min-h-0">
      <div class="h-full">
        <router-view />
      </div>
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
        // Storage section
        {
          id: 'minio',
          label: 'MinIO Storage',
          path: '/minio',
          visible: true,
          requiredRoles: ['ROLE_MINIO_ADMIN', 'ROLE_MINIO_READONLY'],
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
