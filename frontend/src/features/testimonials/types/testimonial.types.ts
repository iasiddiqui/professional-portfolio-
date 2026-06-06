export interface Testimonial {
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

export interface TestimonialListParams {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
}

export interface TestimonialListResult {
  items: Testimonial[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateTestimonialPayload {
  clientName: string;
  company?: string | null;
  designation?: string | null;
  content: string;
  rating?: number | null;
  featured?: boolean;
}

export type UpdateTestimonialPayload = Partial<CreateTestimonialPayload>;
