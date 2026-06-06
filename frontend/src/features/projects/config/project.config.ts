import type { ProjectStatus } from '@/features/projects/types/project.types';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

export const PROJECT_STATUS_OPTIONS = Object.entries(PROJECT_STATUS_LABELS).map(
  ([value, label]) => ({ value: value as ProjectStatus, label })
);

export const PROJECT_MODULE_CONFIG = {
  id: 'projects',
  title: 'Projects',
  description: 'Manage portfolio projects, tech stack, and publication status.',
  defaultPageSize: 10,
} as const;
