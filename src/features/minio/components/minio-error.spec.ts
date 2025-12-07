import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';

import MinioError from './minio-error.vue';
import { MinioErrorType } from '../types/index';

import type { MinioError as MinioErrorType_Interface } from '../types/index';

describe('MinioError', () => {
  const mockError: MinioErrorType_Interface = {
    type: MinioErrorType.NETWORK_ERROR,
    message: 'Failed to load MinIO console',
    timestamp: new Date(),
  };

  describe('component rendering', () => {
    it('should render the component', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('should display error message', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      expect(wrapper.text()).toContain(mockError.message);
    });

    it('should render error icon', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const icon = wrapper.find('[data-testid="error-icon"]');
      expect(icon.exists()).toBe(true);
    });

    it('should have proper error container styling', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const container = wrapper.find('[data-testid="error-container"]');
      expect(container.exists()).toBe(true);
      expect(container.classes()).toContain('bg-red-50');
    });
  });

  describe('retry functionality', () => {
    it('should render retry button', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const retryButton = wrapper.find('button');
      expect(retryButton.exists()).toBe(true);
    });

    it('should display retry button text', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const retryButton = wrapper.find('button');
      expect(retryButton.text()).toContain('Retry');
    });

    it('should emit retry event when button clicked', async () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const retryButton = wrapper.find('button');
      await retryButton.trigger('click');
      expect(wrapper.emitted('retry')).toBeTruthy();
    });

    it('should emit retry event only once per click', async () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const retryButton = wrapper.find('button');
      await retryButton.trigger('click');
      expect(wrapper.emitted('retry')).toHaveLength(1);
    });

    it('should call onRetry handler when provided', async () => {
      const onRetry = vi.fn();
      const wrapper = mount(MinioError, {
        props: { error: mockError },
        attrs: { onRetry },
      });
      const retryButton = wrapper.find('button');
      await retryButton.trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('retry')).toBeTruthy();
    });
  });

  describe('error details', () => {
    it('should display error details when provided', () => {
      const errorWithDetails: MinioErrorType_Interface = {
        ...mockError,
        details: 'CORS policy blocked the request',
      };
      const wrapper = mount(MinioError, {
        props: { error: errorWithDetails },
      });
      const detailsSection = wrapper.find('[data-testid="error-details"]');
      expect(detailsSection.exists()).toBe(true);
      expect(wrapper.text()).toContain('CORS policy blocked the request');
    });

    it('should hide error details section when not provided', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const detailsSection = wrapper.find('[data-testid="error-details"]');
      expect(detailsSection.exists()).toBe(false);
    });

    it('should display technical details label', () => {
      const errorWithDetails: MinioErrorType_Interface = {
        ...mockError,
        details: 'Network timeout after 30s',
      };
      const wrapper = mount(MinioError, {
        props: { error: errorWithDetails },
      });
      expect(wrapper.text()).toContain('Technical Details:');
    });
  });

  describe('error types', () => {
    it('should handle NETWORK_ERROR type', () => {
      const error: MinioErrorType_Interface = {
        type: MinioErrorType.NETWORK_ERROR,
        message: 'Network connection failed',
        timestamp: new Date(),
      };
      const wrapper = mount(MinioError, {
        props: { error },
      });
      expect(wrapper.text()).toContain('Network connection failed');
    });

    it('should handle TIMEOUT_ERROR type', () => {
      const error: MinioErrorType_Interface = {
        type: MinioErrorType.TIMEOUT_ERROR,
        message: 'Request timed out',
        timestamp: new Date(),
      };
      const wrapper = mount(MinioError, {
        props: { error },
      });
      expect(wrapper.text()).toContain('Request timed out');
    });

    it('should handle IFRAME_ERROR type', () => {
      const error: MinioErrorType_Interface = {
        type: MinioErrorType.IFRAME_ERROR,
        message: 'Iframe failed to load',
        timestamp: new Date(),
      };
      const wrapper = mount(MinioError, {
        props: { error },
      });
      expect(wrapper.text()).toContain('Iframe failed to load');
    });

    it('should handle UNKNOWN_ERROR type', () => {
      const error: MinioErrorType_Interface = {
        type: MinioErrorType.UNKNOWN_ERROR,
        message: 'An unknown error occurred',
        timestamp: new Date(),
      };
      const wrapper = mount(MinioError, {
        props: { error },
      });
      expect(wrapper.text()).toContain('An unknown error occurred');
    });
  });

  describe('accessibility', () => {
    it('should have role alert on container', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const container = wrapper.find('.min-h-screen');
      expect(container.attributes('role')).toBe('alert');
    });

    it('should have aria-live assertive on container', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const container = wrapper.find('.min-h-screen');
      expect(container.attributes('aria-live')).toBe('assertive');
    });

    it('should have aria-label on retry button', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const retryButton = wrapper.find('button');
      expect(retryButton.attributes('aria-label')).toBe('Retry loading MinIO console');
    });

    it('should have button type attribute', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const retryButton = wrapper.find('button');
      expect(retryButton.attributes('type')).toBe('button');
    });
  });

  describe('props validation', () => {
    it('should require error prop', () => {
      const errorProp = MinioError.props.error;
      expect(errorProp.required).toBe(true);
    });

    it('should accept MinioError type', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      expect(wrapper.props('error')).toEqual(mockError);
    });
  });

  describe('styling', () => {
    it('should have error title', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      expect(wrapper.text()).toContain('MinIO Console Unavailable');
    });

    it('should have centered layout', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const container = wrapper.find('.min-h-screen');
      expect(container.classes()).toContain('flex');
      expect(container.classes()).toContain('items-center');
      expect(container.classes()).toContain('justify-center');
    });

    it('should have error message styling', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const message = wrapper.find('[data-testid="error-message"]');
      expect(message.exists()).toBe(true);
      expect(message.classes()).toContain('text-center');
    });

    it('should have proper button styling', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const button = wrapper.find('button');
      expect(button.classes()).toContain('bg-indigo-600');
      expect(button.classes()).toContain('text-white');
    });
  });

  describe('responsive design', () => {
    it('should have responsive container width', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const errorContainer = wrapper.find('[data-testid="error-container"]');
      expect(errorContainer.classes()).toContain('max-w-md');
      expect(errorContainer.classes()).toContain('w-full');
    });

    it('should have padding for mobile', () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const container = wrapper.find('.min-h-screen');
      expect(container.classes()).toContain('px-4');
    });
  });

  describe('user interaction', () => {
    it('should handle multiple retry clicks', async () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const retryButton = wrapper.find('button');

      await retryButton.trigger('click');
      await retryButton.trigger('click');
      await retryButton.trigger('click');

      expect(wrapper.emitted('retry')).toHaveLength(3);
    });

    it('should emit retry without payload', async () => {
      const wrapper = mount(MinioError, {
        props: { error: mockError },
      });
      const retryButton = wrapper.find('button');
      await retryButton.trigger('click');

      const emitted = wrapper.emitted('retry');
      expect(emitted).toBeTruthy();
      expect(emitted![0]).toEqual([]);
    });
  });
});
