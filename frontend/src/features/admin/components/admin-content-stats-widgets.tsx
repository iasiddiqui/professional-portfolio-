'use client';

import { FileText, FolderKanban } from 'lucide-react';
import Link from 'next/link';

import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlogPosts } from '@/features/blog/hooks/use-blog';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { ROUTES } from '@/constants/routes';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { cn } from '@/lib/utils';

interface AdminContentStatsWidgetsProps {
  className?: string;
}

export function AdminContentStatsWidgets({ className }: AdminContentStatsWidgetsProps) {
  const { hasPermission } = useAuth();
  const canViewProjects = hasPermission(MODULE_PERMISSIONS.projects.read);
  const canViewBlog = hasPermission(MODULE_PERMISSIONS.blog.read);

  const projectsQuery = useProjects({ page: 1, limit: 1 }, canViewProjects);
  const blogQuery = useBlogPosts({ page: 1, limit: 1 }, canViewBlog);

  if (!canViewProjects && !canViewBlog) {
    return null;
  }

  const isLoading =
    (canViewProjects && projectsQuery.isLoading) || (canViewBlog && blogQuery.isLoading);
  const isError =
    (canViewProjects && projectsQuery.isError) || (canViewBlog && blogQuery.isError);

  if (isLoading) {
    return <Loader label="Loading content stats..." className={className} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load content stats"
        className={className}
        onRetry={() => {
          if (canViewProjects) void projectsQuery.refetch();
          if (canViewBlog) void blogQuery.refetch();
        }}
      />
    );
  }

  const widgets = [
    canViewProjects
      ? {
          key: 'projects',
          label: 'Total Projects',
          value: projectsQuery.data?.pagination.total ?? 0,
          href: ROUTES.admin.projects,
          icon: FolderKanban,
        }
      : null,
    canViewBlog
      ? {
          key: 'blog',
          label: 'Total Blog Posts',
          value: blogQuery.data?.pagination.total ?? 0,
          href: ROUTES.admin.blog,
          icon: FileText,
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    value: number;
    href: string;
    icon: typeof FolderKanban;
  }>;

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
      {widgets.map((widget) => {
        const Icon = widget.icon;

        return (
          <Link key={widget.key} href={widget.href}>
            <Card className="transition-colors hover:border-accent/50 hover:bg-muted/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {widget.label}
                </CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight">{widget.value}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
