export { RESUME_MODULE_CONFIG } from './config/resume.config';
export {
  useActivateResume,
  useCreateResume,
  useDeleteResume,
  useSetResumeActive,
  useUpdateResume,
} from './hooks/use-resume-mutations';
export { useResumes, useResume } from './hooks/use-resumes';
export { resumeService } from './services/resume.service';
export { ResumeModuleView } from './components/resume-module-view';
export {
  createResumeFormDefaultValues,
  generateResumeVersion,
  resumeFormDefaultValues,
  resumeFormSchema,
  toResumeFormValues,
  toResumePayload,
  type ResumeFormValues,
} from './schemas/resume.schemas';
export type {
  CreateResumePayload,
  Resume,
  ResumeListParams,
  ResumeListResult,
  UpdateResumePayload,
} from './types/resume.types';
