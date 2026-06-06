'use client';

import { AdminNavItemLink } from '@/features/admin/components/admin-nav-item';
import type { AdminNavSection } from '@/types/admin.types';
import { cn } from '@/lib/utils';

interface AdminNavSectionProps {
  section: AdminNavSection;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function AdminNavSectionGroup({ section, collapsed = false, onNavigate }: AdminNavSectionProps) {
  return (
    <div className="space-y-1">
      {section.title && !collapsed ? (
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {section.title}
        </p>
      ) : null}
      <div className={cn('space-y-1', collapsed && section.title && 'pt-2')}>
        {section.items.map((item) => (
          <AdminNavItemLink
            key={item.id}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
