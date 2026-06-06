export type AnalyticsEventType =
  | 'PAGE_VIEW'
  | 'CONTACT_SUBMIT'
  | 'RESUME_DOWNLOAD'
  | 'PROJECT_VIEW'
  | 'BLOG_VIEW';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  path: string | null;
  referrer: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AnalyticsOverview {
  totalEvents: number;
  pageViews: number;
  contactSubmits: number;
  resumeDownloads: number;
  topPaths: Array<{ path: string; count: number }>;
}

export interface AnalyticsOverviewParams {
  range?: '7d' | '30d' | '90d';
}
