import type { KnowledgeBaseRecord } from '../../repositories/knowledge-base.repository.js';

export interface KnowledgeBaseDto {
  id: string;
  title: string;
  content: string;
  category: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export function mapKnowledgeBaseToDto(entry: KnowledgeBaseRecord): KnowledgeBaseDto {
  return {
    id: entry.id,
    title: entry.title,
    content: entry.content,
    category: entry.category,
    active: entry.active,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}
