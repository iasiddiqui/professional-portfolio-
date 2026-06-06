import { PERMISSIONS } from '../../constants/permissions.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { mediaRepository } from '../../repositories/media.repository.js';
import { projectRepository } from '../../repositories/project.repository.js';
import { AppError } from '../../utils/app-error.js';
import { deleteUploadFile, getPublicUploadUrl } from '../../utils/upload.js';
import { mapMediaToDto } from '../projects/projects.dto.js';
import type { UploadMediaQueryInput } from './media.validator.js';

export class MediaService {
  async upload(
    file: {
      filename: string;
      mimetype: string;
      size: number;
      originalname: string;
    },
    query: UploadMediaQueryInput
  ) {
    if (query.projectId) {
      const project = await projectRepository.findById(query.projectId);

      if (!project) {
        await deleteUploadFile(file.filename);
        throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
      }
    }

    const media = await mediaRepository.create({
      filename: file.filename,
      url: getPublicUploadUrl(file.filename),
      mimeType: file.mimetype,
      size: file.size,
      type: 'IMAGE',
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

    await deleteUploadFile(media.filename);
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
