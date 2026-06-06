import type { ResumeRecord } from '../../repositories/resume.repository.js';

export interface ResumeDto {
  id: string;
  title: string;
  fileUrl: string;
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
    version: resume.version,
    isActive: resume.isActive,
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
  };
}
