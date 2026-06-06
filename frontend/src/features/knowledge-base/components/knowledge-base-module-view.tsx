'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { KnowledgeBaseModuleShell } from '@/features/admin/components/module-shells';
import {
  DeleteKnowledgeBaseDialog,
  useDeleteKnowledgeBaseDialog,
} from '@/features/knowledge-base/components/delete-knowledge-base-dialog';
import {
  KnowledgeBaseFilters,
  type KnowledgeBaseFiltersState,
} from '@/features/knowledge-base/components/knowledge-base-filters';
import { KnowledgeBaseFormDialog } from '@/features/knowledge-base/components/knowledge-base-form-dialog';
import { KnowledgeBaseTable } from '@/features/knowledge-base/components/knowledge-base-table';
import { KNOWLEDGE_BASE_MODULE_CONFIG } from '@/features/knowledge-base/config/knowledge-base.config';
import {
  useKnowledgeBaseCategories,
  useKnowledgeBaseEntries,
} from '@/features/knowledge-base/hooks/use-knowledge-base';
import type { KnowledgeBaseEntry } from '@/features/knowledge-base/types/knowledge-base.types';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { useAuth } from '@/features/auth/providers/auth-provider';

export function KnowledgeBaseModuleView() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.knowledgeBase.write);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<KnowledgeBaseFiltersState>({
    search: '',
    category: 'ALL',
    active: 'ALL',
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<KnowledgeBaseEntry | null>(null);
  const deleteDialog = useDeleteKnowledgeBaseDialog();

  const { data: categories = [] } = useKnowledgeBaseCategories();

  const queryParams = useMemo(
    () => ({
      page,
      limit: KNOWLEDGE_BASE_MODULE_CONFIG.defaultPageSize,
      search: filters.search.trim() || undefined,
      category: filters.category === 'ALL' ? undefined : filters.category,
      active: filters.active === 'ALL' ? undefined : filters.active === 'true',
    }),
    [filters, page]
  );

  const { data, isLoading, isError, refetch } = useKnowledgeBaseEntries(queryParams);

  const handleFiltersChange = (next: KnowledgeBaseFiltersState) => {
    setFilters(next);
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (entry: KnowledgeBaseEntry) => {
    setEditing(entry);
    setFormOpen(true);
  };

  return (
    <KnowledgeBaseModuleShell
      actions={
        canWrite ? (
          <Button variant="accent" size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New entry
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <KnowledgeBaseFilters filters={filters} onChange={handleFiltersChange} categories={categories} />

        {isLoading ? <Loader label="Loading knowledge base..." /> : null}
        {isError ? (
          <ErrorState
            title="Failed to load knowledge base"
            message="Please try again."
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError && data?.items.length === 0 ? (
          <EmptyState
            title="No knowledge base entries yet"
            description="Add entries to improve Ask Ishan responses."
            actionLabel={canWrite ? 'Add entry' : undefined}
            onAction={canWrite ? openCreate : undefined}
          />
        ) : null}

        {!isLoading && !isError && data && data.items.length > 0 ? (
          <>
            <KnowledgeBaseTable
              entries={data.items}
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

      <KnowledgeBaseFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        entry={editing}
        categories={categories}
      />

      <DeleteKnowledgeBaseDialog
        entry={deleteDialog.entry}
        open={deleteDialog.open}
        onOpenChange={deleteDialog.setOpen}
      />
    </KnowledgeBaseModuleShell>
  );
}
