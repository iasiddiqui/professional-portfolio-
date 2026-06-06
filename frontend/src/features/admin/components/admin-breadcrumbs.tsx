'use client';

import Link from 'next/link';

import type { AdminBreadcrumb } from '@/types/admin.types';
import { cn } from '@/lib/utils';

interface AdminBreadcrumbsProps {
  items: AdminBreadcrumb[];
  className?: string;
}

export function AdminBreadcrumbs({ items, className }: AdminBreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span>/</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && 'font-medium text-foreground')}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
