export const ANALYTICS_MODULE_CONFIG = {
  id: 'analytics',
  title: 'Analytics',
  description: 'Track visits, page views, contact requests, and downloads.',
  defaultRange: '30d' as const,
} as const;

export const ANALYTICS_RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
] as const;
