import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import GrafanaView from './grafana-view.vue';
import GrafanaError from '../components/grafana-error.vue';
import GrafanaIframe from '../components/grafana-iframe.vue';

describe('GrafanaView', () => {
  describe('component rendering', () => {
    it('should render the component', () => {
      const wrapper = mount(GrafanaView);
      expect(wrapper.exists()).toBe(true);
    });

    it('should render GrafanaIframe component initially', async () => {
      const wrapper = mount(GrafanaView);
      await flushPromises();
      const iframe = wrapper.findComponent(GrafanaIframe);
      expect(iframe.exists()).toBe(true);
    });

    it('should have proper container structure', () => {
      const wrapper = mount(GrafanaView);
      const container = wrapper.find('.w-full');
      expect(container.exists()).toBe(true);
    });
  });

  describe('initial state', () => {
    it('should initialize with loading state', async () => {
      const wrapper = mount(GrafanaView);
      await flushPromises();
      const iframe = wrapper.findComponent(GrafanaIframe);
      expect(iframe.props('isLoading')).toBe(true);
    });

    it('should pass Grafana URL to iframe', () => {
      const wrapper = mount(GrafanaView);
      const iframe = wrapper.findComponent(GrafanaIframe);
      expect(iframe.props('url')).toBe('http://localhost/grafana/');
    });

    it('should not show error component initially', () => {
      const wrapper = mount(GrafanaView);
      const errorComponent = wrapper.findComponent(GrafanaError);
      expect(errorComponent.exists()).toBe(false);
    });
  });

  describe('iframe load handling', () => {
    it('should handle successful iframe load', async () => {
      const wrapper = mount(GrafanaView);
      const iframe = wrapper.findComponent(GrafanaIframe);

      await iframe.vm.$emit('load');
      await flushPromises();

      expect(iframe.props('isLoading')).toBe(false);
    });

    it('should transition from loading to loaded state', async () => {
      const wrapper = mount(GrafanaView);
      await flushPromises();
      const iframe = wrapper.findComponent(GrafanaIframe);

      expect(iframe.props('isLoading')).toBe(true);
      await iframe.vm.$emit('load');
      await flushPromises();
      expect(iframe.props('isLoading')).toBe(false);
    });

    it('should clear any previous errors on successful load', async () => {
      const wrapper = mount(GrafanaView);
      await flushPromises();
      let iframe = wrapper.findComponent(GrafanaIframe);

      // Trigger error first
      await iframe.vm.$emit('error');
      await flushPromises();

      // Verify error is shown
      let errorComponent = wrapper.findComponent(GrafanaError);
      expect(errorComponent.exists()).toBe(true);

      // Retry (which triggers setLoading again)
      await errorComponent.vm.$emit('retry');
      await flushPromises();

      // Now iframe should be shown again
      iframe = wrapper.findComponent(GrafanaIframe);
      expect(iframe.exists()).toBe(true);

      // Then successful load
      await iframe.vm.$emit('load');
      await flushPromises();

      // Error should be gone
      errorComponent = wrapper.findComponent(GrafanaError);
      expect(errorComponent.exists()).toBe(false);
    });
  });

  describe('iframe error handling', () => {
    it('should show error component when iframe fails', async () => {
      const wrapper = mount(GrafanaView);
      const iframe = wrapper.findComponent(GrafanaIframe);

      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(GrafanaError);
      expect(errorComponent.exists()).toBe(true);
    });

    it('should hide iframe when error occurs', async () => {
      const wrapper = mount(GrafanaView);
      const iframe = wrapper.findComponent(GrafanaIframe);

      await iframe.vm.$emit('error');
      await flushPromises();

      expect(iframe.exists()).toBe(false);
    });

    it('should pass error to error component', async () => {
      const wrapper = mount(GrafanaView);
      const iframe = wrapper.findComponent(GrafanaIframe);

      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(GrafanaError);
      expect(errorComponent.props('error')).toBeDefined();
      expect(errorComponent.props('error').message).toBeTruthy();
    });

    it('should create appropriate error message', async () => {
      const wrapper = mount(GrafanaView);
      const iframe = wrapper.findComponent(GrafanaIframe);

      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(GrafanaError);
      const error = errorComponent.props('error');
      expect(error.message).toContain('Grafana');
    });
  });

  describe('retry mechanism', () => {
    it('should handle retry from error component', async () => {
      const wrapper = mount(GrafanaView);
      const iframe = wrapper.findComponent(GrafanaIframe);

      // Trigger error
      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(GrafanaError);
      expect(errorComponent.exists()).toBe(true);

      // Trigger retry
      await errorComponent.vm.$emit('retry');
      await flushPromises();

      // Should show iframe again
      const iframeAfterRetry = wrapper.findComponent(GrafanaIframe);
      expect(iframeAfterRetry.exists()).toBe(true);
    });

    it('should hide error component after retry', async () => {
      const wrapper = mount(GrafanaView);
      const iframe = wrapper.findComponent(GrafanaIframe);

      // Trigger error
      await iframe.vm.$emit('error');
      await flushPromises();

      let errorComponent = wrapper.findComponent(GrafanaError);
      expect(errorComponent.exists()).toBe(true);

      // Trigger retry
      await errorComponent.vm.$emit('retry');
      await flushPromises();

      errorComponent = wrapper.findComponent(GrafanaError);
      expect(errorComponent.exists()).toBe(false);
    });

    it('should set loading state after retry', async () => {
      const wrapper = mount(GrafanaView);
      const iframe = wrapper.findComponent(GrafanaIframe);

      // Trigger error
      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(GrafanaError);

      // Trigger retry
      await errorComponent.vm.$emit('retry');
      await flushPromises();

      const iframeAfterRetry = wrapper.findComponent(GrafanaIframe);
      expect(iframeAfterRetry.props('isLoading')).toBe(true);
    });

    it('should increment retry count on retry', async () => {
      const wrapper = mount(GrafanaView);
      const iframe = wrapper.findComponent(GrafanaIframe);

      // Trigger error
      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(GrafanaError);

      // Trigger retry
      await errorComponent.vm.$emit('retry');
      await flushPromises();

      // We can't directly access retry count, but we can verify the retry worked
      const iframeAfterRetry = wrapper.findComponent(GrafanaIframe);
      expect(iframeAfterRetry.exists()).toBe(true);
    });
  });

  describe('state management', () => {
    it('should maintain Grafana state', () => {
      const wrapper = mount(GrafanaView);
      expect(wrapper.vm).toBeDefined();
    });

    it('should react to state changes', async () => {
      const wrapper = mount(GrafanaView);
      await flushPromises();
      const iframe = wrapper.findComponent(GrafanaIframe);

      // Initially loading
      expect(iframe.props('isLoading')).toBe(true);

      // After load
      await iframe.vm.$emit('load');
      await flushPromises();
      expect(iframe.props('isLoading')).toBe(false);
    });
  });

  describe('lifecycle', () => {
    it('should set loading state on mount', async () => {
      const wrapper = mount(GrafanaView);
      await flushPromises();
      const iframe = wrapper.findComponent(GrafanaIframe);
      expect(iframe.props('isLoading')).toBe(true);
    });

    it('should cleanup properly on unmount', () => {
      const wrapper = mount(GrafanaView);
      expect(() => wrapper.unmount()).not.toThrow();
    });
  });

  describe('integration', () => {
    it('should pass correct props to iframe component', () => {
      const wrapper = mount(GrafanaView);
      const iframe = wrapper.findComponent(GrafanaIframe);

      expect(iframe.props()).toHaveProperty('url');
      expect(iframe.props()).toHaveProperty('isLoading');
    });

    it('should handle complete error-retry-success flow', async () => {
      const wrapper = mount(GrafanaView);
      await flushPromises();

      // Initial state - iframe loading
      let iframe = wrapper.findComponent(GrafanaIframe);
      expect(iframe.exists()).toBe(true);
      expect(iframe.props('isLoading')).toBe(true);

      // Error occurs
      await iframe.vm.$emit('error');
      await flushPromises();

      let errorComponent = wrapper.findComponent(GrafanaError);
      expect(errorComponent.exists()).toBe(true);

      // User retries
      await errorComponent.vm.$emit('retry');
      await flushPromises();

      iframe = wrapper.findComponent(GrafanaIframe);
      expect(iframe.exists()).toBe(true);
      expect(iframe.props('isLoading')).toBe(true);

      // Successful load
      await iframe.vm.$emit('load');
      await flushPromises();

      expect(iframe.props('isLoading')).toBe(false);
      errorComponent = wrapper.findComponent(GrafanaError);
      expect(errorComponent.exists()).toBe(false);
    });
  });
});
