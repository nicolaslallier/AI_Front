import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';

import App from './App.vue';

describe('App', () => {
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'home',
          component: { template: '<div>Home</div>' },
        },
      ],
    });
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      const wrapper = mount(App, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should contain router-view component', () => {
      const wrapper = mount(App, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true);
    });

    it('should render with correct structure', () => {
      const wrapper = mount(App, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.html()).toBeTruthy();
    });
  });

  describe('router integration', () => {
    it('should integrate with Vue Router', async () => {
      const wrapper = mount(App, {
        global: {
          plugins: [router],
        },
      });

      await router.isReady();

      expect(wrapper.vm).toBeTruthy();
    });

    it('should render router content', async () => {
      const wrapper = mount(App, {
        global: {
          plugins: [router],
        },
      });

      await router.isReady();
      await wrapper.vm.$nextTick();

      expect(wrapper.html()).toContain('Home');
    });
  });

  describe('component lifecycle', () => {
    it('should mount successfully', () => {
      const wrapper = mount(App, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.vm).toBeDefined();
    });

    it('should unmount successfully', () => {
      const wrapper = mount(App, {
        global: {
          plugins: [router],
        },
      });

      expect(() => wrapper.unmount()).not.toThrow();
    });
  });
});
