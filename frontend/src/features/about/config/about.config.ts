export const ABOUT_MODULE_CONFIG = {
  id: 'about',
  title: 'About',
  description: 'Edit your public About page — intro, experience, education, and other sections.',
  category: 'about',
  defaultPageSize: 50,
} as const;

export type TimelineSectionKind = 'experience' | 'education' | 'generic';

export interface TimelineFieldLabels {
  role: string;
  rolePlaceholder: string;
  organization: string;
  organizationPlaceholder: string;
  period: string;
  periodPlaceholder: string;
}

const TIMELINE_FIELD_LABELS: Record<TimelineSectionKind, TimelineFieldLabels> = {
  experience: {
    role: 'Role',
    rolePlaceholder: 'e.g. Full-stack Developer',
    organization: 'Company',
    organizationPlaceholder: 'e.g. APPIT Software Inc.',
    period: 'Period',
    periodPlaceholder: 'e.g. Jun 2024 – Dec 2024 · Hyderabad, India',
  },
  education: {
    role: 'Degree / Program',
    rolePlaceholder: 'e.g. B.Tech · Computer Science & IT',
    organization: 'University / College',
    organizationPlaceholder: 'e.g. Maulana Azad National Urdu University, Hyderabad',
    period: 'Period',
    periodPlaceholder: 'e.g. 2021 – 2024',
  },
  generic: {
    role: 'Title',
    rolePlaceholder: 'e.g. Role or degree title',
    organization: 'Organization',
    organizationPlaceholder: 'e.g. Company or university name',
    period: 'Period',
    periodPlaceholder: 'e.g. Date range or duration',
  },
};

export function getTimelineSectionKind(sectionTitle: string): TimelineSectionKind {
  const normalized = sectionTitle.trim().toLowerCase();

  if (normalized.includes('education') || normalized.includes('school')) {
    return 'education';
  }

  if (
    normalized.includes('experience') ||
    normalized.includes('work') ||
    normalized.includes('employment')
  ) {
    return 'experience';
  }

  return 'generic';
}

export function getTimelineFieldLabels(sectionTitle: string): TimelineFieldLabels {
  return TIMELINE_FIELD_LABELS[getTimelineSectionKind(sectionTitle)];
}
