import { config } from '@core/config';

/**
 * Logger utility class following the Single Responsibility Principle
 * Provides centralized logging with environment-aware output
 */
export class Logger {
  /**
   * Logs a debug message
   * Only outputs in development mode
   *
   * @param message - The message to log
   * @param data - Optional additional data
   */
  static debug(message: string, data?: unknown): void {
    if (config.enableDebug) {
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] ${message}`, data ?? '');
    }
  }

  /**
   * Logs an info message
   *
   * @param message - The message to log
   * @param data - Optional additional data
   */
  static info(message: string, data?: unknown): void {
    if (config.enableDebug) {
      // eslint-disable-next-line no-console
      console.log(`[INFO] ${message}`, data ?? '');
    }
  }

  /**
   * Logs a warning message
   *
   * @param message - The warning message
   * @param data - Optional additional data
   */
  static warn(message: string, data?: unknown): void {
    console.warn(`[WARN] ${message}`, data ?? '');
  }

  /**
   * Logs an error message
   *
   * @param message - The error message
   * @param error - Optional error object
   */
  static error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error ?? '');
  }
}
