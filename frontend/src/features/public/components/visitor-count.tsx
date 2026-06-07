'use client';

import { Eye } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { API_BASE_URL } from '@/constants/api';
import { VISITOR_STATS_EVENT } from '@/features/public/components/visitor-tracker';
import { formatVisitorCount } from '@/features/public/utils/format-visitor-count';

export function VisitorCount() {
  const [visitors, setVisitors] = useState<number | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/analytics/stats`, {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      const json = (await response.json()) as { success?: boolean; data?: { visitors?: number } };

      if (json.success && typeof json.data?.visitors === 'number') {
        setVisitors(json.data.visitors);
      }
    } catch {
      // Hide counter when stats are unavailable.
    }
  }, []);

  useEffect(() => {
    void loadStats();

    const onUpdate = () => void loadStats();
    window.addEventListener(VISITOR_STATS_EVENT, onUpdate);
    return () => window.removeEventListener(VISITOR_STATS_EVENT, onUpdate);
  }, [loadStats]);

  if (visitors === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>
        {formatVisitorCount(visitors)} {visitors === 1 ? 'visitor' : 'visitors'}
      </span>
    </span>
  );
}
