'use client';

import { CheckCircle2, CircleOff, ExternalLink, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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
import type { Resume } from '@/features/resume/types/resume.types';
import { resolveMediaUrl } from '@/lib/media-url';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/date';

interface ResumeTableProps {
  resumes: Resume[];
  canWrite?: boolean;
  onEdit?: (resume: Resume) => void;
  onDelete?: (resume: Resume) => void;
  onActiveToggle?: (resume: Resume, isActive: boolean) => void;
  isActiveUpdating?: boolean;
}

export function ResumeTable({
  resumes,
  canWrite,
  onEdit,
  onDelete,
  onActiveToggle,
  isActiveUpdating = false,
}: ResumeTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[70px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.map((resume) => {
            const fileUrl = resolveMediaUrl(resume.fileUrl);

            return (
            <TableRow key={resume.id}>
              <TableCell>
                <div className="space-y-1">
                  <span className="font-medium">{resume.title}</span>
                  {fileUrl ? (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-accent hover:underline"
                    >
                      View file
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs">{resume.version}</code>
              </TableCell>
              <TableCell>
                {resume.isActive ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      'gap-1 border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    )}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-transparent bg-destructive/10 text-destructive"
                  >
                    Inactive
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(resume.updatedAt)}
              </TableCell>
              <TableCell>
                {canWrite ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${resume.title}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(resume)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={isActiveUpdating}
                        onClick={() => onActiveToggle?.(resume, !resume.isActive)}
                      >
                        {resume.isActive ? (
                          <>
                            <CircleOff className="mr-2 h-4 w-4" />
                            Set as inactive
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Set as active
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete?.(resume)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
