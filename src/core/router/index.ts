import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import { authGuard, roleGuard } from '@/core/auth';
import { Logger } from '@/shared/utils/logger';

/**
 * Application route definitions
 * Structured with shell layout wrapping all child routes
 *
 * Route meta fields:
 * - title: Page title
 * - requiresAuth: Whether route requires authentication (default: true for all routes)
 * - requiredRoles: Array of roles required to access the route
 * - roleMatchMode: 'any' (default) or 'all' - how to match multiple roles
 */
const routes: RouteRecordRaw[] = [
  // Authentication callback route (public, no layout)
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: () => import('@/features/auth/views/auth-callback-view.vue'),
    meta: {
      title: 'Authenticating',
      requiresAuth: false,
    },
  },

  // Unauthorized access route (public, no layout)
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/features/auth/views/unauthorized-view.vue'),
    meta: {
      title: 'Access Denied',
      requiresAuth: false,
    },
  },

  // Main application routes with shell layout
  {
    path: '/',
    component: () => import('@/features/layout/components/app-shell.vue'),
    children: [
      {
        path: '',
        redirect: '/home',
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/features/counter/views/home-view.vue'),
        meta: {
          title: 'Home',
          requiresAuth: true, // All routes require auth as per user requirement
        },
      },
      {
        path: 'grafana',
        name: 'grafana',
        component: () => import('@/features/grafana/views/grafana-view.vue'),
        meta: {
          title: 'Grafana',
          requiresAuth: true,
          requiredRoles: ['ROLE_DEVOPS', 'ROLE_SECOPS', 'ROLE_OBS_VIEWER'],
          roleMatchMode: 'any',
        },
      },
      {
        path: 'pgadmin',
        name: 'pgadmin',
        component: () => import('@/features/pgadmin/views/pgadmin-view.vue'),
        meta: {
          title: 'pgAdmin',
          requiresAuth: true,
          requiredRoles: ['ROLE_DBA', 'ROLE_DB_ADMIN'],
          roleMatchMode: 'any',
        },
      },
      {
        path: 'keycloak',
        name: 'keycloak-admin',
        component: () => import('@/features/keycloak-admin/views/keycloak-admin-view.vue'),
        meta: {
          title: 'Keycloak Admin',
          requiresAuth: true,
          requiredRoles: ['ROLE_IAM_ADMIN'],
          roleMatchMode: 'any',
        },
      },
      {
        path: 'logs',
        name: 'loki',
        component: () => import('@/features/loki/views/loki-view.vue'),
        meta: {
          title: 'Logs (Loki)',
          requiresAuth: true,
          requiredRoles: ['ROLE_DEVOPS', 'ROLE_SECOPS', 'ROLE_OBS_VIEWER'],
          roleMatchMode: 'any',
        },
      },
      {
        path: 'traces',
        name: 'tempo',
        component: () => import('@/features/tempo/views/tempo-view.vue'),
        meta: {
          title: 'Traces (Tempo)',
          requiresAuth: true,
          requiredRoles: ['ROLE_DEVOPS', 'ROLE_SECOPS', 'ROLE_OBS_VIEWER'],
          roleMatchMode: 'any',
        },
      },
      {
        path: 'metrics',
        name: 'prometheus',
        component: () => import('@/features/prometheus/views/prometheus-view.vue'),
        meta: {
          title: 'Metrics (Prometheus)',
          requiresAuth: true,
          requiredRoles: ['ROLE_DEVOPS', 'ROLE_SECOPS', 'ROLE_OBS_VIEWER'],
          roleMatchMode: 'any',
        },
      },
    ],
  },

  // Catch-all redirect to home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home',
  },
];

/**
 * Creates and configures the Vue Router instance
 *
 * Uses HTML5 history mode for clean URLs
 * Implements shell-based layout with nested routing
 *
 * @returns Configured router instance
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/**
 * Global navigation guards
 *
 * Executed in order:
 * 1. Authentication guard - checks if user is authenticated
 * 2. Role guard - checks if user has required roles
 * 3. Title/logging guard - updates title and logs navigation
 */

// Authentication guard (FR-FE-KC-010)
router.beforeEach(authGuard);

// Role-based authorization guard (FR-FE-KC-009)
router.beforeEach(roleGuard);

// Title and logging guard
router.beforeEach((to, from, next) => {
  const title = to.meta.title as string;
  if (title) {
    document.title = `${title} | AI Front`;
  }

  // Log navigation for audit purposes (FR-008)
  if (from.name !== to.name) {
    Logger.info('Navigation', {
      from: from.name || from.path,
      to: to.name || to.path,
      timestamp: new Date().toISOString(),
    });
  }

  next();
});

export default router;
