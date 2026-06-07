'use client';

import { MoreHorizontal, Pencil, Star, StarOff, Trash2 } from 'lucide-react';

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
import type { Testimonial } from '@/features/testimonials/types/testimonial.types';
import { cn } from '@/lib/utils';
import { truncate } from '@/utils/string';
import { formatDate } from '@/utils/date';

interface TestimonialsTableProps {
  testimonials: Testimonial[];
  canWrite?: boolean;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onEdit?: (testimonial: Testimonial) => void;
  onDelete?: (testimonial: Testimonial) => void;
  onFeaturedChange?: (testimonial: Testimonial, featured: boolean) => void;
  isFeaturedUpdating?: boolean;
}

export function TestimonialsTable({
  testimonials,
  canWrite,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  onEdit,
  onDelete,
  onFeaturedChange,
  isFeaturedUpdating = false,
}: TestimonialsTableProps) {
  const allSelected =
    testimonials.length > 0 && testimonials.every((item) => selectedIds.includes(item.id));
  const someSelected = testimonials.some((item) => selectedIds.includes(item.id));

  const toggleAll = () => {
    if (!onSelectionChange) return;

    if (allSelected) {
      const pageIds = new Set(testimonials.map((item) => item.id));
      onSelectionChange(selectedIds.filter((id) => !pageIds.has(id)));
      return;
    }

    const merged = new Set([...selectedIds, ...testimonials.map((item) => item.id)]);
    onSelectionChange([...merged]);
  };

  const toggleOne = (id: string) => {
    if (!onSelectionChange) return;

    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((itemId) => itemId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  role="checkbox"
                  aria-label="Select all testimonials on this page"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-input accent-accent"
                />
              </TableHead>
            ) : null}
            <TableHead>Client</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[70px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial) => {
            const isSelected = selectedIds.includes(testimonial.id);

            return (
              <TableRow key={testimonial.id} className={cn(isSelected && 'bg-muted/30')}>
                {selectable ? (
                  <TableCell>
                    <input
                      type="checkbox"
                      role="checkbox"
                      aria-label={`Select ${testimonial.clientName}`}
                      checked={isSelected}
                      onChange={() => toggleOne(testimonial.id)}
                      className="h-4 w-4 rounded border-input accent-accent"
                    />
                  </TableCell>
                ) : null}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{testimonial.clientName}</span>
                      {testimonial.featured ? (
                        <Badge variant="accent" className="gap-1">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {[testimonial.designation, testimonial.company].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="truncate text-sm">{truncate(testimonial.content, 120)}</p>
                </TableCell>
                <TableCell>
                  {testimonial.rating ? (
                    <span className="text-sm">{testimonial.rating}/5</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(testimonial.updatedAt)}
                </TableCell>
                <TableCell>
                  {canWrite ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Actions for ${testimonial.clientName}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(testimonial)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={isFeaturedUpdating}
                          onClick={() => onFeaturedChange?.(testimonial, !testimonial.featured)}
                        >
                          {testimonial.featured ? (
                            <>
                              <StarOff className="mr-2 h-4 w-4" />
                              Unfeature
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Feature
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete?.(testimonial)}
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
