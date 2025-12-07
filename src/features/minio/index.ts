/**
 * MinIO feature module
 * Exports composables and types for MinIO console integration
 */

export { useMinio } from './composables/use-minio';
export type { UseMinioReturn } from './composables/use-minio';

export { MinioLoadingState, MinioErrorType } from './types/index';
export type { MinioState, MinioError } from './types/index';
