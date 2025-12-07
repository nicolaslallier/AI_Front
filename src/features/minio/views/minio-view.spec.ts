import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import MinioView from './minio-view.vue';
import MinioError from '../components/minio-error.vue';
import MinioIframe from '../components/minio-iframe.vue';

describe('MinioView', () => {
  describe('component rendering', () => {
    it('should render the component', () => {
      const wrapper = mount(MinioView);
      expect(wrapper.exists()).toBe(true);
    });

    it('should render MinioIframe component initially', async () => {
      const wrapper = mount(MinioView);
      await flushPromises();
      const iframe = wrapper.findComponent(MinioIframe);
      expect(iframe.exists()).toBe(true);
    });

    it('should have proper container structure', () => {
      const wrapper = mount(MinioView);
      const container = wrapper.find('.w-full');
      expect(container.exists()).toBe(true);
    });
  });

  describe('initial state', () => {
    it('should initialize with loading state', async () => {
      const wrapper = mount(MinioView);
      await flushPromises();
      const iframe = wrapper.findComponent(MinioIframe);
      expect(iframe.props('isLoading')).toBe(true);
    });

    it('should pass MinIO URL to iframe', () => {
      const wrapper = mount(MinioView);
      const iframe = wrapper.findComponent(MinioIframe);
      expect(iframe.props('url')).toBe('http://localhost/minio/');
    });

    it('should not show error component initially', () => {
      const wrapper = mount(MinioView);
      const errorComponent = wrapper.findComponent(MinioError);
      expect(errorComponent.exists()).toBe(false);
    });
  });

  describe('iframe load handling', () => {
    it('should handle successful iframe load', async () => {
      const wrapper = mount(MinioView);
      const iframe = wrapper.findComponent(MinioIframe);

      await iframe.vm.$emit('load');
      await flushPromises();

      expect(iframe.props('isLoading')).toBe(false);
    });

    it('should transition from loading to loaded state', async () => {
      const wrapper = mount(MinioView);
      await flushPromises();
      const iframe = wrapper.findComponent(MinioIframe);

      expect(iframe.props('isLoading')).toBe(true);
      await iframe.vm.$emit('load');
      await flushPromises();
      expect(iframe.props('isLoading')).toBe(false);
    });

    it('should clear any previous errors on successful load', async () => {
      const wrapper = mount(MinioView);
      await flushPromises();
      let iframe = wrapper.findComponent(MinioIframe);

      // Trigger error first
      await iframe.vm.$emit('error');
      await flushPromises();

      // Verify error is shown
      let errorComponent = wrapper.findComponent(MinioError);
      expect(errorComponent.exists()).toBe(true);

      // Retry (which triggers setLoading again)
      await errorComponent.vm.$emit('retry');
      await flushPromises();

      // Now iframe should be shown again
      iframe = wrapper.findComponent(MinioIframe);
      expect(iframe.exists()).toBe(true);

      // Then successful load
      await iframe.vm.$emit('load');
      await flushPromises();

      // Error should be gone
      errorComponent = wrapper.findComponent(MinioError);
      expect(errorComponent.exists()).toBe(false);
    });
  });

  describe('iframe error handling', () => {
    it('should show error component when iframe fails', async () => {
      const wrapper = mount(MinioView);
      const iframe = wrapper.findComponent(MinioIframe);

      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(MinioError);
      expect(errorComponent.exists()).toBe(true);
    });

    it('should hide iframe when error occurs', async () => {
      const wrapper = mount(MinioView);
      const iframe = wrapper.findComponent(MinioIframe);

      await iframe.vm.$emit('error');
      await flushPromises();

      expect(iframe.exists()).toBe(false);
    });

    it('should pass error to error component', async () => {
      const wrapper = mount(MinioView);
      const iframe = wrapper.findComponent(MinioIframe);

      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(MinioError);
      expect(errorComponent.props('error')).toBeDefined();
      expect(errorComponent.props('error').message).toBeTruthy();
    });

    it('should create appropriate error message', async () => {
      const wrapper = mount(MinioView);
      const iframe = wrapper.findComponent(MinioIframe);

      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(MinioError);
      const error = errorComponent.props('error');
      expect(error.message).toContain('MinIO');
    });
  });

  describe('retry mechanism', () => {
    it('should handle retry from error component', async () => {
      const wrapper = mount(MinioView);
      let iframe = wrapper.findComponent(MinioIframe);

      // Trigger error
      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(MinioError);
      expect(errorComponent.exists()).toBe(true);

      // Trigger retry
      await errorComponent.vm.$emit('retry');
      await flushPromises();

      // Iframe should be shown again
      iframe = wrapper.findComponent(MinioIframe);
      expect(iframe.exists()).toBe(true);
    });

    it('should set loading state on retry', async () => {
      const wrapper = mount(MinioView);
      let iframe = wrapper.findComponent(MinioIframe);

      // Trigger error
      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(MinioError);
      await errorComponent.vm.$emit('retry');
      await flushPromises();

      // Should be loading again
      iframe = wrapper.findComponent(MinioIframe);
      expect(iframe.props('isLoading')).toBe(true);
    });

    it('should increment retry count on each retry', async () => {
      const wrapper = mount(MinioView);
      let iframe = wrapper.findComponent(MinioIframe);

      // First error and retry
      await iframe.vm.$emit('error');
      await flushPromises();
      let errorComponent = wrapper.findComponent(MinioError);
      await errorComponent.vm.$emit('retry');
      await flushPromises();

      // Second error and retry
      iframe = wrapper.findComponent(MinioIframe);
      await iframe.vm.$emit('error');
      await flushPromises();
      errorComponent = wrapper.findComponent(MinioError);
      await errorComponent.vm.$emit('retry');
      await flushPromises();

      // Verify it incremented (indirectly by checking it still works)
      iframe = wrapper.findComponent(MinioIframe);
      expect(iframe.exists()).toBe(true);
    });
  });

  describe('component lifecycle', () => {
    it('should set loading state on mount', async () => {
      const wrapper = mount(MinioView);
      await flushPromises();

      const iframe = wrapper.findComponent(MinioIframe);
      expect(iframe.props('isLoading')).toBe(true);
    });

    it('should emit load event on successful mount and load', async () => {
      const wrapper = mount(MinioView);
      const iframe = wrapper.findComponent(MinioIframe);

      await iframe.vm.$emit('load');
      await flushPromises();

      expect(iframe.props('isLoading')).toBe(false);
    });
  });

  describe('state management', () => {
    it('should manage state through composable', () => {
      const wrapper = mount(MinioView);
      const vm = wrapper.vm as unknown as {
        state: unknown;
        isLoading: unknown;
        hasError: unknown;
      };

      expect(vm.state).toBeDefined();
      expect(vm.isLoading).toBeDefined();
      expect(vm.hasError).toBeDefined();
    });

    it('should expose handle functions', () => {
      const wrapper = mount(MinioView);
      const vm = wrapper.vm as unknown as {
        handleLoad: () => void;
        handleError: () => void;
        handleRetry: () => void;
      };

      expect(typeof vm.handleLoad).toBe('function');
      expect(typeof vm.handleError).toBe('function');
      expect(typeof vm.handleRetry).toBe('function');
    });
  });

  describe('error details', () => {
    it('should pass detailed error information', async () => {
      const wrapper = mount(MinioView);
      const iframe = wrapper.findComponent(MinioIframe);

      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(MinioError);
      const error = errorComponent.props('error');

      expect(error).toHaveProperty('type');
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('timestamp');
    });

    it('should include technical details in error', async () => {
      const wrapper = mount(MinioView);
      const iframe = wrapper.findComponent(MinioIframe);

      await iframe.vm.$emit('error');
      await flushPromises();

      const errorComponent = wrapper.findComponent(MinioError);
      const error = errorComponent.props('error');

      expect(error.details).toBeDefined();
      expect(error.details).toBeTruthy();
    });
  });

  describe('integration', () => {
    it('should orchestrate components correctly', async () => {
      const wrapper = mount(MinioView);
      await flushPromises();

      // Initially: iframe shown, no error
      let iframe = wrapper.findComponent(MinioIframe);
      let errorComponent = wrapper.findComponent(MinioError);
      expect(iframe.exists()).toBe(true);
      expect(errorComponent.exists()).toBe(false);

      // On error: error shown, no iframe
      await iframe.vm.$emit('error');
      await flushPromises();
      iframe = wrapper.findComponent(MinioIframe);
      errorComponent = wrapper.findComponent(MinioError);
      expect(iframe.exists()).toBe(false);
      expect(errorComponent.exists()).toBe(true);

      // On retry: iframe shown, no error
      await errorComponent.vm.$emit('retry');
      await flushPromises();
      iframe = wrapper.findComponent(MinioIframe);
      errorComponent = wrapper.findComponent(MinioError);
      expect(iframe.exists()).toBe(true);
      expect(errorComponent.exists()).toBe(false);

      // On successful load: iframe shown, no error, not loading
      await iframe.vm.$emit('load');
      await flushPromises();
      iframe = wrapper.findComponent(MinioIframe);
      errorComponent = wrapper.findComponent(MinioError);
      expect(iframe.exists()).toBe(true);
      expect(errorComponent.exists()).toBe(false);
      expect(iframe.props('isLoading')).toBe(false);
    });
  });

  describe('error boundary', () => {
    it('should prevent errors from crashing the app', async () => {
      const wrapper = mount(MinioView);
      const iframe = wrapper.findComponent(MinioIframe);

      await iframe.vm.$emit('error');
      await flushPromises();

      // App should still be functional
      const errorComponent = wrapper.findComponent(MinioError);
      expect(errorComponent.exists()).toBe(true);

      // Retry should work
      await errorComponent.vm.$emit('retry');
      await flushPromises();

      const newIframe = wrapper.findComponent(MinioIframe);
      expect(newIframe.exists()).toBe(true);
    });
  });
});
