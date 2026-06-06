'use client';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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
import type { KnowledgeBaseEntry } from '@/features/knowledge-base/types/knowledge-base.types';
import { truncate } from '@/utils/string';
import { formatDate } from '@/utils/date';

interface KnowledgeBaseTableProps {
  entries: KnowledgeBaseEntry[];
  canWrite?: boolean;
  onEdit?: (entry: KnowledgeBaseEntry) => void;
  onDelete?: (entry: KnowledgeBaseEntry) => void;
}

export function KnowledgeBaseTable({ entries, canWrite, onEdit, onDelete }: KnowledgeBaseTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[70px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <div className="space-y-1">
                  <span className="font-medium">{entry.title}</span>
                  <p className="truncate text-sm text-muted-foreground">{truncate(entry.content, 100)}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{entry.category}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={entry.active ? 'accent' : 'outline'}>
                  {entry.active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(entry.updatedAt)}
              </TableCell>
              <TableCell>
                {canWrite ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${entry.title}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(entry)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete?.(entry)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
