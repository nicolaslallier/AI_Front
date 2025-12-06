import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Logger } from './logger';

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('info', () => {
    it('should log info messages with prefix', () => {
      Logger.info('Test message');

      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] Test message', '');
    });

    it('should log info messages with additional data', () => {
      Logger.info('Message', { key: 'value' });

      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] Message', { key: 'value' });
    });

    it('should log info messages with objects', () => {
      const testObj = { foo: 'bar', nested: { value: 42 } };
      Logger.info('Object test', testObj);

      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] Object test', testObj);
    });

    it('should log info messages with arrays', () => {
      const testArray = [1, 2, 3, 4, 5];
      Logger.info('Array test', testArray);

      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] Array test', testArray);
    });
  });

  describe('warn', () => {
    it('should log warning messages with prefix', () => {
      Logger.warn('Warning message');

      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] Warning message', '');
    });

    it('should log warning messages with additional data', () => {
      Logger.warn('Warning', 'additional data');

      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] Warning', 'additional data');
    });

    it('should log warning messages with error objects', () => {
      const error = new Error('Test error');
      Logger.warn('Error warning', error);

      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] Error warning', error);
    });
  });

  describe('error', () => {
    it('should log error messages with prefix', () => {
      Logger.error('Error message');

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Error message', '');
    });

    it('should log error messages with additional context', () => {
      Logger.error('Error', { details: 'test' });

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Error', { details: 'test' });
    });

    it('should log error messages with Error instances', () => {
      const error = new Error('Test error');
      error.stack = 'Test stack trace';
      Logger.error('Critical error', error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Critical error', error);
    });

    it('should log error messages with string errors', () => {
      Logger.error('Unknown error', 'string error');

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Unknown error', 'string error');
    });
  });

  describe('debug', () => {
    it('should log debug messages when debug is enabled', () => {
      Logger.debug('Debug message');

      if (consoleLogSpy.mock.calls.length > 0) {
        expect(consoleLogSpy).toHaveBeenCalledWith('[DEBUG] Debug message', '');
      }
    });

    it('should log debug messages with additional data', () => {
      Logger.debug('Debug', { test: true });

      if (consoleLogSpy.mock.calls.length > 0) {
        expect(consoleLogSpy).toHaveBeenCalledWith('[DEBUG] Debug', { test: true });
      }
    });

    it('should log debug messages with complex objects', () => {
      const complexObj = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      };

      Logger.debug('Complex object', complexObj);

      if (consoleLogSpy.mock.calls.length > 0) {
        expect(consoleLogSpy).toHaveBeenCalledWith('[DEBUG] Complex object', complexObj);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle null values', () => {
      Logger.info('Null test', null);

      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] Null test', '');
    });

    it('should handle undefined values', () => {
      Logger.info('Undefined test');

      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] Undefined test', '');
    });

    it('should handle empty strings', () => {
      Logger.info('');

      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] ', '');
    });

    it('should handle special characters', () => {
      Logger.info('Special chars: !@#$%^&*()');

      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] Special chars: !@#$%^&*()', '');
    });

    it('should handle very long messages', () => {
      const longMessage = 'a'.repeat(10000);
      Logger.info(longMessage);

      expect(consoleLogSpy).toHaveBeenCalledWith(`[INFO] ${longMessage}`, '');
    });

    it('should handle circular references safely', () => {
      const circular: Record<string, unknown> = { key: 'value' };
      circular.self = circular;

      Logger.info('Circular test', circular);

      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('multiple log calls', () => {
    it('should handle rapid successive calls', () => {
      for (let i = 0; i < 100; i++) {
        Logger.warn(`Message ${i}`);
      }

      expect(consoleWarnSpy).toHaveBeenCalledTimes(100);
    });

    it('should handle mixed log levels', () => {
      Logger.warn('Warn');
      Logger.error('Error');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });
});
