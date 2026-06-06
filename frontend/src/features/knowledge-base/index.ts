export { KNOWLEDGE_BASE_MODULE_CONFIG } from './config/knowledge-base.config';
export {
  useCreateKnowledgeBaseEntry,
  useDeleteKnowledgeBaseEntry,
  useUpdateKnowledgeBaseEntry,
} from './hooks/use-knowledge-base-mutations';
export {
  useKnowledgeBaseCategories,
  useKnowledgeBaseEntries,
  useKnowledgeBaseEntry,
} from './hooks/use-knowledge-base';
export { knowledgeBaseService } from './services/knowledge-base.service';
export { KnowledgeBaseModuleView } from './components/knowledge-base-module-view';
export {
  knowledgeBaseFormDefaultValues,
  knowledgeBaseFormSchema,
  toKnowledgeBaseFormValues,
  toKnowledgeBasePayload,
  type KnowledgeBaseFormValues,
} from './schemas/knowledge-base.schemas';
export type {
  CreateKnowledgeBasePayload,
  KnowledgeBaseEntry,
  KnowledgeBaseListParams,
  KnowledgeBaseListResult,
  UpdateKnowledgeBasePayload,
} from './types/knowledge-base.types';
