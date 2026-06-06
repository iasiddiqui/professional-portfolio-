'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { ResumeModuleShell } from '@/features/admin/components/module-shells';
import {
  DeleteResumeDialog,
  useDeleteResumeDialog,
} from '@/features/resume/components/delete-resume-dialog';
import { ResumeFilters, type ResumeFiltersState } from '@/features/resume/components/resume-filters';
import { ResumeFormDialog } from '@/features/resume/components/resume-form-dialog';
import { ResumeTable } from '@/features/resume/components/resume-table';
import { RESUME_MODULE_CONFIG } from '@/features/resume/config/resume.config';
import { useActivateResume } from '@/features/resume/hooks/use-resume-mutations';
import { useResumes } from '@/features/resume/hooks/use-resumes';
import type { Resume } from '@/features/resume/types/resume.types';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { useAuth } from '@/features/auth/providers/auth-provider';

export function ResumeModuleView() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.resume.write);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ResumeFiltersState>({
    search: '',
    isActive: 'ALL',
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Resume | null>(null);
  const deleteDialog = useDeleteResumeDialog();
  const activateMutation = useActivateResume();

  const queryParams = useMemo(
    () => ({
      page,
      limit: RESUME_MODULE_CONFIG.defaultPageSize,
      search: filters.search.trim() || undefined,
      isActive: filters.isActive === 'ALL' ? undefined : filters.isActive === 'true',
    }),
    [filters, page]
  );

  const { data, isLoading, isError, refetch } = useResumes(queryParams);

  const handleFiltersChange = (next: ResumeFiltersState) => {
    setFilters(next);
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (resume: Resume) => {
    setEditing(resume);
    setFormOpen(true);
  };

  const handleActivate = (resume: Resume) => {
    void activateMutation.mutateAsync(resume.id);
  };

  return (
    <ResumeModuleShell
      actions={
        canWrite ? (
          <Button variant="accent" size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New resume
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <ResumeFilters filters={filters} onChange={handleFiltersChange} />

        {isLoading ? <Loader label="Loading resumes..." /> : null}
        {isError ? (
          <ErrorState title="Failed to load resumes" message="Please try again." onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && data?.items.length === 0 ? (
          <EmptyState
            title="No resume versions yet"
            description="Upload a resume file URL to make it available for download."
            actionLabel={canWrite ? 'Add resume' : undefined}
            onAction={canWrite ? openCreate : undefined}
          />
        ) : null}

        {!isLoading && !isError && data && data.items.length > 0 ? (
          <>
            <ResumeTable
              resumes={data.items}
              canWrite={canWrite}
              onEdit={openEdit}
              onDelete={deleteDialog.openDialog}
              onActivate={handleActivate}
            />
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </div>

      <ResumeFormDialog open={formOpen} onOpenChange={setFormOpen} resume={editing} />

      <DeleteResumeDialog
        resume={deleteDialog.resume}
        open={deleteDialog.open}
        onOpenChange={deleteDialog.setOpen}
      />
    </ResumeModuleShell>
  );
}
