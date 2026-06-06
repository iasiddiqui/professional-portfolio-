'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

interface AdminBulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  children: ReactNode;
}

export function AdminBulkActionBar({ selectedCount, onClear, children }: AdminBulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
      <span className="text-sm font-medium">{selectedCount} selected</span>
      {children}
      <Button size="sm" variant="ghost" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}
