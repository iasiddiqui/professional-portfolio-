import type { LeadStatus } from '@/features/leads/types/lead.types';

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  IN_PROGRESS: 'In Progress',
  CLOSED: 'Closed',
};

export const LEAD_STATUS_OPTIONS = Object.entries(LEAD_STATUS_LABELS).map(
  ([value, label]) => ({ value: value as LeadStatus, label })
);

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  CONTACTED: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  IN_PROGRESS: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  CLOSED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

export const LEAD_MODULE_CONFIG = {
  id: 'leads',
  title: 'Leads',
  description: 'Review and manage inbound contact and project inquiries.',
  defaultPageSize: 10,
} as const;

export const PROJECT_TYPE_OPTIONS = [
  { value: 'ALL', label: 'All types' },
  { value: 'Web App', label: 'Web App' },
  { value: 'Mobile App', label: 'Mobile App' },
  { value: 'Website', label: 'Website' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'Other', label: 'Other' },
] as const;
