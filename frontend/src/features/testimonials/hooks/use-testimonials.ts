'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS, QUERY_STALE_TIME } from '@/constants/query-keys';
import { testimonialService } from '@/features/testimonials/services/testimonial.service';
import type { TestimonialListParams } from '@/features/testimonials/types/testimonial.types';

export function useTestimonials(params?: TestimonialListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.testimonials.list(params),
    queryFn: () => testimonialService.list(params),
    staleTime: QUERY_STALE_TIME.default,
  });
}

export function useTestimonial(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.testimonials.detail(id),
    queryFn: () => testimonialService.getById(id),
    staleTime: QUERY_STALE_TIME.default,
    enabled: Boolean(id) && enabled,
  });
}
