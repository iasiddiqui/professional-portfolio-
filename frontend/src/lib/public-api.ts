import { SERVER_API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import type { ApiEnvelope } from '@/lib/api-envelope';
import type { PaginationMeta } from '@/types/api.types';

export interface PublicListParams {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
}

export interface PublicListResult<T> {
  items: T;
  pagination: PaginationMeta;
}

function buildQuery(params?: PublicListParams): string {
  if (!params) return '';
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.search) search.set('search', params.search);
  if (typeof params.featured === 'boolean') search.set('featured', String(params.featured));
  const query = search.toString();
  return query ? `?${query}` : '';
}

async function publicFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${SERVER_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
    next: { revalidate: 60 },
  });

  const json = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !json.success) {
    throw new Error(json.message ?? `Request failed (${response.status})`);
  }

  return json.data;
}

async function publicFetchList<T>(
  path: string,
  params?: PublicListParams
): Promise<PublicListResult<T[]>> {
  const response = await fetch(`${SERVER_API_BASE_URL}${path}${buildQuery(params)}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  });

  const json = (await response.json()) as ApiEnvelope<T[]>;
  const pagination = json.meta?.pagination;

  if (!response.ok || !json.success) {
    throw new Error(json.message ?? `Request failed (${response.status})`);
  }

  return {
    items: json.data,
    pagination: {
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? 12,
      total: pagination?.total ?? json.data.length,
      totalPages: pagination?.totalPages ?? 1,
      hasNextPage: pagination?.hasNextPage ?? false,
      hasPreviousPage: pagination?.hasPreviousPage ?? false,
    },
  };
}

export const publicApi = {
  getSite: () => publicFetch<import('@/features/public/types/public.types').PublicSite>(API_ENDPOINTS.public.site),
  getAbout: () => publicFetch<import('@/features/public/types/public.types').PublicAbout>(API_ENDPOINTS.public.about),
  getServices: () =>
    publicFetch<import('@/features/public/types/public.types').PublicService[]>(API_ENDPOINTS.public.services),
  getTestimonials: () =>
    publicFetch<import('@/features/public/types/public.types').PublicTestimonial[]>(
      API_ENDPOINTS.public.testimonials
    ),
  getResume: () =>
    publicFetch<import('@/features/public/types/public.types').PublicResume | null>(API_ENDPOINTS.public.resume),
  listProjects: (params?: PublicListParams) =>
    publicFetchList<import('@/features/public/types/public.types').PublicProjectSummary>(
      API_ENDPOINTS.public.projects,
      params
    ),
  getProject: (slug: string) =>
    publicFetch<import('@/features/public/types/public.types').PublicProject>(
      API_ENDPOINTS.public.project(slug)
    ),
  listBlogPosts: (params?: PublicListParams) =>
    publicFetchList<import('@/features/public/types/public.types').PublicBlogPostSummary>(
      API_ENDPOINTS.public.blog,
      params
    ),
  getBlogPost: (slug: string) =>
    publicFetch<import('@/features/public/types/public.types').PublicBlogPost>(
      API_ENDPOINTS.public.blogPost(slug)
    ),
  submitContact: (payload: import('@/features/public/types/public.types').ContactFormPayload) =>
    publicFetch<import('@/features/public/types/public.types').ContactSubmissionResponse>(
      API_ENDPOINTS.public.contact,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        cache: 'no-store',
      }
    ),
};
