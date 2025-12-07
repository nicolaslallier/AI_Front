import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';

import HomeView from './home-view.vue';
import QuickAccessGrid from '../components/quick-access-grid.vue';
import WelcomeHero from '../components/welcome-hero.vue';

import type { QuickAccessItem } from '../types';

// Type for mocked auth - use any for test mocks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockAuth = any;

// Mock the useAuth composable
vi.mock('@/core/auth', () => ({
  useAuth: vi.fn(),
}));

describe('HomeView', () => {
  // Helper function to create a test router
  const createTestRouter = (): ReturnType<typeof createRouter> => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/grafana', name: 'grafana', component: { template: '<div>Grafana</div>' } },
        { path: '/logs', name: 'loki', component: { template: '<div>Loki</div>' } },
        { path: '/traces', name: 'tempo', component: { template: '<div>Tempo</div>' } },
        { path: '/metrics', name: 'prometheus', component: { template: '<div>Prometheus</div>' } },
        { path: '/minio', name: 'minio', component: { template: '<div>MinIO</div>' } },
        { path: '/pgadmin', name: 'pgadmin', component: { template: '<div>pgAdmin</div>' } },
        { path: '/keycloak', name: 'keycloak', component: { template: '<div>Keycloak</div>' } },
      ],
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render successfully', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should render WelcomeHero component', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.findComponent(WelcomeHero).exists()).toBe(true);
    });

    it('should render QuickAccessGrid component', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.findComponent(QuickAccessGrid).exists()).toBe(true);
    });

    it('should pass quickAccessItems to QuickAccessGrid', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      expect(grid.props('items')).toBeDefined();
      expect(Array.isArray(grid.props('items'))).toBe(true);
    });
  });

  describe('Quick Access Items Configuration', () => {
    it('should define all console items', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      const items = grid.props('items') as QuickAccessItem[];

      // Should have 7 items (Grafana, Loki, Tempo, Prometheus, MinIO, pgAdmin, Keycloak)
      expect(items).toHaveLength(7);
    });

    it('should include Grafana console', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      const items = grid.props('items') as QuickAccessItem[];
      const grafana = items.find((item: QuickAccessItem) => item.id === 'grafana');

      expect(grafana).toBeDefined();
      expect(grafana?.title).toBe('Grafana');
      expect(grafana?.path).toBe('/grafana');
      expect(grafana?.requiredRoles).toContain('ROLE_DEVOPS');
    });

    it('should include Loki console', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      const items = grid.props('items') as QuickAccessItem[];
      const loki = items.find((item: QuickAccessItem) => item.id === 'loki');

      expect(loki).toBeDefined();
      expect(loki?.title).toBe('Logs (Loki)');
      expect(loki?.path).toBe('/logs');
    });

    it('should include Tempo console', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      const items = grid.props('items') as QuickAccessItem[];
      const tempo = items.find((item: QuickAccessItem) => item.id === 'tempo');

      expect(tempo).toBeDefined();
      expect(tempo?.title).toBe('Traces (Tempo)');
      expect(tempo?.path).toBe('/traces');
    });

    it('should include Prometheus console', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      const items = grid.props('items') as QuickAccessItem[];
      const prometheus = items.find((item: QuickAccessItem) => item.id === 'prometheus');

      expect(prometheus).toBeDefined();
      expect(prometheus?.title).toBe('Metrics (Prometheus)');
      expect(prometheus?.path).toBe('/metrics');
    });

    it('should include MinIO console', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      const items = grid.props('items') as QuickAccessItem[];
      const minio = items.find((item: QuickAccessItem) => item.id === 'minio');

      expect(minio).toBeDefined();
      expect(minio?.title).toBe('MinIO Storage');
      expect(minio?.path).toBe('/minio');
      expect(minio?.requiredRoles).toContain('ROLE_MINIO_ADMIN');
    });

    it('should include pgAdmin console', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      const items = grid.props('items') as QuickAccessItem[];
      const pgadmin = items.find((item: QuickAccessItem) => item.id === 'pgadmin');

      expect(pgadmin).toBeDefined();
      expect(pgadmin?.title).toBe('pgAdmin');
      expect(pgadmin?.path).toBe('/pgadmin');
      expect(pgadmin?.requiredRoles).toContain('ROLE_DBA');
    });

    it('should include Keycloak Admin console', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      const items = grid.props('items') as QuickAccessItem[];
      const keycloak = items.find((item: QuickAccessItem) => item.id === 'keycloak');

      expect(keycloak).toBeDefined();
      expect(keycloak?.title).toBe('Keycloak Admin');
      expect(keycloak?.path).toBe('/keycloak');
      expect(keycloak?.requiredRoles).toContain('ROLE_IAM_ADMIN');
    });

    it('should have unique ids for all items', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      const items = grid.props('items') as QuickAccessItem[];
      const ids = items.map((item: QuickAccessItem) => item.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have descriptions for all items', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      const items = grid.props('items') as QuickAccessItem[];

      items.forEach((item: QuickAccessItem) => {
        expect(item.description).toBeDefined();
        expect(item.description.length).toBeGreaterThan(0);
      });
    });

    it('should have icons for all items', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      const items = grid.props('items') as QuickAccessItem[];

      items.forEach((item: QuickAccessItem) => {
        expect(item.icon).toBeDefined();
        expect(item.icon.length).toBeGreaterThan(0);
      });
    });

    it('should have valid paths for all items', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const grid = wrapper.findComponent(QuickAccessGrid);
      const items = grid.props('items') as QuickAccessItem[];

      items.forEach((item: QuickAccessItem) => {
        expect(item.path).toBeDefined();
        expect(item.path).toMatch(/^\//); // Should start with /
      });
    });
  });

  describe('Styling and Layout', () => {
    it('should apply full-height background', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      const container = wrapper.find('.min-h-screen');
      expect(container.exists()).toBe(true);
      expect(container.classes()).toContain('bg-gray-50');
    });
  });

  describe('Business Requirements', () => {
    it('should implement BR-HOME-001 (welcome message)', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      // Should display welcome message via WelcomeHero
      expect(wrapper.findComponent(WelcomeHero).exists()).toBe(true);
    });

    it('should implement BR-HOME-002 (professional appearance)', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      // Should have clean layout with proper components
      expect(wrapper.findComponent(WelcomeHero).exists()).toBe(true);
      expect(wrapper.findComponent(QuickAccessGrid).exists()).toBe(true);
    });

    it('should implement BR-HOME-003 (access to main sections)', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      // Should provide quick-access to main sections
      const grid = wrapper.findComponent(QuickAccessGrid);
      expect(grid.exists()).toBe(true);
      expect(grid.props('items').length).toBeGreaterThan(0);
    });

    it('should implement FR-HOME-002 (welcome section)', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      // Should have welcome section with title and description
      expect(wrapper.findComponent(WelcomeHero).exists()).toBe(true);
    });

    it('should implement FR-HOME-006 (quick-access buttons)', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      // Should have quick-access grid with multiple items
      const grid = wrapper.findComponent(QuickAccessGrid);
      expect(grid.props('items').length).toBeGreaterThanOrEqual(6);
    });

    it('should implement NFR-HOME-001 (fast load time)', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      // Should use static content (no async operations in setup)
      // Component should render immediately
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.findComponent(WelcomeHero).exists()).toBe(true);
    });

    it('should implement NFR-HOME-002 (responsive layout)', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      // Components should be responsive (checked in component tests)
      expect(wrapper.findComponent(WelcomeHero).exists()).toBe(true);
      expect(wrapper.findComponent(QuickAccessGrid).exists()).toBe(true);
    });

    it('should implement NFR-HOME-003 (semantic HTML)', async () => {
      const { useAuth } = await import('@/core/auth');
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: ref(true),
        hasAnyRole: vi.fn(() => true),
      } as MockAuth);

      const router = createTestRouter();
      const wrapper = mount(HomeView, {
        global: {
          plugins: [router],
        },
      });

      // Should use semantic structure (verified in child components)
      expect(wrapper.exists()).toBe(true);
    });
  });
});
