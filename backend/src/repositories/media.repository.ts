import type { Media, MediaType, Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export type MediaRecord = Media;

export class MediaRepository {
  async create(data: Prisma.MediaCreateInput): Promise<MediaRecord> {
    return prisma.media.create({ data });
  }

  async findById(id: string): Promise<MediaRecord | null> {
    return prisma.media.findUnique({ where: { id } });
  }

  async findManyByIds(ids: string[]): Promise<MediaRecord[]> {
    if (ids.length === 0) return [];

    return prisma.media.findMany({ where: { id: { in: ids } } });
  }

  async findByProjectId(projectId: string): Promise<MediaRecord[]> {
    return prisma.media.findMany({
      where: { projectId },
      orderBy: [{ isThumbnail: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async attachToProject(
    mediaIds: string[],
    projectId: string,
    options?: { thumbnailId?: string | null }
  ): Promise<void> {
    if (mediaIds.length === 0) return;

    await prisma.$transaction(
      mediaIds.map((id, index) =>
        prisma.media.update({
          where: { id },
          data: {
            projectId,
            isThumbnail: options?.thumbnailId ? id === options.thumbnailId : index === 0,
            sortOrder: index,
            type: 'IMAGE' satisfies MediaType,
          },
        })
      )
    );
  }

  async syncProjectMedia(
    projectId: string,
    input: {
      thumbnailMediaId?: string | null;
      galleryMediaIds?: string[];
      removeMediaIds?: string[];
    }
  ): Promise<void> {
    const { thumbnailMediaId, galleryMediaIds = [], removeMediaIds = [] } = input;

    if (removeMediaIds.length > 0) {
      await prisma.media.updateMany({
        where: { id: { in: removeMediaIds }, projectId },
        data: { projectId: null, isThumbnail: false, sortOrder: 0 },
      });
    }

    const orderedIds = [
      ...(thumbnailMediaId ? [thumbnailMediaId] : []),
      ...galleryMediaIds.filter((id) => id !== thumbnailMediaId),
    ];

    if (orderedIds.length === 0) {
      if (thumbnailMediaId === null) {
        await prisma.media.updateMany({
          where: { projectId, isThumbnail: true },
          data: { isThumbnail: false },
        });
      }
      return;
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.media.update({
          where: { id },
          data: {
            projectId,
            isThumbnail: thumbnailMediaId ? id === thumbnailMediaId : index === 0,
            sortOrder: index,
          },
        })
      )
    );
  }

  async delete(id: string): Promise<MediaRecord> {
    return prisma.media.delete({ where: { id } });
  }

  async deleteMany(ids: string[]): Promise<MediaRecord[]> {
    if (ids.length === 0) return [];

    return prisma.$transaction(ids.map((id) => prisma.media.delete({ where: { id } })));
  }
}

export const mediaRepository = new MediaRepository();
