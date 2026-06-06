import { PERMISSIONS, hasPermission } from '../../constants/permissions.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { testimonialRepository } from '../../repositories/testimonial.repository.js';
import { AppError } from '../../utils/app-error.js';
import { mapTestimonialToDto } from './testimonials.dto.js';
import type {
  CreateTestimonialInput,
  TestimonialListQueryInput,
  UpdateTestimonialInput,
} from './testimonials.validator.js';

export class TestimonialsService {
  async list(query: TestimonialListQueryInput) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const { items, total } = await testimonialRepository.findMany({
      page,
      limit,
      skip,
      search: query.search,
      featured: query.featured,
    });

    return { items: items.map(mapTestimonialToDto), total, page, limit };
  }

  async getById(id: string) {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) throw new AppError('Testimonial not found', HTTP_STATUS.NOT_FOUND);
    return mapTestimonialToDto(testimonial);
  }

  async create(input: CreateTestimonialInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const testimonial = await testimonialRepository.create({
      clientName: input.clientName,
      company: input.company ?? null,
      designation: input.designation ?? null,
      content: input.content,
      rating: input.rating ?? null,
      featured: input.featured,
    });

    return mapTestimonialToDto(testimonial);
  }

  async update(id: string, input: UpdateTestimonialInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await testimonialRepository.findById(id);
    if (!existing) throw new AppError('Testimonial not found', HTTP_STATUS.NOT_FOUND);

    const testimonial = await testimonialRepository.update(id, {
      ...(input.clientName !== undefined ? { clientName: input.clientName } : {}),
      ...(input.company !== undefined ? { company: input.company } : {}),
      ...(input.designation !== undefined ? { designation: input.designation } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.rating !== undefined ? { rating: input.rating } : {}),
      ...(input.featured !== undefined ? { featured: input.featured } : {}),
    });

    return mapTestimonialToDto(testimonial);
  }

  async delete(id: string, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await testimonialRepository.findById(id);
    if (!existing) throw new AppError('Testimonial not found', HTTP_STATUS.NOT_FOUND);

    await testimonialRepository.delete(id);
    return { id };
  }

  private assertWritePermission(permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.TESTIMONIALS_WRITE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }
  }
}

export const testimonialsService = new TestimonialsService();
