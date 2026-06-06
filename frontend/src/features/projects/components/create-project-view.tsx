'use client';

import { useRouter } from 'next/navigation';

import { ProjectModuleShell } from '@/features/admin/components/module-shells';
import { ProjectForm } from '@/features/projects/components/project-form';
import { useCreateProject } from '@/features/projects/hooks/use-project-mutations';
import {
  projectFormDefaultValues,
  projectFormSchema,
  toProjectPayload,
  type ProjectFormValues,
} from '@/features/projects/schemas/project.schemas';
import { ROUTES } from '@/constants/routes';
import { useZodForm } from '@/hooks/use-zod-form';

export function CreateProjectView() {
  const router = useRouter();
  const createMutation = useCreateProject();
  const form = useZodForm(projectFormSchema, projectFormDefaultValues);

  const handleSubmit = async (values: ProjectFormValues) => {
    const project = await createMutation.mutateAsync(toProjectPayload(values));
    router.push(ROUTES.admin.project(project.id));
  };

  return (
    <ProjectModuleShell
      title="Create project"
      description="Add a new portfolio project with details, media, and publishing settings."
      breadcrumbs={[
        { label: 'Dashboard', href: ROUTES.admin.dashboard },
        { label: 'Projects', href: ROUTES.admin.projects },
        { label: 'Create' },
      ]}
    >
      <ProjectForm
        form={form}
        onSubmit={handleSubmit}
        submitLabel="Create project"
        isSubmitting={createMutation.isPending}
      />
    </ProjectModuleShell>
  );
}
