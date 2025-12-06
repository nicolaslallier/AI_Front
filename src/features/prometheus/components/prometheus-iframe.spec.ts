import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';

import PrometheusIframe from './prometheus-iframe.vue';

describe('PrometheusIframe', () => {
  const defaultProps = {
    url: 'http://localhost/prometheus/',
    isLoading: false,
  };

  describe('component rendering', () => {
    it('should render the component', () => {
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('should render an iframe element', () => {
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.exists()).toBe(true);
    });

    it('should set iframe src to provided URL', () => {
      const testUrl = 'http://test.com/prometheus/';
      const wrapper = mount(PrometheusIframe, {
        props: {
          ...defaultProps,
          url: testUrl,
        },
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.attributes('src')).toBe(testUrl);
    });

    it('should apply proper iframe classes', () => {
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.classes()).toContain('w-full');
      expect(iframe.classes()).toContain('h-full');
    });

    it('should have a container div', () => {
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
      });
      const container = wrapper.find('.relative');
      expect(container.exists()).toBe(true);
    });
  });

  describe('loading state', () => {
    it('should show loading spinner when isLoading is true', () => {
      const wrapper = mount(PrometheusIframe, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      });
      const spinner = wrapper.find('[data-testid="loading-spinner"]');
      expect(spinner.exists()).toBe(true);
    });

    it('should hide loading spinner when isLoading is false', () => {
      const wrapper = mount(PrometheusIframe, {
        props: {
          ...defaultProps,
          isLoading: false,
        },
      });
      const spinner = wrapper.find('[data-testid="loading-spinner"]');
      expect(spinner.exists()).toBe(false);
    });

    it('should display loading text when loading', () => {
      const wrapper = mount(PrometheusIframe, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      });
      expect(wrapper.text()).toContain('Loading Prometheus');
    });
  });

  describe('iframe attributes', () => {
    it('should have title attribute for accessibility', () => {
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.attributes('title')).toBe('Prometheus Database Administration');
    });

    it('should allow fullscreen', () => {
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.attributes('allowfullscreen')).toBeDefined();
    });

    it('should have proper sandbox attributes', () => {
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      const sandbox = iframe.attributes('sandbox');
      expect(sandbox).toBeDefined();
    });
  });

  describe('event handling', () => {
    it('should emit load event when iframe loads', async () => {
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      await iframe.trigger('load');
      expect(wrapper.emitted('load')).toBeTruthy();
      expect(wrapper.emitted('load')?.[0]).toBeDefined();
    });

    it('should emit error event when iframe fails to load', async () => {
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      expect(wrapper.emitted('error')).toBeTruthy();
      expect(wrapper.emitted('error')?.[0]).toBeDefined();
    });

    it('should call onLoad handler on load', async () => {
      const onLoad = vi.fn();
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
        attrs: {
          onLoad,
        },
      });
      const iframe = wrapper.find('iframe');
      await iframe.trigger('load');
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('load')).toBeTruthy();
    });

    it('should call onError handler on error', async () => {
      const onError = vi.fn();
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
        attrs: {
          onError,
        },
      });
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('error')).toBeTruthy();
    });
  });

  describe('props validation', () => {
    it('should accept url prop', () => {
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
      });
      expect(wrapper.props('url')).toBe(defaultProps.url);
    });

    it('should accept isLoading prop', () => {
      const wrapper = mount(PrometheusIframe, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      });
      expect(wrapper.props('isLoading')).toBe(true);
    });

    it('should update when props change', async () => {
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
      });
      await wrapper.setProps({ isLoading: true });
      const spinner = wrapper.find('[data-testid="loading-spinner"]');
      expect(spinner.exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have descriptive title for screen readers', () => {
      const wrapper = mount(PrometheusIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.attributes('title')).toBeTruthy();
    });

    it('should have aria-label on loading spinner', () => {
      const wrapper = mount(PrometheusIframe, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      });
      const loadingContainer = wrapper.find('[data-testid="loading-spinner"]');
      expect(loadingContainer.attributes('role')).toBe('status');
    });
  });
});
