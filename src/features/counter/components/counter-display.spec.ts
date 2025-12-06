import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import CounterDisplay from './counter-display.vue';

describe('CounterDisplay', () => {
  describe('rendering', () => {
    it('should display the current count value', () => {
      const wrapper = mount(CounterDisplay, {
        props: {
          count: 42,
          doubleCount: 84,
          isPositive: true,
          isNegative: false,
        },
      });

      expect(wrapper.text()).toContain('42');
    });

    it('should display the double count value', () => {
      const wrapper = mount(CounterDisplay, {
        props: {
          count: 10,
          doubleCount: 20,
          isPositive: true,
          isNegative: false,
        },
      });

      expect(wrapper.text()).toContain('20');
    });

    it('should show positive value when count is positive', () => {
      const wrapper = mount(CounterDisplay, {
        props: {
          count: 5,
          doubleCount: 10,
          isPositive: true,
          isNegative: false,
        },
      });

      expect(wrapper.text()).toContain('5');
      expect(wrapper.text()).toContain('Double: 10');
    });

    it('should show negative value when count is negative', () => {
      const wrapper = mount(CounterDisplay, {
        props: {
          count: -5,
          doubleCount: -10,
          isPositive: false,
          isNegative: true,
        },
      });

      expect(wrapper.text()).toContain('-5');
      expect(wrapper.text()).toContain('Double: -10');
    });

    it('should show zero value when count is zero', () => {
      const wrapper = mount(CounterDisplay, {
        props: {
          count: 0,
          doubleCount: 0,
          isPositive: false,
          isNegative: false,
        },
      });

      expect(wrapper.text()).toContain('0');
      expect(wrapper.text()).toContain('Double: 0');
    });
  });

  describe('props validation', () => {
    it('should accept all required props', () => {
      const wrapper = mount(CounterDisplay, {
        props: {
          count: 0,
          doubleCount: 0,
          isPositive: false,
          isNegative: false,
        },
      });

      expect(wrapper.props('count')).toBe(0);
      expect(wrapper.props('doubleCount')).toBe(0);
      expect(wrapper.props('isPositive')).toBe(false);
      expect(wrapper.props('isNegative')).toBe(false);
    });

    it('should handle negative count values', () => {
      const wrapper = mount(CounterDisplay, {
        props: {
          count: -100,
          doubleCount: -200,
          isPositive: false,
          isNegative: true,
        },
      });

      expect(wrapper.text()).toContain('-100');
    });

    it('should handle large count values', () => {
      const wrapper = mount(CounterDisplay, {
        props: {
          count: 999999,
          doubleCount: 1999998,
          isPositive: true,
          isNegative: false,
        },
      });

      expect(wrapper.text()).toContain('999999');
    });
  });

  describe('styling', () => {
    it('should apply positive styling when count is positive', () => {
      const wrapper = mount(CounterDisplay, {
        props: {
          count: 1,
          doubleCount: 2,
          isPositive: true,
          isNegative: false,
        },
      });

      const html = wrapper.html();
      expect(html).toContain('text-green-600');
    });

    it('should apply negative styling when count is negative', () => {
      const wrapper = mount(CounterDisplay, {
        props: {
          count: -1,
          doubleCount: -2,
          isPositive: false,
          isNegative: true,
        },
      });

      const html = wrapper.html();
      expect(html).toContain('text-red-600');
    });

    it('should apply neutral styling when count is zero', () => {
      const wrapper = mount(CounterDisplay, {
        props: {
          count: 0,
          doubleCount: 0,
          isPositive: false,
          isNegative: false,
        },
      });

      const html = wrapper.html();
      expect(html).toContain('text-gray-600');
    });
  });
});
