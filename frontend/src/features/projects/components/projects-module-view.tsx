'use client';

import { Eye, EyeOff, Plus, Search, Star, StarOff, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProjectModuleShell } from '@/features/admin/components/module-shells';
import { BulkDeleteProjectsDialog } from '@/features/projects/components/bulk-delete-projects-dialog';
import {
  DeleteProjectDialog,
  useDeleteProjectDialog,
} from '@/features/projects/components/delete-project-dialog';
import { ProjectsTable } from '@/features/projects/components/projects-table';
import { PROJECT_MODULE_CONFIG, PROJECT_STATUS_OPTIONS } from '@/features/projects/config/project.config';
import {
  useBulkUpdateProjectFeatured,
  useBulkUpdateProjectStatus,
  useUpdateProjectFeaturedMutation,
  useUpdateProjectStatusMutation,
} from '@/features/projects/hooks/use-project-mutations';
import { useProjects } from '@/features/projects/hooks/use-projects';
import type { Project, ProjectStatus } from '@/features/projects/types/project.types';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/providers/auth-provider';

export function ProjectsModuleView() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.projects.write);
  const canDelete = hasPermission(MODULE_PERMISSIONS.projects.delete);
  const canPublish = hasPermission(MODULE_PERMISSIONS.projects.publish);
  const canBulkSelect = canWrite || canPublish || canDelete;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProjectStatus | 'ALL'>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const deleteDialog = useDeleteProjectDialog();
  const statusMutation = useUpdateProjectStatusMutation();
  const bulkStatusMutation = useBulkUpdateProjectStatus();
  const featuredMutation = useUpdateProjectFeaturedMutation();
  const bulkFeaturedMutation = useBulkUpdateProjectFeatured();

  const queryParams = useMemo(
    () => ({
      page,
      limit: PROJECT_MODULE_CONFIG.defaultPageSize,
      search: search.trim() || undefined,
      status: status === 'ALL' ? undefined : status,
    }),
    [page, search, status]
  );

  const { data, isLoading, isError, refetch } = useProjects(queryParams);

  const selectedProjects = useMemo(() => {
    if (!data?.items.length || selectedIds.length === 0) return [];
    const idSet = new Set(selectedIds);
    return data.items.filter((project) => idSet.has(project.id));
  }, [data?.items, selectedIds]);

  const showBulkPublish = selectedProjects.some((project) => project.status !== 'PUBLISHED');
  const showBulkUnpublish = selectedProjects.some((project) => project.status === 'PUBLISHED');
  const showBulkFeature = selectedProjects.some((project) => !project.featured);
  const showBulkUnfeature = selectedProjects.some((project) => project.featured);

  useEffect(() => {
    setSelectedIds([]);
  }, [page, search, status]);

  const isBulkBusy =
    statusMutation.isPending ||
    bulkStatusMutation.isPending ||
    featuredMutation.isPending ||
    bulkFeaturedMutation.isPending;

  const handleStatusChange = (project: Project, nextStatus: ProjectStatus) => {
    statusMutation.mutate({ id: project.id, status: nextStatus });
  };

  const handleFeaturedChange = (project: Project, featured: boolean) => {
    featuredMutation.mutate({ id: project.id, featured });
  };

  const handleBulkStatusChange = (nextStatus: ProjectStatus) => {
    if (selectedIds.length === 0) return;
    bulkStatusMutation.mutate(
      { ids: selectedIds, status: nextStatus },
      { onSuccess: () => setSelectedIds([]) }
    );
  };

  const handleBulkFeaturedChange = (featured: boolean) => {
    if (selectedIds.length === 0) return;
    bulkFeaturedMutation.mutate(
      { ids: selectedIds, featured },
      { onSuccess: () => setSelectedIds([]) }
    );
  };

  return (
    <ProjectModuleShell
      actions={
        canWrite ? (
          <Button variant="accent" size="sm" asChild>
            <Link href={ROUTES.admin.projectNew}>
              <Plus className="mr-2 h-4 w-4" />
              New project
            </Link>
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search projects..."
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as ProjectStatus | 'ALL');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {PROJECT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <Loader label="Loading projects..." /> : null}

        {isError ? (
          <ErrorState title="Failed to load projects" message="Please try again." onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && data?.items.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create your first portfolio project to get started."
            actionLabel={canWrite ? 'Create project' : undefined}
            onAction={canWrite ? () => (window.location.href = ROUTES.admin.projectNew) : undefined}
          />
        ) : null}

        {!isLoading && !isError && data && data.items.length > 0 ? (
          <>
            {selectedIds.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
                <span className="text-sm font-medium">{selectedIds.length} selected</span>
                {canPublish && showBulkPublish ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBulkBusy}
                    onClick={() => handleBulkStatusChange('PUBLISHED')}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                ) : null}
                {canPublish && showBulkUnpublish ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBulkBusy}
                    onClick={() => handleBulkStatusChange('DRAFT')}
                  >
                    <EyeOff className="mr-2 h-4 w-4" />
                    Unpublish
                  </Button>
                ) : null}
                {canWrite && showBulkFeature ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBulkBusy}
                    onClick={() => handleBulkFeaturedChange(true)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Feature
                  </Button>
                ) : null}
                {canWrite && showBulkUnfeature ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBulkBusy}
                    onClick={() => handleBulkFeaturedChange(false)}
                  >
                    <StarOff className="mr-2 h-4 w-4" />
                    Unfeature
                  </Button>
                ) : null}
                {canDelete ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isBulkBusy}
                    onClick={() => setBulkDeleteOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                ) : null}
                <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
                  Clear
                </Button>
              </div>
            ) : null}

            <ProjectsTable
              projects={data.items}
              canWrite={canWrite}
              canDelete={canDelete}
              canPublish={canPublish}
              selectable={canBulkSelect}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onDelete={deleteDialog.openDialog}
              onStatusChange={handleStatusChange}
              onFeaturedChange={handleFeaturedChange}
              isStatusUpdating={statusMutation.isPending}
              isFeaturedUpdating={featuredMutation.isPending}
            />
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </div>

      <DeleteProjectDialog
        project={deleteDialog.project}
        open={deleteDialog.open}
        onOpenChange={deleteDialog.setOpen}
      />

      <BulkDeleteProjectsDialog
        projectIds={selectedIds}
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onDeleted={() => setSelectedIds([])}
      />
    </ProjectModuleShell>
  );
}
