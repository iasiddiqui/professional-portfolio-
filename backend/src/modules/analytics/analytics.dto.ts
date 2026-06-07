export interface PublicVisitorStatsDto {
  visitors: number;
  pageViews: number;
}

export interface RecordVisitResultDto extends PublicVisitorStatsDto {
  counted: boolean;
}

export interface AnalyticsOverviewDto {
  visitors: number;
  pageViews: number;
  contactRequests: number;
  downloads: number;
  topPaths: Array<{ path: string; count: number }>;
  range: '7d' | '30d' | '90d' | 'all';
}
