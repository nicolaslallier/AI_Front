import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';

import AppNavigation from './app-navigation.vue';

import type { NavigationItem } from '../types/index';

describe('AppNavigation', () => {
  const mockItems: NavigationItem[] = [
    { id: 'home', label: 'Home', path: '/home' },
    { id: 'grafana', label: 'Grafana', path: '/grafana' },
  ];

  let router: ReturnType<typeof createRouter>;
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/home', component: { template: '<div>Home</div>' } },
        { path: '/grafana', component: { template: '<div>Grafana</div>' } },
      ],
    });
    pinia = createPinia();
  });

  describe('component rendering', () => {
    it('should render the component', () => {
      const wrapper = mount(AppNavigation, {
        props: { items: mockItems },
        global: {
          plugins: [router, pinia],
        },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('should render all navigation items', () => {
      const wrapper = mount(AppNavigation, {
        props: { items: mockItems },
        global: {
          plugins: [router, pinia],
        },
      });
      const links = wrapper.findAll('a');
      expect(links.length).toBe(2);
    });

    it('should render navigation item labels', () => {
      const wrapper = mount(AppNavigation, {
        props: { items: mockItems },
        global: {
          plugins: [router, pinia],
        },
      });
      expect(wrapper.text()).toContain('Home');
      expect(wrapper.text()).toContain('Grafana');
    });

    it('should apply correct CSS classes to nav element', () => {
      const wrapper = mount(AppNavigation, {
        props: { items: mockItems },
        global: {
          plugins: [router, pinia],
        },
      });
      const nav = wrapper.find('nav');
      expect(nav.exists()).toBe(true);
      expect(nav.classes()).toContain('bg-white');
    });

    it('should render with empty items array', () => {
      const wrapper = mount(AppNavigation, {
        props: { items: [] },
        global: {
          plugins: [router, pinia],
        },
      });
      const links = wrapper.findAll('a');
      expect(links.length).toBe(0);
    });
  });

  describe('visibility filtering', () => {
    it('should show items with visible=true', () => {
      const items: NavigationItem[] = [{ id: 'visible', label: 'Visible', path: '/visible', visible: true }];
      const wrapper = mount(AppNavigation, {
        props: { items },
        global: {
          plugins: [router, pinia],
        },
      });
      expect(wrapper.text()).toContain('Visible');
    });

    it('should hide items with visible=false', () => {
      const items: NavigationItem[] = [{ id: 'hidden', label: 'Hidden', path: '/hidden', visible: false }];
      const wrapper = mount(AppNavigation, {
        props: { items },
        global: {
          plugins: [router, pinia],
        },
      });
      expect(wrapper.text()).not.toContain('Hidden');
    });

    it('should show items without visible property (default to visible)', () => {
      const items: NavigationItem[] = [{ id: 'default', label: 'Default', path: '/default' }];
      const wrapper = mount(AppNavigation, {
        props: { items },
        global: {
          plugins: [router, pinia],
        },
      });
      expect(wrapper.text()).toContain('Default');
    });

    it('should filter mixed visibility items correctly', () => {
      const items: NavigationItem[] = [
        { id: 'visible1', label: 'Visible 1', path: '/v1', visible: true },
        { id: 'hidden', label: 'Hidden', path: '/h', visible: false },
        { id: 'visible2', label: 'Visible 2', path: '/v2', visible: true },
      ];
      const wrapper = mount(AppNavigation, {
        props: { items },
        global: {
          plugins: [router, pinia],
        },
      });
      const links = wrapper.findAll('a');
      expect(links.length).toBe(2);
      expect(wrapper.text()).toContain('Visible 1');
      expect(wrapper.text()).toContain('Visible 2');
      expect(wrapper.text()).not.toContain('Hidden');
    });
  });

  describe('navigation functionality', () => {
    it('should use router-link for navigation', () => {
      const wrapper = mount(AppNavigation, {
        props: { items: mockItems },
        global: {
          plugins: [router, pinia],
        },
      });
      const routerLinks = wrapper.findAllComponents({ name: 'RouterLink' });
      expect(routerLinks.length).toBe(2);
    });

    it('should set correct to prop on router-links', () => {
      const wrapper = mount(AppNavigation, {
        props: { items: mockItems },
        global: {
          plugins: [router, pinia],
        },
      });
      const routerLinks = wrapper.findAllComponents({ name: 'RouterLink' });
      expect(routerLinks[0].props('to')).toBe('/home');
      expect(routerLinks[1].props('to')).toBe('/grafana');
    });
  });

  describe('accessibility', () => {
    it('should have semantic nav element', () => {
      const wrapper = mount(AppNavigation, {
        props: { items: mockItems },
        global: {
          plugins: [router, pinia],
        },
      });
      const nav = wrapper.find('nav');
      expect(nav.element.tagName).toBe('NAV');
    });

    it('should have accessible link text', () => {
      const wrapper = mount(AppNavigation, {
        props: { items: mockItems },
        global: {
          plugins: [router, pinia],
        },
      });
      const links = wrapper.findAll('a');
      links.forEach((link) => {
        expect(link.text()).toBeTruthy();
      });
    });
  });

  describe('props validation', () => {
    it('should accept items prop as array', () => {
      const wrapper = mount(AppNavigation, {
        props: { items: mockItems },
        global: {
          plugins: [router, pinia],
        },
      });
      expect(wrapper.props('items')).toEqual(mockItems);
    });

    it('should maintain items order', () => {
      const orderedItems: NavigationItem[] = [
        { id: 'first', label: 'First', path: '/first' },
        { id: 'second', label: 'Second', path: '/second' },
        { id: 'third', label: 'Third', path: '/third' },
      ];
      const wrapper = mount(AppNavigation, {
        props: { items: orderedItems },
        global: {
          plugins: [router, pinia],
        },
      });
      const links = wrapper.findAll('a');
      expect(links[0].text()).toContain('First');
      expect(links[1].text()).toContain('Second');
      expect(links[2].text()).toContain('Third');
    });
  });
});
