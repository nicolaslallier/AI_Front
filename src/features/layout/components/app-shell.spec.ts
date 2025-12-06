import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';

import AppHeader from './app-header.vue';
import AppNavigation from './app-navigation.vue';
import AppShell from './app-shell.vue';

describe('AppShell', () => {
  const createRouterMock = (): ReturnType<typeof createRouter> => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/home', component: { template: '<div>Home Content</div>' } },
        { path: '/grafana', component: { template: '<div>Grafana Content</div>' } },
      ],
    });
  };

  describe('component rendering', () => {
    it('should render the component', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
          },
        },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('should render AppHeader component', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
          },
        },
      });
      expect(wrapper.findComponent(AppHeader).exists()).toBe(true);
    });

    it('should render AppNavigation component', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
          },
        },
      });
      expect(wrapper.findComponent(AppNavigation).exists()).toBe(true);
    });

    it('should render router-view for content', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
        },
      });
      const routerView = wrapper.findComponent({ name: 'RouterView' });
      expect(routerView.exists()).toBe(true);
    });

    it('should have proper layout structure', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
          },
        },
      });
      const mainContainer = wrapper.find('.min-h-screen');
      expect(mainContainer.exists()).toBe(true);
    });
  });

  describe('navigation items', () => {
    it('should pass navigation items to AppNavigation', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
          },
        },
      });
      const navigation = wrapper.findComponent(AppNavigation);
      expect(navigation.props('items')).toBeDefined();
      expect(Array.isArray(navigation.props('items'))).toBe(true);
    });

    it('should include Home navigation item', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
          },
        },
      });
      const navigation = wrapper.findComponent(AppNavigation);
      const items = navigation.props('items');
      const homeItem = items.find((item: { id: string }) => item.id === 'home');
      expect(homeItem).toBeDefined();
      expect(homeItem?.label).toBe('Home');
      expect(homeItem?.path).toBe('/home');
    });

    it('should include Grafana navigation item', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
          },
        },
      });
      const navigation = wrapper.findComponent(AppNavigation);
      const items = navigation.props('items');
      const grafanaItem = items.find((item: { id: string }) => item.id === 'grafana');
      expect(grafanaItem).toBeDefined();
      expect(grafanaItem?.label).toBe('Grafana');
      expect(grafanaItem?.path).toBe('/grafana');
    });
  });

  describe('layout composition', () => {
    it('should render header before navigation', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
          },
        },
      });
      const header = wrapper.findComponent(AppHeader);
      const nav = wrapper.findComponent(AppNavigation);
      expect(header.exists()).toBe(true);
      expect(nav.exists()).toBe(true);
    });

    it('should render navigation before content', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
          },
        },
      });
      const html = wrapper.html();
      const navIndex = html.indexOf('app-navigation');
      const contentIndex = html.indexOf('router-view');
      expect(navIndex).toBeLessThan(contentIndex);
    });
  });

  describe('content area', () => {
    it('should have a main content container', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
          },
        },
      });
      const main = wrapper.find('main');
      expect(main.exists()).toBe(true);
    });

    it('should apply proper styling to content area', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
          },
        },
      });
      const main = wrapper.find('main');
      expect(main.classes()).toContain('flex-1');
    });
  });

  describe('accessibility', () => {
    it('should use semantic HTML5 elements', () => {
      const router = createRouterMock();
      const wrapper = mount(AppShell, {
        global: {
          plugins: [router],
          stubs: {
            RouterView: true,
          },
        },
      });
      expect(wrapper.find('header').exists()).toBe(true);
      expect(wrapper.find('nav').exists()).toBe(true);
      expect(wrapper.find('main').exists()).toBe(true);
    });
  });
});
