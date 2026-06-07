'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { API_BASE_URL } from '@/constants/api';

const VISITOR_STATS_EVENT = 'visitor-stats-updated';

export function VisitorTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    void fetch(`${API_BASE_URL}/public/analytics/visit`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
      }),
    })
      .then(() => {
        window.dispatchEvent(new CustomEvent(VISITOR_STATS_EVENT));
      })
      .catch(() => {
        // Non-blocking — tracking failure should not affect the site.
      });
  }, [pathname]);

  return null;
}

export { VISITOR_STATS_EVENT };
