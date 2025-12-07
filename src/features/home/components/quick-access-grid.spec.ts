import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';

import QuickAccessCard from './quick-access-card.vue';
import QuickAccessGrid from './quick-access-grid.vue';

import type { QuickAccessItem } from '../types';

// Type for mocked auth - use any for test mocks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockAuth = any;

// Mock the useAuth composable
vi.mock('@/core/auth', () => ({
  useAuth: vi.fn(),
}));

describe('QuickAccessGrid', () => {
  // Helper function to create a test router
  const createTestRouter = (): ReturnType<typeof createRouter> => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/grafana', name: 'grafana', component: { template: '<div>Grafana</div>' } },
        { path: '/pgadmin', name: 'pgadmin', component: { template: '<div>pgAdmin</div>' } },
        { path: '/keycloak', name: 'keycloak', component: { template: '<div>Keycloak</div>' } },
      ],
    });
  };

  // Sample test data
  const testItems: QuickAccessItem[] = [
    {
      id: 'grafana',
      title: 'Grafana',
      description: 'Dashboards and Visualizations',
      path: '/grafana',
      icon: '📊',
      requiredRoles: ['ROLE_DEVOPS', 'ROLE_OBS_VIEWER'],
    },
    {
      id: 'pgadmin',
      title: 'pgAdmin',
      description: 'Database Administration',
      path: '/pgadmin',
      icon: '🗄️',
      requiredRoles: ['ROLE_DBA', 'ROLE_DB_ADMIN'],
    },
    {
      id: 'keycloak',
      title: 'Keycloak Admin',
      description: 'Identity and Access Management',
      path: '/keycloak',
      icon: '🔐',
      requiredRoles: ['ROLE_IAM_ADMIN'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render with items', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should render section heading', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      const heading = wrapper.find('h2');
      expect(heading.exists()).toBe(true);
      expect(heading.text()).toBe('Quick Access');
    });

    it('should render QuickAccessCard for each visible item', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      const cards = wrapper.findAllComponents(QuickAccessCard);
      expect(cards).toHaveLength(testItems.length);
    });

    it('should pass correct props to each card', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      const cards = wrapper.findAllComponents(QuickAccessCard);
      const firstCard = cards[0];

      expect(firstCard.props('title')).toBe(testItems[0].title);
      expect(firstCard.props('description')).toBe(testItems[0].description);
      expect(firstCard.props('path')).toBe(testItems[0].path);
      expect(firstCard.props('icon')).toBe(testItems[0].icon);
    });

    it('should render empty state when no visible items', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(false),
        hasAnyRole: vi.fn(() => false),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      const emptyState = wrapper.find('.text-center.text-gray-600');
      expect(emptyState.exists()).toBe(true);
      expect(emptyState.text()).toContain('No quick-access items available');
    });

    it('should not render cards when items array is empty', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: [],
        },
        global: {
          plugins: [router],
        },
      });

      const cards = wrapper.findAllComponents(QuickAccessCard);
      expect(cards).toHaveLength(0);
    });
  });

  describe('Role-Based Filtering', () => {
    it('should show all items when user has all required roles', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      const cards = wrapper.findAllComponents(QuickAccessCard);
      expect(cards).toHaveLength(testItems.length);
    });

    it('should filter items when user lacks required roles', async () => {
      const { useAuth } = await import('@/core/auth');
      const hasAnyRole = vi.fn((roles: string[]) => {
        // User only has ROLE_DEVOPS
        return roles.includes('ROLE_DEVOPS') || roles.includes('ROLE_OBS_VIEWER');
      });

      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole,
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      const cards = wrapper.findAllComponents(QuickAccessCard);
      // Should only show Grafana (user has ROLE_DEVOPS)
      expect(cards).toHaveLength(1);
      expect(cards[0].props('title')).toBe('Grafana');
    });

    it('should hide all items when user is not authenticated', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(false),
        hasAnyRole: vi.fn(() => false),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      const cards = wrapper.findAllComponents(QuickAccessCard);
      expect(cards).toHaveLength(0);
    });

    it('should show items without requiredRoles to all users', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => false),
      } as MockAuth);

      const itemsWithoutRoles: QuickAccessItem[] = [
        {
          id: 'home',
          title: 'Home',
          description: 'Welcome Page',
          path: '/home',
          icon: '🏠',
          // No requiredRoles
        },
      ];

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: itemsWithoutRoles,
        },
        global: {
          plugins: [router],
        },
      });

      const cards = wrapper.findAllComponents(QuickAccessCard);
      expect(cards).toHaveLength(1);
    });

    it('should show items with empty requiredRoles array to all users', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => false),
      } as MockAuth);

      const itemsWithEmptyRoles: QuickAccessItem[] = [
        {
          id: 'home',
          title: 'Home',
          description: 'Welcome Page',
          path: '/home',
          icon: '🏠',
          requiredRoles: [],
        },
      ];

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: itemsWithEmptyRoles,
        },
        global: {
          plugins: [router],
        },
      });

      const cards = wrapper.findAllComponents(QuickAccessCard);
      expect(cards).toHaveLength(1);
    });

    it('should call hasAnyRole with correct roles for each item', async () => {
      const { useAuth } = await import('@/core/auth');
      const hasAnyRole = vi.fn(() => true);

      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole,
      } as MockAuth);

      const router = createTestRouter();
      mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      // Should be called for each item with requiredRoles
      expect(hasAnyRole).toHaveBeenCalledWith(testItems[0].requiredRoles);
      expect(hasAnyRole).toHaveBeenCalledWith(testItems[1].requiredRoles);
      expect(hasAnyRole).toHaveBeenCalledWith(testItems[2].requiredRoles);
    });
  });

  describe('Styling and Layout', () => {
    it('should use semantic section element', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.find('section').exists()).toBe(true);
    });

    it('should apply responsive grid classes', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.find('.grid');
      expect(grid.exists()).toBe(true);
      expect(grid.classes()).toContain('grid-cols-1'); // Mobile
      expect(grid.classes()).toContain('sm:grid-cols-2'); // Tablet
      expect(grid.classes()).toContain('lg:grid-cols-3'); // Desktop
      expect(grid.classes()).toContain('xl:grid-cols-4'); // Large desktop
    });

    it('should apply proper spacing between cards', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.find('.grid');
      expect(grid.classes()).toContain('gap-6');
    });

    it('should center content with max-width container', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      const container = wrapper.find('.max-w-7xl');
      expect(container.exists()).toBe(true);
      expect(container.classes()).toContain('mx-auto');
    });

    it('should apply proper heading styles', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      const heading = wrapper.find('h2');
      expect(heading.classes()).toContain('text-3xl');
      expect(heading.classes()).toContain('font-bold');
      expect(heading.classes()).toContain('text-center');
    });
  });

  describe('Props Validation', () => {
    it('should require items prop', () => {
      const props = QuickAccessGrid.props;

      expect(props.items.required).toBe(true);
    });

    it('should accept array of QuickAccessItem', () => {
      const props = QuickAccessGrid.props;

      expect(props.items.type).toBe(Array);
    });
  });

  describe('Edge Cases', () => {
    it('should handle items with undefined requiredRoles', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => false),
      } as MockAuth);

      const itemsWithUndefinedRoles: QuickAccessItem[] = [
        {
          id: 'test',
          title: 'Test',
          description: 'Test Description',
          path: '/test',
          icon: '🏠',
          requiredRoles: undefined,
        },
      ];

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: itemsWithUndefinedRoles,
        },
        global: {
          plugins: [router],
        },
      });

      const cards = wrapper.findAllComponents(QuickAccessCard);
      expect(cards).toHaveLength(1);
    });

    it('should handle mixed items with and without roles', async () => {
      const { useAuth } = await import('@/core/auth');
      const hasAnyRole = vi.fn(() => false);

      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole,
      } as MockAuth);

      const mixedItems: QuickAccessItem[] = [
        {
          id: 'public',
          title: 'Public',
          description: 'Public Item',
          path: '/public',
          icon: '🏠',
        },
        {
          id: 'restricted',
          title: 'Restricted',
          description: 'Restricted Item',
          path: '/restricted',
          icon: '🔒',
          requiredRoles: ['ROLE_ADMIN'],
        },
      ];

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: mixedItems,
        },
        global: {
          plugins: [router],
        },
      });

      const cards = wrapper.findAllComponents(QuickAccessCard);
      expect(cards).toHaveLength(1); // Only public item shown
      expect(cards[0].props('title')).toBe('Public');
    });
  });

  describe('Business Requirements', () => {
    it('should implement FR-HOME-006 (quick-access buttons)', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      // Should display multiple quick-access cards
      const cards = wrapper.findAllComponents(QuickAccessCard);
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should implement role-based filtering (FR-FE-KC-009)', async () => {
      const { useAuth } = await import('@/core/auth');
      const hasAnyRole = vi.fn(() => false);

      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole,
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      // Should filter based on roles
      const cards = wrapper.findAllComponents(QuickAccessCard);
      expect(cards).toHaveLength(0); // No roles = no restricted items
    });

    it('should implement NFR-HOME-002 (responsive layout)', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(QuickAccessGrid, {
        props: {
          items: testItems,
        },
        global: {
          plugins: [router],
        },
      });

      // Should have responsive grid classes
      const grid = wrapper.find('.grid');
      expect(grid.classes()).toContain('grid-cols-1');
      expect(grid.classes()).toContain('sm:grid-cols-2');
      expect(grid.classes()).toContain('lg:grid-cols-3');
    });
  });
});
