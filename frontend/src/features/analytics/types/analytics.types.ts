export type AnalyticsEventType = 'VISIT' | 'PAGE_VIEW' | 'CONTACT_REQUEST' | 'DOWNLOAD';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  path: string | null;
  referrer: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AnalyticsOverview {
  visitors: number;
  pageViews: number;
  contactRequests: number;
  downloads: number;
  topPaths: Array<{ path: string; count: number }>;
  range: '7d' | '30d' | '90d' | 'all';
}

export interface AnalyticsOverviewParams {
  range?: '7d' | '30d' | '90d' | 'all';
}

export interface PublicVisitorStats {
  visitors: number;
  pageViews: number;
}
