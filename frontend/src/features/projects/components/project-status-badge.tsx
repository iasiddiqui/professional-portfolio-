import type { ProjectStatus } from '@/features/projects/types/project.types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<ProjectStatus, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  PUBLISHED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  ARCHIVED: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
};

const statusLabels: Record<ProjectStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('border-transparent', statusStyles[status], className)}>
      {statusLabels[status]}
    </Badge>
  );
}
