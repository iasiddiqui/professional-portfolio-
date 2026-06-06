'use client';

import { EmptyState } from '@/components/common/empty-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsModuleShell } from '@/features/admin/components/module-shells';
import { ANALYTICS_MODULE_CONFIG } from '@/features/analytics/config/analytics.config';

export function AnalyticsModuleView() {
  return (
    <AnalyticsModuleShell>
      <Card>
        <CardHeader>
          <CardTitle>{ANALYTICS_MODULE_CONFIG.title}</CardTitle>
          <CardDescription>{ANALYTICS_MODULE_CONFIG.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Analytics dashboard ready"
            description="View traffic, conversions, and top pages once the API module is connected."
          />
        </CardContent>
      </Card>
    </AnalyticsModuleShell>
  );
}
