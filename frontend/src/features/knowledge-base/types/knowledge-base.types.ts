export interface KnowledgeBaseEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  active?: boolean;
}

export interface KnowledgeBaseListResult {
  items: KnowledgeBaseEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateKnowledgeBasePayload {
  title: string;
  content: string;
  category: string;
  active?: boolean;
}

export type UpdateKnowledgeBasePayload = Partial<CreateKnowledgeBasePayload>;
