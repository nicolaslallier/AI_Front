import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import CounterHistory from './counter-history.vue';

describe('CounterHistory', () => {
  describe('rendering', () => {
    it('should display history items when history has entries', () => {
      const history = [1, 2, 3, 4, 5];
      const wrapper = mount(CounterHistory, {
        props: { history },
      });

      expect(wrapper.text()).toContain('1');
      expect(wrapper.text()).toContain('2');
      expect(wrapper.text()).toContain('3');
      expect(wrapper.text()).toContain('4');
      expect(wrapper.text()).toContain('5');
    });

    it('should display empty state when history is empty', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [] },
      });

      expect(wrapper.text()).toContain('No history available');
    });

    it('should display clear history button when history has entries', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [1, 2, 3] },
      });

      const clearButton = wrapper.find('button');
      expect(clearButton.exists()).toBe(true);
      expect(clearButton.text()).toContain('Clear History');
    });

    it('should display clear button even when history is empty', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [] },
      });

      const clearButton = wrapper.find('button');
      expect(clearButton.exists()).toBe(true);
    });

    it('should display history count when history has entries', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [1, 2, 3] },
      });

      expect(wrapper.text()).toContain('3 entries');
    });
  });

  describe('props validation', () => {
    it('should accept empty history array', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [] },
      });

      expect(wrapper.props('history')).toEqual([]);
    });

    it('should accept history with single entry', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [42] },
      });

      expect(wrapper.text()).toContain('42');
    });

    it('should accept history with negative numbers', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [-5, -10, -15] },
      });

      expect(wrapper.text()).toContain('-5');
      expect(wrapper.text()).toContain('-10');
      expect(wrapper.text()).toContain('-15');
    });

    it('should accept history with zero values', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [0, 0, 0] },
      });

      expect(wrapper.text()).toContain('0');
    });

    it('should accept history with large numbers', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [1000000, 2000000] },
      });

      expect(wrapper.text()).toContain('1000000');
      expect(wrapper.text()).toContain('2000000');
    });
  });

  describe('events', () => {
    it('should emit clearHistory event when clear button is clicked', async () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [1, 2, 3] },
      });

      const clearButton = wrapper.find('button');
      await clearButton.trigger('click');

      expect(wrapper.emitted('clearHistory')).toBeTruthy();
      expect(wrapper.emitted('clearHistory')?.[0]).toEqual([]);
    });

    it('should emit clearHistory event even when history is empty', async () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [] },
      });

      const clearButton = wrapper.find('button');
      await clearButton.trigger('click');

      expect(wrapper.emitted('clearHistory')).toBeTruthy();
    });
  });

  describe('history display', () => {
    it('should display history entries', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [1, 2, 3] },
      });

      const historyItems = wrapper.findAll('[class*="p-2 bg-gray-50"]');
      expect(historyItems).toHaveLength(3);
    });

    it('should handle long history lists', () => {
      const longHistory = Array.from({ length: 100 }, (_, i) => i);
      const wrapper = mount(CounterHistory, {
        props: { history: longHistory },
      });

      expect(wrapper.text()).toContain('100 entries');
    });

    it('should display mixed positive and negative values', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [-5, 10, -3, 7, 0] },
      });

      expect(wrapper.text()).toContain('-5');
      expect(wrapper.text()).toContain('10');
      expect(wrapper.text()).toContain('-3');
      expect(wrapper.text()).toContain('7');
      expect(wrapper.text()).toContain('0');
    });
  });

  describe('accessibility', () => {
    it('should have a clear history button', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [1, 2, 3] },
      });

      const clearButton = wrapper.find('button');
      expect(clearButton.exists()).toBe(true);
      expect(clearButton.text()).toContain('Clear History');
    });

    it('should display history entries in semantic containers', () => {
      const wrapper = mount(CounterHistory, {
        props: { history: [1, 2, 3] },
      });

      const historyContainer = wrapper.find('[class*="space-y-2"]');
      expect(historyContainer.exists()).toBe(true);

      const entries = wrapper.findAll('[class*="p-2 bg-gray-50"]');
      expect(entries).toHaveLength(3);
    });
  });
});
