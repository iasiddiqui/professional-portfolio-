import type { LeadSource, LeadStatus } from '@/features/leads/types/lead.types';

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

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  CONTACT: 'Contact',
  HIRE_ME: 'Hire Me',
  CONSULTATION: 'Consultation',
};

export const LEAD_SOURCE_OPTIONS = Object.entries(LEAD_SOURCE_LABELS).map(
  ([value, label]) => ({ value: value as LeadSource, label })
);

export const LEAD_SOURCE_COLORS: Record<LeadSource, string> = {
  CONTACT: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  HIRE_ME: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  CONSULTATION: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
};

export const LEAD_MODULE_CONFIG = {
  id: 'leads',
  title: 'Leads',
  description: 'Review and manage inbound contact, hire, and consultation requests.',
  defaultPageSize: 10,
} as const;

export const PROJECT_TYPE_OPTIONS = [
  { value: 'ALL', label: 'All types' },
  { value: 'Web Application', label: 'Web Application' },
  { value: 'Mobile App', label: 'Mobile App' },
  { value: 'SaaS Platform', label: 'SaaS Platform' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'Other', label: 'Other' },
] as const;

export const LEAD_PIPELINE_STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'IN_PROGRESS',
  'CLOSED',
];
