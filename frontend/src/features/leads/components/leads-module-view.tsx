'use client';

import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Pagination } from '@/components/ui/pagination';
import { LeadModuleShell } from '@/features/admin/components/module-shells';
import {
  DeleteLeadDialog,
  useDeleteLeadDialog,
} from '@/features/leads/components/delete-lead-dialog';
import { LeadFilters, type LeadFiltersState } from '@/features/leads/components/lead-filters';
import { LeadStatsWidgets } from '@/features/leads/components/lead-stats-widgets';
import { LeadsTable } from '@/features/leads/components/leads-table';
import { LEAD_MODULE_CONFIG } from '@/features/leads/config/lead.config';
import { useLeads } from '@/features/leads/hooks/use-leads';
import type { LeadStatus } from '@/features/leads/types/lead.types';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { useAuth } from '@/features/auth/providers/auth-provider';

export function LeadsModuleView() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.leads.write);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LeadFiltersState>({
    search: '',
    status: 'ALL',
    projectType: 'ALL',
  });
  const deleteDialog = useDeleteLeadDialog();

  const queryParams = useMemo(
    () => ({
      page,
      limit: LEAD_MODULE_CONFIG.defaultPageSize,
      search: filters.search.trim() || undefined,
      status: filters.status === 'ALL' ? undefined : (filters.status as LeadStatus),
      projectType: filters.projectType === 'ALL' ? undefined : filters.projectType,
    }),
    [filters, page]
  );

  const { data, isLoading, isError, refetch } = useLeads(queryParams);

  const handleFiltersChange = (next: LeadFiltersState) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <LeadModuleShell>
      <div className="space-y-6">
        <LeadStatsWidgets />

        <LeadFilters filters={filters} onChange={handleFiltersChange} />

        {isLoading ? <Loader label="Loading leads..." /> : null}
        {isError ? (
          <ErrorState title="Failed to load leads" message="Please try again." onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && data?.items.length === 0 ? (
          <EmptyState
            title="No leads found"
            description="Try adjusting your filters or wait for new inquiries."
          />
        ) : null}

        {!isLoading && !isError && data && data.items.length > 0 ? (
          <>
            <LeadsTable leads={data.items} canWrite={canWrite} onDelete={deleteDialog.openDialog} />
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </div>

      <DeleteLeadDialog
        lead={deleteDialog.lead}
        open={deleteDialog.open}
        onOpenChange={deleteDialog.setOpen}
      />
    </LeadModuleShell>
  );
}
