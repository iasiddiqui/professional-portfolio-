import { PERMISSIONS, hasPermission } from '../../constants/permissions.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { resumeRepository } from '../../repositories/resume.repository.js';
import { AppError } from '../../utils/app-error.js';
import { mapResumeToDto } from './resume.dto.js';
import type {
  CreateResumeInput,
  ResumeListQueryInput,
  UpdateResumeInput,
} from './resume.validator.js';

export class ResumeService {
  async list(query: ResumeListQueryInput) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const { items, total } = await resumeRepository.findMany({
      page,
      limit,
      skip,
      search: query.search,
      isActive: query.isActive,
    });

    return { items: items.map(mapResumeToDto), total, page, limit };
  }

  async getById(id: string) {
    const resume = await resumeRepository.findById(id);
    if (!resume) throw new AppError('Resume not found', HTTP_STATUS.NOT_FOUND);
    return mapResumeToDto(resume);
  }

  async create(input: CreateResumeInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const resume = await resumeRepository.create({
      title: input.title,
      fileUrl: input.fileUrl,
      version: input.version,
      isActive: input.isActive,
    });

    if (input.isActive) {
      const activated = await resumeRepository.activate(resume.id);
      return mapResumeToDto(activated);
    }

    return mapResumeToDto(resume);
  }

  async update(id: string, input: UpdateResumeInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await resumeRepository.findById(id);
    if (!existing) throw new AppError('Resume not found', HTTP_STATUS.NOT_FOUND);

    const resume = await resumeRepository.update(id, {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.fileUrl !== undefined ? { fileUrl: input.fileUrl } : {}),
      ...(input.version !== undefined ? { version: input.version } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    });

    if (input.isActive === true) {
      const activated = await resumeRepository.activate(id);
      return mapResumeToDto(activated);
    }

    return mapResumeToDto(resume);
  }

  async activate(id: string, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await resumeRepository.findById(id);
    if (!existing) throw new AppError('Resume not found', HTTP_STATUS.NOT_FOUND);

    const resume = await resumeRepository.activate(id);
    return mapResumeToDto(resume);
  }

  async delete(id: string, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await resumeRepository.findById(id);
    if (!existing) throw new AppError('Resume not found', HTTP_STATUS.NOT_FOUND);

    await resumeRepository.delete(id);
    return { id };
  }

  private assertWritePermission(permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.RESUME_WRITE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }
  }
}

export const resumeService = new ResumeService();
