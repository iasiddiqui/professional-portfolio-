import type { TestimonialRecord } from '../../repositories/testimonial.repository.js';

export interface TestimonialDto {
  id: string;
  clientName: string;
  company: string | null;
  designation: string | null;
  content: string;
  rating: number | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export function mapTestimonialToDto(testimonial: TestimonialRecord): TestimonialDto {
  return {
    id: testimonial.id,
    clientName: testimonial.clientName,
    company: testimonial.company,
    designation: testimonial.designation,
    content: testimonial.content,
    rating: testimonial.rating,
    featured: testimonial.featured,
    createdAt: testimonial.createdAt.toISOString(),
    updatedAt: testimonial.updatedAt.toISOString(),
  };
}
