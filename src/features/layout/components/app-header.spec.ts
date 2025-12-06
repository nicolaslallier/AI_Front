import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import AppHeader from './app-header.vue';

describe('AppHeader', () => {
  describe('component rendering', () => {
    it('should render the component', () => {
      const wrapper = mount(AppHeader);
      expect(wrapper.exists()).toBe(true);
    });

    it('should render the default title', () => {
      const wrapper = mount(AppHeader);
      expect(wrapper.text()).toContain('AI Front');
    });

    it('should render with custom title prop', () => {
      const wrapper = mount(AppHeader, {
        props: {
          title: 'Custom Application',
        },
      });
      expect(wrapper.text()).toContain('Custom Application');
    });

    it('should apply correct CSS classes', () => {
      const wrapper = mount(AppHeader);
      const header = wrapper.find('header');
      expect(header.exists()).toBe(true);
      expect(header.classes()).toContain('bg-indigo-600');
    });

    it('should have semantic HTML structure', () => {
      const wrapper = mount(AppHeader);
      const header = wrapper.find('header');
      expect(header.element.tagName).toBe('HEADER');
    });
  });

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const wrapper = mount(AppHeader);
      const heading = wrapper.find('h1');
      expect(heading.exists()).toBe(true);
    });

    it('should have accessible text content', () => {
      const wrapper = mount(AppHeader);
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
      });
      expect(wrapper.props('title')).toBe('Test Title');
    });

    it('should use default title when not provided', () => {
      const wrapper = mount(AppHeader);
      expect(wrapper.text()).toContain('AI Front');
    });
  });
});
