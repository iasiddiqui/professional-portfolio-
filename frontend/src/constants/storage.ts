export const STORAGE_KEYS = {
  theme: 'portfolio-theme',
} as const;

export type ThemeMode = 'light' | 'dark' | 'system';

export const DEFAULT_THEME: ThemeMode = 'system';
