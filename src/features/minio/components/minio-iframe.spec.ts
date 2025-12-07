import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import MinioIframe from './minio-iframe.vue';

describe('MinioIframe', () => {
  const defaultProps = {
    url: 'http://localhost/minio/',
    isLoading: false,
  };

  describe('component rendering', () => {
    it('should render the component', () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('should render an iframe element', () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.exists()).toBe(true);
    });

    it('should set iframe src to provided URL', () => {
      const testUrl = 'http://test.com/minio/';
      const wrapper = mount(MinioIframe, {
        props: {
          ...defaultProps,
          url: testUrl,
        },
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.attributes('src')).toBe(testUrl);
    });

    it('should apply proper iframe classes', () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.classes()).toContain('w-full');
      expect(iframe.classes()).toContain('h-full');
    });

    it('should have a container div', () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      const container = wrapper.find('.relative');
      expect(container.exists()).toBe(true);
    });
  });

  describe('loading state', () => {
    it('should show loading spinner when isLoading is true', () => {
      const wrapper = mount(MinioIframe, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      });
      const spinner = wrapper.find('[data-testid="loading-spinner"]');
      expect(spinner.exists()).toBe(true);
    });

    it('should hide loading spinner when isLoading is false', () => {
      const wrapper = mount(MinioIframe, {
        props: {
          ...defaultProps,
          isLoading: false,
        },
      });
      const spinner = wrapper.find('[data-testid="loading-spinner"]');
      expect(spinner.exists()).toBe(false);
    });

    it('should display loading text when loading', () => {
      const wrapper = mount(MinioIframe, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      });
      expect(wrapper.text()).toContain('Loading MinIO console');
    });
  });

  describe('iframe attributes', () => {
    it('should have title attribute for accessibility', () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.attributes('title')).toBe('MinIO Console');
    });

    it('should have allowfullscreen attribute', () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.attributes('allowfullscreen')).toBeDefined();
    });

    it('should have sandbox attribute for security', () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      const sandbox = iframe.attributes('sandbox');
      expect(sandbox).toBeDefined();
      expect(sandbox).toContain('allow-same-origin');
      expect(sandbox).toContain('allow-scripts');
      expect(sandbox).toContain('allow-forms');
    });

    it('should have border-0 class for clean integration', () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.classes()).toContain('border-0');
    });
  });

  describe('event handling', () => {
    it('should emit load event when iframe loads', async () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      await iframe.trigger('load');

      expect(wrapper.emitted('load')).toBeTruthy();
      expect(wrapper.emitted('load')).toHaveLength(1);
    });

    it('should emit error event when iframe fails to load', async () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');

      expect(wrapper.emitted('error')).toBeTruthy();
      expect(wrapper.emitted('error')).toHaveLength(1);
    });

    it('should handle multiple load events', async () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');

      await iframe.trigger('load');
      await iframe.trigger('load');

      expect(wrapper.emitted('load')).toHaveLength(2);
    });
  });

  describe('props validation', () => {
    it('should require url prop', () => {
      const urlProp = MinioIframe.props.url;
      expect(urlProp.required).toBe(true);
      expect(urlProp.type).toBe(String);
    });

    it('should have optional isLoading prop with default false', () => {
      const isLoadingProp = MinioIframe.props.isLoading;
      expect(isLoadingProp.type).toBe(Boolean);
      expect(isLoadingProp.default).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('should have role status on loading overlay', () => {
      const wrapper = mount(MinioIframe, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      });
      const spinner = wrapper.find('[data-testid="loading-spinner"]');
      expect(spinner.attributes('role')).toBe('status');
    });

    it('should have aria-live polite on loading overlay', () => {
      const wrapper = mount(MinioIframe, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      });
      const spinner = wrapper.find('[data-testid="loading-spinner"]');
      expect(spinner.attributes('aria-live')).toBe('polite');
    });
  });

  describe('responsive design', () => {
    it('should have full width and height classes', () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      const iframe = wrapper.find('iframe');
      expect(iframe.classes()).toContain('w-full');
      expect(iframe.classes()).toContain('h-full');
    });

    it('should have min-h-screen on container', () => {
      const wrapper = mount(MinioIframe, {
        props: defaultProps,
      });
      const container = wrapper.find('.relative');
      expect(container.classes()).toContain('min-h-screen');
    });
  });

  describe('loading overlay styling', () => {
    it('should have overlay positioned absolutely', () => {
      const wrapper = mount(MinioIframe, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      });
      const overlay = wrapper.find('[data-testid="loading-spinner"]');
      expect(overlay.classes()).toContain('absolute');
      expect(overlay.classes()).toContain('inset-0');
    });

    it('should have proper z-index for overlay', () => {
      const wrapper = mount(MinioIframe, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      });
      const overlay = wrapper.find('[data-testid="loading-spinner"]');
      expect(overlay.classes()).toContain('z-10');
    });
  });
});
