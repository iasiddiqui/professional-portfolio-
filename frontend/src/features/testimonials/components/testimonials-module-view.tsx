'use client';

import { Plus, Star, StarOff, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { TestimonialModuleShell } from '@/features/admin/components/module-shells';
import { BulkDeleteTestimonialsDialog } from '@/features/testimonials/components/bulk-delete-testimonials-dialog';
import {
  DeleteTestimonialDialog,
  useDeleteTestimonialDialog,
} from '@/features/testimonials/components/delete-testimonial-dialog';
import { TestimonialFilters, type TestimonialFiltersState } from '@/features/testimonials/components/testimonial-filters';
import { TestimonialFormDialog } from '@/features/testimonials/components/testimonial-form-dialog';
import { TestimonialsTable } from '@/features/testimonials/components/testimonials-table';
import { TESTIMONIAL_MODULE_CONFIG } from '@/features/testimonials/config/testimonial.config';
import {
  useBulkUpdateTestimonialFeatured,
  useUpdateTestimonialFeaturedMutation,
} from '@/features/testimonials/hooks/use-testimonial-mutations';
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const deleteDialog = useDeleteTestimonialDialog();
  const featuredMutation = useUpdateTestimonialFeaturedMutation();
  const bulkFeaturedMutation = useBulkUpdateTestimonialFeatured();

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

  const selectedTestimonials = useMemo(() => {
    if (!data?.items.length || selectedIds.length === 0) return [];
    const idSet = new Set(selectedIds);
    return data.items.filter((item) => idSet.has(item.id));
  }, [data?.items, selectedIds]);

  const showBulkFeature = selectedTestimonials.some((item) => !item.featured);
  const showBulkUnfeature = selectedTestimonials.some((item) => item.featured);

  useEffect(() => {
    setSelectedIds([]);
  }, [page, filters]);

  const isBulkBusy = featuredMutation.isPending || bulkFeaturedMutation.isPending;

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

  const handleFeaturedChange = (testimonial: Testimonial, featured: boolean) => {
    featuredMutation.mutate({ id: testimonial.id, featured });
  };

  const handleBulkFeaturedChange = (featured: boolean) => {
    if (selectedIds.length === 0) return;
    bulkFeaturedMutation.mutate(
      { ids: selectedIds, featured },
      { onSuccess: () => setSelectedIds([]) }
    );
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
            {selectedIds.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
                <span className="text-sm font-medium">{selectedIds.length} selected</span>
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
                {canWrite ? (
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

            <TestimonialsTable
              testimonials={data.items}
              canWrite={canWrite}
              selectable={canWrite}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onEdit={openEdit}
              onDelete={deleteDialog.openDialog}
              onFeaturedChange={handleFeaturedChange}
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

      <TestimonialFormDialog open={formOpen} onOpenChange={setFormOpen} testimonial={editing} />

      <DeleteTestimonialDialog
        testimonial={deleteDialog.testimonial}
        open={deleteDialog.open}
        onOpenChange={deleteDialog.setOpen}
      />

      <BulkDeleteTestimonialsDialog
        testimonialIds={selectedIds}
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onDeleted={() => setSelectedIds([])}
      />
    </TestimonialModuleShell>
  );
}
