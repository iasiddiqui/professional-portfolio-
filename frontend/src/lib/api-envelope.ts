import type { PaginationMeta } from '@/types/api.types';

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    pagination?: PaginationMeta;
    [key: string]: unknown;
  };
}

export interface PaginatedApiEnvelope<T> extends ApiEnvelope<T[]> {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
