import type { ResumeRecord } from '../../repositories/resume.repository.js';
import { resolveResumeFileName } from '../../utils/file-url.js';

export interface ResumeDto {
  id: string;
  title: string;
  fileUrl: string;
  fileName: string;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function mapResumeToDto(resume: ResumeRecord): ResumeDto {
  return {
    id: resume.id,
    title: resume.title,
    fileUrl: resume.fileUrl,
    fileName: resolveResumeFileName(resume.fileName, resume.fileUrl),
    version: resume.version,
    isActive: resume.isActive,
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
  };
}
