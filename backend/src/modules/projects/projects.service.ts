import { ProjectStatus } from '@prisma/client';

import { PERMISSIONS, hasPermission } from '../../constants/permissions.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { mediaRepository } from '../../repositories/media.repository.js';
import { projectRepository } from '../../repositories/project.repository.js';
import { AppError } from '../../utils/app-error.js';
import { deleteUploadFile, extractFilenameFromUrl } from '../../utils/upload.js';
import { generateUniqueSlug } from '../../utils/slug.js';
import { mapProjectToDto } from './projects.dto.js';
import type {
  CreateProjectInput,
  ProjectListQueryInput,
  UpdateProjectInput,
  UpdateProjectStatusInput,
} from './projects.validator.js';

export class ProjectsService {
  async list(query: ProjectListQueryInput) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const { items, total } = await projectRepository.findMany({
      page,
      limit,
      skip,
      status: query.status,
      featured: query.featured,
      search: query.search,
    });

    return {
      items: items.map(mapProjectToDto),
      total,
      page,
      limit,
    };
  }

  async getById(id: string) {
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
    }

    return mapProjectToDto(project);
  }

  async create(input: CreateProjectInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const slug = input.slug
      ? input.slug
      : await generateUniqueSlug(input.title, (value) => projectRepository.slugExists(value));

    if (input.slug && (await projectRepository.slugExists(input.slug))) {
      throw new AppError('Project slug already exists', HTTP_STATUS.CONFLICT);
    }

    if (input.status === ProjectStatus.PUBLISHED) {
      this.assertPublishPermission(permissions);
    }

    await this.validateMediaIds(input.thumbnailMediaId, input.galleryMediaIds);

    const project = await projectRepository.create({
      title: input.title,
      slug,
      shortDescription: input.shortDescription,
      description: input.description,
      techStack: input.techStack,
      architecture: input.architecture,
      githubUrl: input.githubUrl,
      liveUrl: input.liveUrl,
      featured: input.featured,
      status: input.status,
      ...(input.categoryId ? { category: { connect: { id: input.categoryId } } } : {}),
    });

    await mediaRepository.syncProjectMedia(project.id, {
      thumbnailMediaId: input.thumbnailMediaId,
      galleryMediaIds: input.galleryMediaIds,
    });

    const refreshed = await projectRepository.findById(project.id);
    return mapProjectToDto(refreshed!);
  }

  async update(id: string, input: UpdateProjectInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await projectRepository.findById(id);

    if (!existing) {
      throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
    }

    if (input.status === ProjectStatus.PUBLISHED && existing.status !== ProjectStatus.PUBLISHED) {
      this.assertPublishPermission(permissions);
    }

    if (input.slug && input.slug !== existing.slug) {
      if (await projectRepository.slugExists(input.slug, id)) {
        throw new AppError('Project slug already exists', HTTP_STATUS.CONFLICT);
      }
    }

    await this.validateMediaIds(input.thumbnailMediaId, input.galleryMediaIds);

    const project = await projectRepository.update(id, {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.shortDescription !== undefined ? { shortDescription: input.shortDescription } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.techStack !== undefined ? { techStack: input.techStack } : {}),
      ...(input.architecture !== undefined ? { architecture: input.architecture } : {}),
      ...(input.githubUrl !== undefined ? { githubUrl: input.githubUrl } : {}),
      ...(input.liveUrl !== undefined ? { liveUrl: input.liveUrl } : {}),
      ...(input.featured !== undefined ? { featured: input.featured } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.categoryId !== undefined
        ? input.categoryId
          ? { category: { connect: { id: input.categoryId } } }
          : { category: { disconnect: true } }
        : {}),
    });

    if (
      input.thumbnailMediaId !== undefined ||
      input.galleryMediaIds !== undefined ||
      input.removeMediaIds !== undefined
    ) {
      await mediaRepository.syncProjectMedia(id, {
        thumbnailMediaId: input.thumbnailMediaId,
        galleryMediaIds: input.galleryMediaIds,
        removeMediaIds: input.removeMediaIds,
      });
    }

    const refreshed = await projectRepository.findById(project.id);
    return mapProjectToDto(refreshed!);
  }

  async updateStatus(id: string, input: UpdateProjectStatusInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    if (input.status === ProjectStatus.PUBLISHED) {
      this.assertPublishPermission(permissions);
    }

    const existing = await projectRepository.findById(id);

    if (!existing) {
      throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
    }

    const project = await projectRepository.update(id, { status: input.status });
    return mapProjectToDto(project);
  }

  async delete(id: string, permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.PROJECTS_DELETE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }

    const existing = await projectRepository.findById(id);

    if (!existing) {
      throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
    }

    await projectRepository.delete(id);

    for (const media of existing.media) {
      const filename = extractFilenameFromUrl(media.url);
      if (filename) {
        await deleteUploadFile(filename);
      }
      await mediaRepository.delete(media.id).catch(() => undefined);
    }

    return { id };
  }

  private assertWritePermission(permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.PROJECTS_WRITE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }
  }

  private assertPublishPermission(permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.PROJECTS_PUBLISH])) {
      throw new AppError('Insufficient permissions to publish projects', HTTP_STATUS.FORBIDDEN);
    }
  }

  private async validateMediaIds(
    thumbnailMediaId?: string | null,
    galleryMediaIds?: string[]
  ): Promise<void> {
    const ids = [
      ...(thumbnailMediaId ? [thumbnailMediaId] : []),
      ...(galleryMediaIds ?? []),
    ];

    if (ids.length === 0) return;

    const uniqueIds = [...new Set(ids)];
    const mediaItems = await mediaRepository.findManyByIds(uniqueIds);

    if (mediaItems.length !== uniqueIds.length) {
      throw new AppError('One or more media files were not found', HTTP_STATUS.BAD_REQUEST);
    }
  }
}

export const projectsService = new ProjectsService();
