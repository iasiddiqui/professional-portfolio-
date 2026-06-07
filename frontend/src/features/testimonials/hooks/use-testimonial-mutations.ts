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

export function useUpdateTestimonialFeaturedMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      testimonialService.update(id, { featured }),
    onSuccess: (testimonial) => {
      queryClient.setQueryData(QUERY_KEYS.testimonials.detail(testimonial.id), testimonial);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials.all });
      toast.success(testimonial.featured ? 'Testimonial featured' : 'Testimonial unfeatured');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update featured status')),
  });
}

export function useBulkUpdateTestimonialFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, featured }: { ids: string[]; featured: boolean }) => {
      const results = await Promise.allSettled(
        ids.map((id) => testimonialService.update(id, { featured }))
      );
      const succeeded = results.filter((result) => result.status === 'fulfilled').length;
      const failed = ids.length - succeeded;

      if (succeeded === 0) {
        throw new Error(`Failed to ${featured ? 'feature' : 'unfeature'} selected testimonials`);
      }

      return { succeeded, failed, featured };
    },
    onSuccess: ({ succeeded, failed, featured }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials.all });
      const action = featured ? 'featured' : 'unfeatured';
      if (failed > 0) {
        toast.success(`${succeeded} testimonial(s) ${action}, ${failed} failed`);
      } else {
        toast.success(`${succeeded} testimonial(s) ${action}`);
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Bulk featured update failed')),
  });
}

export function useBulkDeleteTestimonials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(ids.map((id) => testimonialService.delete(id)));
      const succeeded = results.filter((result) => result.status === 'fulfilled').length;
      const failed = ids.length - succeeded;

      if (succeeded === 0) {
        throw new Error('Failed to delete selected testimonials');
      }

      return { succeeded, failed };
    },
    onSuccess: ({ succeeded, failed }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.testimonials.all });
      if (failed > 0) {
        toast.success(`${succeeded} testimonial(s) deleted, ${failed} failed`);
      } else {
        toast.success(`${succeeded} testimonial(s) deleted`);
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Bulk delete failed')),
  });
}
