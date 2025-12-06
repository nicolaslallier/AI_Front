import { describe, it, expect } from 'vitest';

import type { ApiResponse, ApiError, PaginationMeta, PaginatedResponse } from './index';

describe('Shared Types', () => {
  describe('ApiResponse', () => {
    it('should allow successful response structure', () => {
      const response: ApiResponse<string> = {
        success: true,
        data: 'test data',
      };

      expect(response.success).toBe(true);
      expect(response.data).toBe('test data');
    });

    it('should allow response with message', () => {
      const response: ApiResponse<string> = {
        success: true,
        data: 'test data',
        message: 'Success message',
      };

      expect(response.success).toBe(true);
      expect(response.message).toBe('Success message');
    });

    it('should work with complex data types', () => {
      interface User {
        id: number;
        name: string;
      }

      const response: ApiResponse<User> = {
        success: true,
        data: { id: 1, name: 'John' },
      };

      expect(response.data.id).toBe(1);
      expect(response.data.name).toBe('John');
    });
  });

  describe('ApiError', () => {
    it('should allow ApiError structure', () => {
      const error: ApiError = {
        message: 'Something went wrong',
        code: 'ERROR_001',
      };

      expect(error.message).toBe('Something went wrong');
      expect(error.code).toBe('ERROR_001');
    });

    it('should allow optional details', () => {
      const error: ApiError = {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: { field: 'email', reason: 'invalid' },
      };

      expect(error.details).toBeDefined();
      expect(error.details).toHaveProperty('field');
    });
  });

  describe('PaginationMeta', () => {
    it('should allow pagination metadata', () => {
      const meta: PaginationMeta = {
        page: 1,
        perPage: 10,
        total: 100,
        totalPages: 10,
      };

      expect(meta.page).toBe(1);
      expect(meta.perPage).toBe(10);
      expect(meta.total).toBe(100);
      expect(meta.totalPages).toBe(10);
    });

    it('should allow different page numbers', () => {
      const meta: PaginationMeta = {
        page: 5,
        perPage: 20,
        total: 200,
        totalPages: 10,
      };

      expect(meta.page).toBe(5);
      expect(meta.totalPages).toBe(10);
    });
  });

  describe('PaginatedResponse', () => {
    it('should allow paginated response structure', () => {
      interface Item {
        id: number;
      }

      const response: PaginatedResponse<Item> = {
        data: [{ id: 1 }, { id: 2 }],
        meta: {
          page: 1,
          perPage: 10,
          total: 100,
          totalPages: 10,
        },
      };

      expect(response.data).toHaveLength(2);
      expect(response.meta.total).toBe(100);
      expect(response.meta.totalPages).toBe(10);
    });

    it('should work with empty data', () => {
      const response: PaginatedResponse<string> = {
        data: [],
        meta: {
          page: 1,
          perPage: 10,
          total: 0,
          totalPages: 0,
        },
      };

      expect(response.data).toHaveLength(0);
      expect(response.meta.total).toBe(0);
    });
  });
});
