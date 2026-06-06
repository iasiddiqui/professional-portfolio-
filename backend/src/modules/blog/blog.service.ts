import { PERMISSIONS, hasPermission } from '../../constants/permissions.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { blogRepository } from '../../repositories/blog.repository.js';
import { blogCategoryRepository } from '../../repositories/blog-category.repository.js';
import { tagRepository } from '../../repositories/tag.repository.js';
import { AppError } from '../../utils/app-error.js';
import { calculateReadingTimeMinutes } from '../../utils/reading-time.js';
import { generateUniqueSlug } from '../../utils/slug.js';
import { mapBlogPostToDto } from './blog.dto.js';
import type {
  BlogListQueryInput,
  CreateBlogPostInput,
  PublishBlogPostInput,
  UpdateBlogPostInput,
} from './blog.validator.js';

export class BlogService {
  async list(query: BlogListQueryInput) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const { items, total } = await blogRepository.findMany({
      page,
      limit,
      skip,
      published: query.published,
      categoryId: query.categoryId,
      tagId: query.tagId,
      search: query.search,
    });

    return { items: items.map(mapBlogPostToDto), total, page, limit };
  }

  async getById(id: string) {
    const post = await blogRepository.findById(id);
    if (!post) throw new AppError('Blog post not found', HTTP_STATUS.NOT_FOUND);
    return mapBlogPostToDto(post);
  }

  async create(input: CreateBlogPostInput, authorId: string, permissions: string[]) {
    this.assertWritePermission(permissions);

    if (input.published) {
      this.assertPublishPermission(permissions);
    }

    const slug = input.slug
      ? input.slug
      : await generateUniqueSlug(input.title, (value) => blogRepository.slugExists(value));

    if (input.slug && (await blogRepository.slugExists(input.slug))) {
      throw new AppError('Blog slug already exists', HTTP_STATUS.CONFLICT);
    }

    await this.validateRelations(input.categoryId, input.tagIds);

    const readingTimeMinutes = calculateReadingTimeMinutes(input.content);

    const post = await blogRepository.create({
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      contentFormat: input.contentFormat,
      featuredImage: input.featuredImage ?? null,
      readingTimeMinutes,
      published: input.published,
      publishedAt: input.published ? new Date() : null,
      seoTitle: input.seoTitle ?? null,
      seoDescription: input.seoDescription ?? null,
      author: { connect: { id: authorId } },
      ...(input.categoryId ? { category: { connect: { id: input.categoryId } } } : {}),
    });

    if (input.tagIds?.length) {
      await blogRepository.syncTags(post.id, input.tagIds);
    }

    const refreshed = await blogRepository.findById(post.id);
    return mapBlogPostToDto(refreshed!);
  }

  async update(id: string, input: UpdateBlogPostInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await blogRepository.findById(id);
    if (!existing) throw new AppError('Blog post not found', HTTP_STATUS.NOT_FOUND);

    if (input.published === true && !existing.published) {
      this.assertPublishPermission(permissions);
    }

    if (input.slug && input.slug !== existing.slug) {
      if (await blogRepository.slugExists(input.slug, id)) {
        throw new AppError('Blog slug already exists', HTTP_STATUS.CONFLICT);
      }
    }

    await this.validateRelations(input.categoryId, input.tagIds);

    const content = input.content ?? existing.content;
    const readingTimeMinutes = calculateReadingTimeMinutes(content);

    let publishedAt = existing.publishedAt;
    if (input.published === true && !existing.published) {
      publishedAt = new Date();
    } else if (input.published === false) {
      publishedAt = null;
    }

    const post = await blogRepository.update(id, {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.excerpt !== undefined ? { excerpt: input.excerpt } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.contentFormat !== undefined ? { contentFormat: input.contentFormat } : {}),
      ...(input.featuredImage !== undefined ? { featuredImage: input.featuredImage } : {}),
      readingTimeMinutes,
      ...(input.published !== undefined ? { published: input.published } : {}),
      publishedAt,
      ...(input.seoTitle !== undefined ? { seoTitle: input.seoTitle } : {}),
      ...(input.seoDescription !== undefined ? { seoDescription: input.seoDescription } : {}),
      ...(input.categoryId !== undefined
        ? input.categoryId
          ? { category: { connect: { id: input.categoryId } } }
          : { category: { disconnect: true } }
        : {}),
    });

    if (input.tagIds !== undefined) {
      await blogRepository.syncTags(id, input.tagIds);
    }

    const refreshed = await blogRepository.findById(post.id);
    return mapBlogPostToDto(refreshed!);
  }

  async publish(id: string, input: PublishBlogPostInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    if (input.published) {
      this.assertPublishPermission(permissions);
    }

    const existing = await blogRepository.findById(id);
    if (!existing) throw new AppError('Blog post not found', HTTP_STATUS.NOT_FOUND);

    const post = await blogRepository.update(id, {
      published: input.published,
      publishedAt: input.published ? new Date() : null,
    });

    return mapBlogPostToDto(post);
  }

  async delete(id: string, permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.BLOG_DELETE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }

    const existing = await blogRepository.findById(id);
    if (!existing) throw new AppError('Blog post not found', HTTP_STATUS.NOT_FOUND);

    await blogRepository.delete(id);
    return { id };
  }

  private assertWritePermission(permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.BLOG_WRITE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }
  }

  private assertPublishPermission(permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.BLOG_PUBLISH])) {
      throw new AppError('Insufficient permissions to publish blog posts', HTTP_STATUS.FORBIDDEN);
    }
  }

  private async validateRelations(categoryId?: string | null, tagIds?: string[]) {
    if (categoryId) {
      const category = await blogCategoryRepository.findById(categoryId);
      if (!category) throw new AppError('Category not found', HTTP_STATUS.BAD_REQUEST);
    }

    if (tagIds?.length) {
      const tags = await tagRepository.findManyByIds(tagIds);
      if (tags.length !== tagIds.length) {
        throw new AppError('One or more tags were not found', HTTP_STATUS.BAD_REQUEST);
      }
    }
  }
}

export const blogService = new BlogService();
