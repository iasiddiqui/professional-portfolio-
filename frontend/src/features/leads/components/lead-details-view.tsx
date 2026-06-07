'use client';

import { Building2, CalendarClock, Clock3, DollarSign, Mail, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LeadModuleShell } from '@/features/admin/components/module-shells';
import {
  DeleteLeadDialog,
  useDeleteLeadDialog,
} from '@/features/leads/components/delete-lead-dialog';
import { LeadNotesPanel } from '@/features/leads/components/lead-notes-panel';
import { LeadSourceBadge } from '@/features/leads/components/lead-source-badge';
import { LeadStatusBadge } from '@/features/leads/components/lead-status-badge';
import { LEAD_STATUS_OPTIONS } from '@/features/leads/config/lead.config';
import { useUpdateLeadStatus } from '@/features/leads/hooks/use-lead-mutations';
import { useLead } from '@/features/leads/hooks/use-leads';
import type { LeadStatus } from '@/features/leads/types/lead.types';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { formatDateTime } from '@/utils/date';

interface LeadDetailsViewProps {
  leadId: string;
}

export function LeadDetailsView({ leadId }: LeadDetailsViewProps) {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.leads.write);

  const deleteDialog = useDeleteLeadDialog();
  const statusMutation = useUpdateLeadStatus(leadId);
  const { data: lead, isLoading, isError, refetch } = useLead(leadId);

  if (isLoading) {
    return (
      <LeadModuleShell title="Lead details">
        <Loader label="Loading lead..." />
      </LeadModuleShell>
    );
  }

  if (isError || !lead) {
    return (
      <LeadModuleShell title="Lead details">
        <ErrorState title="Lead not found" onRetry={() => void refetch()} />
      </LeadModuleShell>
    );
  }

  return (
    <LeadModuleShell
      title={lead.name}
      description={lead.email}
      breadcrumbs={[
        { label: 'Dashboard', href: ROUTES.admin.dashboard },
        { label: 'Leads', href: ROUTES.admin.leads },
        { label: lead.name },
      ]}
      actions={
        canWrite ? (
          <Button variant="destructive" size="sm" onClick={() => deleteDialog.openDialog(lead)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        ) : undefined
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{lead.message}</p>
            </CardContent>
          </Card>

          <LeadNotesPanel lead={lead} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <LeadStatusBadge status={lead.status} />
                <LeadSourceBadge source={lead.source} />
              </div>
              {canWrite ? (
                <Select
                  value={lead.status}
                  onValueChange={(value) => statusMutation.mutate({ status: value as LeadStatus })}
                  disabled={statusMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow icon={User} label="Name" value={lead.name} />
              <InfoRow icon={Mail} label="Email" value={lead.email} href={`mailto:${lead.email}`} />
              <InfoRow icon={Building2} label="Subject" value={lead.company ?? '—'} />
              <InfoRow icon={DollarSign} label="Budget" value={lead.budget ?? '—'} />
              <InfoRow label="Project type" value={lead.projectType ?? '—'} />
              {lead.timeline ? (
                <InfoRow icon={CalendarClock} label="Timeline" value={lead.timeline} />
              ) : null}
              {lead.preferredTime ? (
                <InfoRow icon={Clock3} label="Preferred time" value={lead.preferredTime} />
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email automation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Admin notification</span>
                <span className="font-medium">{lead.adminEmailSent ? 'Sent' : 'Not sent'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Auto-reply</span>
                <span className="font-medium">
                  {lead.confirmationEmailSent ? 'Sent' : 'Not sent'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Received</span>
                <span>{formatDateTime(lead.createdAt)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Last updated</span>
                <span>{formatDateTime(lead.updatedAt)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Notes</span>
                <span>{lead.notes.length}</span>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href={ROUTES.admin.leads}>Back to leads</Link>
          </Button>
        </div>
      </div>

      <DeleteLeadDialog
        lead={deleteDialog.lead}
        open={deleteDialog.open}
        onOpenChange={deleteDialog.setOpen}
        onDeleted={() => router.push(ROUTES.admin.leads)}
      />
    </LeadModuleShell>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon?: typeof User;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon ? <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" /> : <span className="w-4" />}
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground">{label}</p>
        {href ? (
          <a href={href} className="font-medium text-accent hover:underline">
            {value}
          </a>
        ) : (
          <p className="font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}
