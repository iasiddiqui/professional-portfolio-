export const TESTIMONIAL_MODULE_CONFIG = {
  id: 'testimonials',
  title: 'Testimonials',
  description: 'Manage client testimonials and featured reviews.',
  defaultPageSize: 10,
} as const;

export const RATING_OPTIONS = [
  { value: '__none__', label: 'No rating' },
  { value: '1', label: '1 star' },
  { value: '2', label: '2 stars' },
  { value: '3', label: '3 stars' },
  { value: '4', label: '4 stars' },
  { value: '5', label: '5 stars' },
] as const;
