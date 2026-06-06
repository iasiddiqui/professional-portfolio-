import { PERMISSIONS, hasPermission } from '../../constants/permissions.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { tagRepository } from '../../repositories/tag.repository.js';
import { AppError } from '../../utils/app-error.js';
import { generateUniqueSlug } from '../../utils/slug.js';
import { mapTagToDto } from './tags.dto.js';
import type { CreateTagInput, UpdateTagInput } from './tags.validator.js';

export class TagsService {
  async list() {
    const items = await tagRepository.findMany();
    return items.map(mapTagToDto);
  }

  async create(input: CreateTagInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const slug = input.slug
      ? input.slug
      : await generateUniqueSlug(input.name, (value) => tagRepository.slugExists(value));

    if (input.slug && (await tagRepository.slugExists(input.slug))) {
      throw new AppError('Tag slug already exists', HTTP_STATUS.CONFLICT);
    }

    const tag = await tagRepository.create({ name: input.name, slug });
    const withCount = await tagRepository.findMany();
    const created = withCount.find((item) => item.id === tag.id)!;
    return mapTagToDto(created);
  }

  async update(id: string, input: UpdateTagInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await tagRepository.findById(id);
    if (!existing) throw new AppError('Tag not found', HTTP_STATUS.NOT_FOUND);

    if (input.slug && input.slug !== existing.slug) {
      if (await tagRepository.slugExists(input.slug, id)) {
        throw new AppError('Tag slug already exists', HTTP_STATUS.CONFLICT);
      }
    }

    await tagRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
    });

    const withCount = await tagRepository.findMany();
    const updated = withCount.find((item) => item.id === id)!;
    return mapTagToDto(updated);
  }

  async delete(id: string, permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.BLOG_DELETE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }

    const existing = await tagRepository.findById(id);
    if (!existing) throw new AppError('Tag not found', HTTP_STATUS.NOT_FOUND);

    await tagRepository.delete(id);
    return { id };
  }

  private assertWritePermission(permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.BLOG_WRITE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }
  }
}

export const tagsService = new TagsService();
