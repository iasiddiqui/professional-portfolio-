'use client';

import { Eye, EyeOff, MoreHorizontal, Pencil, Star, StarOff, Trash2 } from 'lucide-react';
import { MediaImage } from '@/components/media/media-image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProjectStatusBadge } from '@/features/projects/components/project-status-badge';
import type { Project, ProjectStatus } from '@/features/projects/types/project.types';
import { ROUTES } from '@/constants/routes';
import { resolveMediaUrl } from '@/lib/media-url';
import { cn } from '@/lib/utils';
import { truncate } from '@/utils/string';
import { formatDate } from '@/utils/date';

interface ProjectsTableProps {
  projects: Project[];
  canWrite?: boolean;
  canDelete?: boolean;
  canPublish?: boolean;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onDelete?: (project: Project) => void;
  onStatusChange?: (project: Project, status: ProjectStatus) => void;
  onFeaturedChange?: (project: Project, featured: boolean) => void;
  isStatusUpdating?: boolean;
  isFeaturedUpdating?: boolean;
}

export function ProjectsTable({
  projects,
  canWrite,
  canDelete,
  canPublish,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  onDelete,
  onStatusChange,
  onFeaturedChange,
  isStatusUpdating = false,
  isFeaturedUpdating = false,
}: ProjectsTableProps) {
  const allSelected = projects.length > 0 && projects.every((project) => selectedIds.includes(project.id));
  const someSelected = projects.some((project) => selectedIds.includes(project.id));

  const toggleAll = () => {
    if (!onSelectionChange) return;

    if (allSelected) {
      const pageIds = new Set(projects.map((project) => project.id));
      onSelectionChange(selectedIds.filter((id) => !pageIds.has(id)));
      return;
    }

    const merged = new Set([...selectedIds, ...projects.map((project) => project.id)]);
    onSelectionChange([...merged]);
  };

  const toggleOne = (projectId: string) => {
    if (!onSelectionChange) return;

    if (selectedIds.includes(projectId)) {
      onSelectionChange(selectedIds.filter((id) => id !== projectId));
    } else {
      onSelectionChange([...selectedIds, projectId]);
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  role="checkbox"
                  aria-label="Select all projects on this page"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-input accent-accent"
                />
              </TableHead>
            ) : null}
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tech stack</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[70px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const isSelected = selectedIds.includes(project.id);
            const isPublished = project.status === 'PUBLISHED';

            return (
              <TableRow key={project.id} className={cn(isSelected && 'bg-muted/30')}>
                {selectable ? (
                  <TableCell>
                    <input
                      type="checkbox"
                      role="checkbox"
                      aria-label={`Select ${project.title}`}
                      checked={isSelected}
                      onChange={() => toggleOne(project.id)}
                      className="h-4 w-4 rounded border-input accent-accent"
                    />
                  </TableCell>
                ) : null}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                      {project.thumbnail ? (
                        <MediaImage
                          src={resolveMediaUrl(project.thumbnail.url)!}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={ROUTES.admin.project(project.id)}
                          className="font-medium hover:text-accent"
                        >
                          {project.title}
                        </Link>
                        {project.featured ? (
                          <Badge variant="accent" className="gap-1">
                            <Star className="h-3 w-3" />
                            Featured
                          </Badge>
                        ) : null}
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {truncate(project.shortDescription, 80)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <ProjectStatusBadge status={project.status} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 3 ? (
                      <Badge variant="outline">+{project.techStack.length - 3}</Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(project.updatedAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${project.title}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.admin.project(project.id)}>View details</Link>
                      </DropdownMenuItem>
                      {canWrite ? (
                        <DropdownMenuItem asChild>
                          <Link href={ROUTES.admin.projectEdit(project.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      ) : null}
                      {canPublish ? (
                        <DropdownMenuItem
                          disabled={isStatusUpdating}
                          onClick={() =>
                            onStatusChange?.(project, isPublished ? 'DRAFT' : 'PUBLISHED')
                          }
                        >
                          {isPublished ? (
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
                        </DropdownMenuItem>
                      ) : null}
                      {canWrite ? (
                        <DropdownMenuItem
                          disabled={isFeaturedUpdating}
                          onClick={() => onFeaturedChange?.(project, !project.featured)}
                        >
                          {project.featured ? (
                            <>
                              <StarOff className="mr-2 h-4 w-4" />
                              Unfeature
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Feature
                            </>
                          )}
                        </DropdownMenuItem>
                      ) : null}
                      {canDelete ? (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete?.(project)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
