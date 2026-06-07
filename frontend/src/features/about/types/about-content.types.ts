export interface AboutTimelineEntry {
  role: string;
  organization: string;
  period: string;
  content: string;
}

export interface AboutTextContent {
  format: 'text';
  body: string;
}

export interface AboutTimelineContent {
  format: 'timeline';
  entries: AboutTimelineEntry[];
}

export interface AboutLegacyContent {
  format: 'legacy';
  raw: string;
}

export type ParsedAboutContent = AboutTextContent | AboutTimelineContent | AboutLegacyContent;

export type AboutContentFormat = 'text' | 'timeline';
