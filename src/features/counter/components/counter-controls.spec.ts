import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import CounterControls from './counter-controls.vue';

describe('CounterControls', () => {
  describe('rendering', () => {
    it('should render three buttons', () => {
      const wrapper = mount(CounterControls);
      const buttons = wrapper.findAll('button');
      expect(buttons).toHaveLength(3);
    });

    it('should render increment button with correct text', () => {
      const wrapper = mount(CounterControls);
      expect(wrapper.text()).toContain('Increment');
    });

    it('should render decrement button with correct text', () => {
      const wrapper = mount(CounterControls);
      expect(wrapper.text()).toContain('Decrement');
    });

    it('should render reset button with correct text', () => {
      const wrapper = mount(CounterControls);
      expect(wrapper.text()).toContain('Reset');
    });
  });

  describe('events', () => {
    it('should emit increment event when increment button is clicked', async () => {
      const wrapper = mount(CounterControls);
      const buttons = wrapper.findAll('button');
      const incrementButton = buttons[0];

      await incrementButton.trigger('click');

      expect(wrapper.emitted('increment')).toBeTruthy();
      expect(wrapper.emitted('increment')?.[0]).toEqual([]);
    });

    it('should emit decrement event when decrement button is clicked', async () => {
      const wrapper = mount(CounterControls);
      const buttons = wrapper.findAll('button');
      const decrementButton = buttons[1];

      await decrementButton.trigger('click');

      expect(wrapper.emitted('decrement')).toBeTruthy();
      expect(wrapper.emitted('decrement')?.[0]).toEqual([]);
    });

    it('should emit reset event when reset button is clicked', async () => {
      const wrapper = mount(CounterControls);
      const buttons = wrapper.findAll('button');
      const resetButton = buttons[2];

      await resetButton.trigger('click');

      expect(wrapper.emitted('reset')).toBeTruthy();
      expect(wrapper.emitted('reset')?.[0]).toEqual([]);
    });

    it('should emit multiple events when buttons are clicked multiple times', async () => {
      const wrapper = mount(CounterControls);
      const buttons = wrapper.findAll('button');
      const incrementButton = buttons[0];

      await incrementButton.trigger('click');
      await incrementButton.trigger('click');
      await incrementButton.trigger('click');

      expect(wrapper.emitted('increment')).toHaveLength(3);
    });
  });

  describe('accessibility', () => {
    it('should have descriptive button text', () => {
      const wrapper = mount(CounterControls);
      const buttons = wrapper.findAll('button');

      expect(buttons[0].text()).toBe('Increment');
      expect(buttons[1].text()).toBe('Decrement');
      expect(buttons[2].text()).toBe('Reset');
    });

    it('should have appropriate styling classes for buttons', () => {
      const wrapper = mount(CounterControls);
      const buttons = wrapper.findAll('button');

      expect(buttons).toHaveLength(3);
      buttons.forEach((button) => {
        expect(button.classes()).toContain('px-6');
        expect(button.classes()).toContain('py-3');
      });
    });
  });

  describe('button interactions', () => {
    it('should handle rapid button clicks', async () => {
      const wrapper = mount(CounterControls);
      const buttons = wrapper.findAll('button');
      const incrementButton = buttons[0];

      for (let i = 0; i < 10; i++) {
        await incrementButton.trigger('click');
      }

      expect(wrapper.emitted('increment')).toHaveLength(10);
    });

    it('should handle alternating button clicks', async () => {
      const wrapper = mount(CounterControls);
      const buttons = wrapper.findAll('button');
      const incrementButton = buttons[0];
      const decrementButton = buttons[1];

      await incrementButton.trigger('click');
      await decrementButton.trigger('click');
      await incrementButton.trigger('click');

      expect(wrapper.emitted('increment')).toHaveLength(2);
      expect(wrapper.emitted('decrement')).toHaveLength(1);
    });
  });
});
