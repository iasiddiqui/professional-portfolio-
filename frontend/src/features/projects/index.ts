export { PROJECT_MODULE_CONFIG, PROJECT_STATUS_LABELS, PROJECT_STATUS_OPTIONS } from './config/project.config';
export { useCreateProject, useDeleteProject, useUpdateProject, useUpdateProjectStatus } from './hooks/use-project-mutations';
export { useProject, useProjects } from './hooks/use-projects';
export { mediaService } from './services/media.service';
export { projectService } from './services/project.service';
export { CreateProjectView } from './components/create-project-view';
export { DeleteProjectDialog, useDeleteProjectDialog } from './components/delete-project-dialog';
export { EditProjectView } from './components/edit-project-view';
export { ProjectDetailsView } from './components/project-details-view';
export { ProjectForm } from './components/project-form';
export { ProjectStatusBadge } from './components/project-status-badge';
export { ProjectsModuleView } from './components/projects-module-view';
export { ProjectsTable } from './components/projects-table';
export {
  projectFormDefaultValues,
  projectFormSchema,
  toProjectFormValues,
  toProjectPayload,
  type ProjectFormValues,
} from './schemas/project.schemas';
export type {
  CreateProjectPayload,
  Project,
  ProjectListParams,
  ProjectListResult,
  ProjectMedia,
  ProjectStatus,
  UpdateProjectPayload,
} from './types/project.types';
