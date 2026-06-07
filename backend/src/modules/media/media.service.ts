import { PERMISSIONS } from '../../constants/permissions.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { mediaRepository } from '../../repositories/media.repository.js';
import { projectRepository } from '../../repositories/project.repository.js';
import { AppError } from '../../utils/app-error.js';
import {
  deleteStoredFile,
  inferMediaTypeFromMime,
  storeUploadedFile,
  type UploadedFilePayload,
} from '../../utils/storage.js';
import { mapMediaToDto } from '../projects/projects.dto.js';
import type { UploadMediaQueryInput } from './media.validator.js';

export class MediaService {
  async upload(file: UploadedFilePayload, query: UploadMediaQueryInput) {
    if (query.projectId) {
      const project = await projectRepository.findById(query.projectId);

      if (!project) {
        throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
      }
    }

    const stored = await storeUploadedFile(file, 'media');
    const mediaType = inferMediaTypeFromMime(file.mimetype);

    const media = await mediaRepository.create({
      filename: stored.filename,
      url: stored.url,
      mimeType: file.mimetype,
      size: stored.size,
      type: mediaType,
      alt: query.alt ?? file.originalname,
      isThumbnail: query.isThumbnail ?? false,
      ...(query.projectId ? { project: { connect: { id: query.projectId } } } : {}),
    });

    return mapMediaToDto(media);
  }

  async delete(id: string) {
    const media = await mediaRepository.findById(id);

    if (!media) {
      throw new AppError('Media not found', HTTP_STATUS.NOT_FOUND);
    }

    await deleteStoredFile(media.url, media.filename, media.mimeType);
    await mediaRepository.delete(id);

    return { id };
  }
}

export const mediaService = new MediaService();

export const mediaWritePermissions = [
  PERMISSIONS.MEDIA_WRITE,
  PERMISSIONS.PROJECTS_WRITE,
  PERMISSIONS.BLOG_WRITE,
] as const;
