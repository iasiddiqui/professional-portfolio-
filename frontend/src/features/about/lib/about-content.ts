import type {
  AboutContentFormat,
  AboutTimelineEntry,
  ParsedAboutContent,
} from '@/features/about/types/about-content.types';

export function parseAboutContent(raw: string): ParsedAboutContent {
  try {
    const parsed = JSON.parse(raw) as unknown;

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'format' in parsed &&
      parsed.format === 'text' &&
      'body' in parsed &&
      typeof parsed.body === 'string'
    ) {
      return { format: 'text', body: parsed.body };
    }

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'format' in parsed &&
      parsed.format === 'timeline' &&
      'entries' in parsed &&
      Array.isArray(parsed.entries)
    ) {
      const entries = parsed.entries
        .filter(
          (entry): entry is Record<string, unknown> =>
            typeof entry === 'object' && entry !== null && 'role' in entry && 'period' in entry && 'content' in entry
        )
        .map((entry) => ({
          role: String(entry.role).trim(),
          organization:
            'organization' in entry && typeof entry.organization === 'string'
              ? entry.organization.trim()
              : '',
          period: String(entry.period).trim(),
          content: String(entry.content).trim(),
        }));

      return { format: 'timeline', entries };
    }
  } catch {
    // fall through to legacy markdown
  }

  return { format: 'legacy', raw };
}

export function serializeTextContent(body: string): string {
  return JSON.stringify({ format: 'text', body: body.trim() } satisfies { format: 'text'; body: string });
}

export function serializeTimelineContent(entries: AboutTimelineEntry[]): string {
  return JSON.stringify({
    format: 'timeline',
    entries: entries.map((entry) => ({
      role: entry.role.trim(),
      organization: entry.organization.trim(),
      period: entry.period.trim(),
      content: entry.content.trim(),
    })),
  } satisfies { format: 'timeline'; entries: AboutTimelineEntry[] });
}

export function createEmptyTimelineEntry(): AboutTimelineEntry {
  return { role: '', organization: '', period: '', content: '' };
}

export function getAboutContentFormat(raw: string): AboutContentFormat | 'legacy' {
  const parsed = parseAboutContent(raw);
  return parsed.format;
}

export function splitEntryContent(content: string): string[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*•]\s*/, ''));
}
