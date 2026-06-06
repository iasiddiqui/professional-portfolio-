'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { ProjectModuleShell } from '@/features/admin/components/module-shells';
import { ProjectForm } from '@/features/projects/components/project-form';
import { useUpdateProject } from '@/features/projects/hooks/use-project-mutations';
import { useProject } from '@/features/projects/hooks/use-projects';
import {
  projectFormSchema,
  toProjectFormValues,
  toProjectPayload,
  type ProjectFormValues,
} from '@/features/projects/schemas/project.schemas';
import { ROUTES } from '@/constants/routes';
import { useZodForm } from '@/hooks/use-zod-form';

interface EditProjectViewProps {
  projectId: string;
}

export function EditProjectView({ projectId }: EditProjectViewProps) {
  const router = useRouter();
  const { data: project, isLoading, isError, refetch } = useProject(projectId);
  const updateMutation = useUpdateProject(projectId);
  const form = useZodForm(projectFormSchema);

  useEffect(() => {
    if (project) {
      form.reset(toProjectFormValues(project));
    }
  }, [form, project]);

  const handleSubmit = async (values: ProjectFormValues) => {
    await updateMutation.mutateAsync(toProjectPayload(values));
    router.push(ROUTES.admin.project(projectId));
  };

  if (isLoading) {
    return (
      <ProjectModuleShell title="Edit project" breadcrumbs={[{ label: 'Projects', href: ROUTES.admin.projects }, { label: 'Edit' }]}>
        <Loader label="Loading project..." />
      </ProjectModuleShell>
    );
  }

  if (isError || !project) {
    return (
      <ProjectModuleShell title="Edit project" breadcrumbs={[{ label: 'Projects', href: ROUTES.admin.projects }, { label: 'Edit' }]}>
        <ErrorState title="Project not found" message="Unable to load this project." onRetry={() => void refetch()} />
      </ProjectModuleShell>
    );
  }

  return (
    <ProjectModuleShell
      title={`Edit ${project.title}`}
      description="Update project details, media, and publishing settings."
      breadcrumbs={[
        { label: 'Dashboard', href: ROUTES.admin.dashboard },
        { label: 'Projects', href: ROUTES.admin.projects },
        { label: project.title, href: ROUTES.admin.project(project.id) },
        { label: 'Edit' },
      ]}
    >
      <ProjectForm
        form={form}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        isSubmitting={updateMutation.isPending}
        initialThumbnail={project.thumbnail}
        initialGallery={project.gallery}
      />
    </ProjectModuleShell>
  );
}
