import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';

import AppHeader from './app-header.vue';

describe('AppHeader', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
  });

  describe('component rendering', () => {
    it('should render the component', () => {
      const wrapper = mount(AppHeader, {
        global: {
          plugins: [pinia],
          stubs: {
            UserProfile: true,
          },
        },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('should render the default title', () => {
      const wrapper = mount(AppHeader, {
        global: {
          plugins: [pinia],
          stubs: {
            UserProfile: true,
          },
        },
      });
      expect(wrapper.text()).toContain('AI Front');
    });

    it('should render with custom title prop', () => {
      const wrapper = mount(AppHeader, {
        props: {
          title: 'Custom Application',
        },
        global: {
          plugins: [pinia],
          stubs: {
            UserProfile: true,
          },
        },
      });
      expect(wrapper.text()).toContain('Custom Application');
    });

    it('should apply correct CSS classes', () => {
      const wrapper = mount(AppHeader, {
        global: {
          plugins: [pinia],
          stubs: {
            UserProfile: true,
          },
        },
      });
      const header = wrapper.find('header');
      expect(header.exists()).toBe(true);
      expect(header.classes()).toContain('bg-indigo-600');
    });

    it('should have semantic HTML structure', () => {
      const wrapper = mount(AppHeader, {
        global: {
          plugins: [pinia],
          stubs: {
            UserProfile: true,
          },
        },
      });
      const header = wrapper.find('header');
      expect(header.element.tagName).toBe('HEADER');
    });
  });

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const wrapper = mount(AppHeader, {
        global: {
          plugins: [pinia],
          stubs: {
            UserProfile: true,
          },
        },
      });
      const heading = wrapper.find('h1');
      expect(heading.exists()).toBe(true);
    });

    it('should have accessible text content', () => {
      const wrapper = mount(AppHeader, {
        global: {
          plugins: [pinia],
          stubs: {
            UserProfile: true,
          },
        },
      });
      const heading = wrapper.find('h1');
      expect(heading.text()).toBeTruthy();
    });
  });

  describe('props validation', () => {
    it('should accept title as a string', () => {
      const wrapper = mount(AppHeader, {
        props: {
          title: 'Test Title',
        },
        global: {
          plugins: [pinia],
          stubs: {
            UserProfile: true,
          },
        },
      });
      expect(wrapper.props('title')).toBe('Test Title');
    });

    it('should use default title when not provided', () => {
      const wrapper = mount(AppHeader, {
        global: {
          plugins: [pinia],
          stubs: {
            UserProfile: true,
          },
        },
      });
      expect(wrapper.text()).toContain('AI Front');
    });
  });
});
