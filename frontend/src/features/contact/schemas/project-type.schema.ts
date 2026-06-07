import { z } from 'zod';

export const PROJECT_TYPE_OTHER_VALUE = 'Other';

export const projectTypeSchemaFields = {
  projectType: z.string().trim().max(100).optional(),
  projectTypeOther: z.string().trim().max(100, 'Project type is too long').optional(),
};

export function refineProjectTypeOther(
  data: { projectType?: string; projectTypeOther?: string },
  ctx: z.RefinementCtx
) {
  if (data.projectType === PROJECT_TYPE_OTHER_VALUE && !data.projectTypeOther?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify your project type',
      path: ['projectTypeOther'],
    });
  }
}

export function resolveProjectTypeForSubmit(
  projectType?: string,
  projectTypeOther?: string
): string | undefined {
  if (!projectType?.trim()) return undefined;

  if (projectType === PROJECT_TYPE_OTHER_VALUE) {
    const custom = projectTypeOther?.trim();
    return custom || undefined;
  }

  return projectType;
}
