'use client';

import { parseAboutContent } from '@/features/about/lib/about-content';
import { AboutTextSectionEditor } from '@/features/about/components/about-text-section-editor';
import { AboutTimelineSectionEditor } from '@/features/about/components/about-timeline-section-editor';
import { AboutLegacySectionEditor } from '@/features/about/components/about-legacy-section-editor';
import type { KnowledgeBaseEntry } from '@/features/knowledge-base/types/knowledge-base.types';

interface AboutSectionEditorProps {
  section: KnowledgeBaseEntry;
  canWrite: boolean;
  onDeleted?: () => void;
}

export function AboutSectionEditor({ section, canWrite, onDeleted }: AboutSectionEditorProps) {
  const parsed = parseAboutContent(section.content);

  if (parsed.format === 'timeline') {
    return (
      <AboutTimelineSectionEditor
        section={section}
        entries={parsed.entries}
        canWrite={canWrite}
        onDeleted={onDeleted}
      />
    );
  }

  if (parsed.format === 'text') {
    return (
      <AboutTextSectionEditor
        section={section}
        body={parsed.body}
        canWrite={canWrite}
        onDeleted={onDeleted}
      />
    );
  }

  return (
    <AboutLegacySectionEditor section={section} canWrite={canWrite} onDeleted={onDeleted} />
  );
}
