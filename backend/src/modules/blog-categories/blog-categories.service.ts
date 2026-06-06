import { PERMISSIONS, hasPermission } from '../../constants/permissions.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { blogCategoryRepository } from '../../repositories/blog-category.repository.js';
import { AppError } from '../../utils/app-error.js';
import { generateUniqueSlug } from '../../utils/slug.js';
import { mapBlogCategoryToDto } from './blog-categories.dto.js';
import type {
  CreateBlogCategoryInput,
  UpdateBlogCategoryInput,
} from './blog-categories.validator.js';

export class BlogCategoriesService {
  async list() {
    const items = await blogCategoryRepository.findMany();
    return items.map(mapBlogCategoryToDto);
  }

  async create(input: CreateBlogCategoryInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const slug = input.slug
      ? input.slug
      : await generateUniqueSlug(input.name, (value) => blogCategoryRepository.slugExists(value));

    if (input.slug && (await blogCategoryRepository.slugExists(input.slug))) {
      throw new AppError('Category slug already exists', HTTP_STATUS.CONFLICT);
    }

    const category = await blogCategoryRepository.create({
      name: input.name,
      slug,
      description: input.description ?? null,
    });

    const withCount = await blogCategoryRepository.findMany();
    const created = withCount.find((item) => item.id === category.id)!;
    return mapBlogCategoryToDto(created);
  }

  async update(id: string, input: UpdateBlogCategoryInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await blogCategoryRepository.findById(id);
    if (!existing) throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);

    if (input.slug && input.slug !== existing.slug) {
      if (await blogCategoryRepository.slugExists(input.slug, id)) {
        throw new AppError('Category slug already exists', HTTP_STATUS.CONFLICT);
      }
    }

    await blogCategoryRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
    });

    const withCount = await blogCategoryRepository.findMany();
    const updated = withCount.find((item) => item.id === id)!;
    return mapBlogCategoryToDto(updated);
  }

  async delete(id: string, permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.BLOG_DELETE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }

    const existing = await blogCategoryRepository.findById(id);
    if (!existing) throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);

    await blogCategoryRepository.delete(id);
    return { id };
  }

  private assertWritePermission(permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.BLOG_WRITE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }
  }
}

export const blogCategoriesService = new BlogCategoriesService();
