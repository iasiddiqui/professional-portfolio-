'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/constants/query-keys';
import { getErrorMessage } from '@/lib/errors';
import { testimonialService } from '@/features/testimonials/services/testimonial.service';
import type {
  CreateTestimonialPayload,
  UpdateTestimonialPayload,
} from '@/features/testimonials/types/testimonial.types';

export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTestimonialPayload) => testimonialService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials.all });
      toast.success('Testimonial created successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to create testimonial')),
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTestimonialPayload }) =>
      testimonialService.update(id, payload),
    onSuccess: (testimonial) => {
      queryClient.setQueryData(QUERY_KEYS.testimonials.detail(testimonial.id), testimonial);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials.all });
      toast.success('Testimonial updated successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update testimonial')),
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => testimonialService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials.all });
      toast.success('Testimonial deleted successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete testimonial')),
  });
}
