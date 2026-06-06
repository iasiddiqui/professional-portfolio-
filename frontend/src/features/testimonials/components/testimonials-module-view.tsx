'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { TestimonialModuleShell } from '@/features/admin/components/module-shells';
import {
  DeleteTestimonialDialog,
  useDeleteTestimonialDialog,
} from '@/features/testimonials/components/delete-testimonial-dialog';
import { TestimonialFilters, type TestimonialFiltersState } from '@/features/testimonials/components/testimonial-filters';
import { TestimonialFormDialog } from '@/features/testimonials/components/testimonial-form-dialog';
import { TestimonialsTable } from '@/features/testimonials/components/testimonials-table';
import { TESTIMONIAL_MODULE_CONFIG } from '@/features/testimonials/config/testimonial.config';
import { useTestimonials } from '@/features/testimonials/hooks/use-testimonials';
import type { Testimonial } from '@/features/testimonials/types/testimonial.types';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { useAuth } from '@/features/auth/providers/auth-provider';

export function TestimonialsModuleView() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.testimonials.write);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TestimonialFiltersState>({
    search: '',
    featured: 'ALL',
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const deleteDialog = useDeleteTestimonialDialog();

  const queryParams = useMemo(
    () => ({
      page,
      limit: TESTIMONIAL_MODULE_CONFIG.defaultPageSize,
      search: filters.search.trim() || undefined,
      featured: filters.featured === 'ALL' ? undefined : filters.featured === 'true',
    }),
    [filters, page]
  );

  const { data, isLoading, isError, refetch } = useTestimonials(queryParams);

  const handleFiltersChange = (next: TestimonialFiltersState) => {
    setFilters(next);
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (testimonial: Testimonial) => {
    setEditing(testimonial);
    setFormOpen(true);
  };

  return (
    <TestimonialModuleShell
      actions={
        canWrite ? (
          <Button variant="accent" size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New testimonial
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <TestimonialFilters filters={filters} onChange={handleFiltersChange} />

        {isLoading ? <Loader label="Loading testimonials..." /> : null}
        {isError ? (
          <ErrorState
            title="Failed to load testimonials"
            message="Please try again."
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError && data?.items.length === 0 ? (
          <EmptyState
            title="No testimonials yet"
            description="Add client testimonials to showcase on your portfolio."
            actionLabel={canWrite ? 'Add testimonial' : undefined}
            onAction={canWrite ? openCreate : undefined}
          />
        ) : null}

        {!isLoading && !isError && data && data.items.length > 0 ? (
          <>
            <TestimonialsTable
              testimonials={data.items}
              canWrite={canWrite}
              onEdit={openEdit}
              onDelete={deleteDialog.openDialog}
            />
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </div>

      <TestimonialFormDialog open={formOpen} onOpenChange={setFormOpen} testimonial={editing} />

      <DeleteTestimonialDialog
        testimonial={deleteDialog.testimonial}
        open={deleteDialog.open}
        onOpenChange={deleteDialog.setOpen}
      />
    </TestimonialModuleShell>
  );
}
