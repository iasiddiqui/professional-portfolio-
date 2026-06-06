export { TESTIMONIAL_MODULE_CONFIG, RATING_OPTIONS } from './config/testimonial.config';
export {
  useCreateTestimonial,
  useDeleteTestimonial,
  useUpdateTestimonial,
} from './hooks/use-testimonial-mutations';
export { useTestimonials, useTestimonial } from './hooks/use-testimonials';
export { testimonialService } from './services/testimonial.service';
export { TestimonialsModuleView } from './components/testimonials-module-view';
export {
  testimonialFormDefaultValues,
  testimonialFormSchema,
  toTestimonialFormValues,
  toTestimonialPayload,
  type TestimonialFormValues,
} from './schemas/testimonial.schemas';
export type {
  CreateTestimonialPayload,
  Testimonial,
  TestimonialListParams,
  TestimonialListResult,
  UpdateTestimonialPayload,
} from './types/testimonial.types';
