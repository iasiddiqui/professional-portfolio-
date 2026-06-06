'use client';

import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';

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
import { LeadStatusBadge } from '@/features/leads/components/lead-status-badge';
import type { Lead } from '@/features/leads/types/lead.types';
import { ROUTES } from '@/constants/routes';
import { formatDate, formatRelativeTime } from '@/utils/date';
import { truncate } from '@/utils/string';

interface LeadsTableProps {
  leads: Lead[];
  canWrite?: boolean;
  onDelete?: (lead: Lead) => void;
}

export function LeadsTable({ leads, canWrite, onDelete }: LeadsTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Received</TableHead>
            <TableHead className="w-[70px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="group">
              <TableCell>
                <div className="min-w-0">
                  <Link href={ROUTES.admin.lead(lead.id)} className="font-medium hover:text-accent">
                    {lead.name}
                  </Link>
                  <p className="truncate text-sm text-muted-foreground">{lead.email}</p>
                  {lead.company ? (
                    <p className="truncate text-xs text-muted-foreground">{lead.company}</p>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{lead.projectType ?? '—'}</p>
                  {lead.budget ? <p className="text-muted-foreground">{lead.budget}</p> : null}
                  <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                    {truncate(lead.message, 60)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <LeadStatusBadge status={lead.status} />
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{formatDate(lead.createdAt)}</p>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(lead.createdAt)}</p>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`Actions for ${lead.name}`}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.admin.lead(lead.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </Link>
                    </DropdownMenuItem>
                    {canWrite ? (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete?.(lead)}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
