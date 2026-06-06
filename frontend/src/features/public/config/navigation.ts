import { ROUTES } from '@/constants/routes';

export const publicNavigation = [
  { label: 'About', href: ROUTES.about },
  { label: 'Projects', href: ROUTES.projects },
  { label: 'Services', href: ROUTES.services },
  { label: 'Blog', href: ROUTES.blog },
  { label: 'Resume', href: ROUTES.resume },
  { label: 'Contact', href: ROUTES.contact },
  { label: 'Ask Ishan AI', href: ROUTES.askIshan },
] as const;

export const projectTypeOptions = [
  'Web Application',
  'Mobile App',
  'SaaS Platform',
  'E-commerce',
  'Consulting',
  'Other',
] as const;
