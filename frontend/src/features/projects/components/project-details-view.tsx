'use client';

import { ExternalLink, Eye, EyeOff, Github, Pencil, Star, Trash2 } from 'lucide-react';
import { MediaImage } from '@/components/media/media-image';
import Link from 'next/link';

import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectModuleShell } from '@/features/admin/components/module-shells';
import {
  DeleteProjectDialog,
  useDeleteProjectDialog,
} from '@/features/projects/components/delete-project-dialog';
import { ProjectStatusBadge } from '@/features/projects/components/project-status-badge';
import { useProject } from '@/features/projects/hooks/use-projects';
import { useUpdateProjectStatusMutation } from '@/features/projects/hooks/use-project-mutations';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { resolveMediaUrl } from '@/lib/media-url';
import { formatDateTime } from '@/utils/date';
import { useRouter } from 'next/navigation';

interface ProjectDetailsViewProps {
  projectId: string;
}

export function ProjectDetailsView({ projectId }: ProjectDetailsViewProps) {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.projects.write);
  const canDelete = hasPermission(MODULE_PERMISSIONS.projects.delete);
  const canPublish = hasPermission(MODULE_PERMISSIONS.projects.publish);
  const deleteDialog = useDeleteProjectDialog();
  const statusMutation = useUpdateProjectStatusMutation();

  const { data: project, isLoading, isError, refetch } = useProject(projectId);

  if (isLoading) {
    return (
      <ProjectModuleShell title="Project details">
        <Loader label="Loading project..." />
      </ProjectModuleShell>
    );
  }

  if (isError || !project) {
    return (
      <ProjectModuleShell title="Project details">
        <ErrorState title="Project not found" message="Unable to load this project." onRetry={() => void refetch()} />
      </ProjectModuleShell>
    );
  }

  return (
    <ProjectModuleShell
      title={project.title}
      description={project.shortDescription}
      breadcrumbs={[
        { label: 'Dashboard', href: ROUTES.admin.dashboard },
        { label: 'Projects', href: ROUTES.admin.projects },
        { label: project.title },
      ]}
      actions={
        <div className="flex items-center gap-2">
          {canPublish ? (
            <Button
              variant="outline"
              size="sm"
              disabled={statusMutation.isPending}
              onClick={() =>
                statusMutation.mutate({
                  id: project.id,
                  status: project.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
                })
              }
            >
              {project.status === 'PUBLISHED' ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          ) : null}
          {canWrite ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.admin.projectEdit(project.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          ) : null}
          {canDelete ? (
            <Button variant="destructive" size="sm" onClick={() => deleteDialog.openDialog(project)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          ) : null}
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          {project.thumbnail ? (
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/9] w-full">
                <MediaImage
                  src={resolveMediaUrl(project.thumbnail.url)!}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 66vw"
                  priority
                />
              </div>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p className="whitespace-pre-wrap text-foreground">{project.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {project.architecture}
              </p>
            </CardContent>
          </Card>

          {project.gallery.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
                <CardDescription>{project.gallery.length} images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((image) => (
                    <div key={image.id} className="relative aspect-video overflow-hidden rounded-lg border">
                      <MediaImage
                        src={resolveMediaUrl(image.url)!}
                        alt={image.alt ?? project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Status</span>
                <ProjectStatusBadge status={project.status} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Featured</span>
                {project.featured ? (
                  <Badge variant="accent" className="gap-1">
                    <Star className="h-3 w-3" />
                    Yes
                  </Badge>
                ) : (
                  <span>No</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Slug</span>
                <code className="rounded bg-muted px-2 py-1 text-xs">{project.slug}</code>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Updated</span>
                <span>{formatDateTime(project.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tech stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {(project.githubUrl || project.liveUrl) && (
            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-accent hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    GitHub repository
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-accent hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live demo
                  </a>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <DeleteProjectDialog
        project={deleteDialog.project}
        open={deleteDialog.open}
        onOpenChange={deleteDialog.setOpen}
        onDeleted={() => router.push(ROUTES.admin.projects)}
      />
    </ProjectModuleShell>
  );
}
