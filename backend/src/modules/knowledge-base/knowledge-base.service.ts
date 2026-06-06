import { PERMISSIONS, hasPermission } from '../../constants/permissions.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { knowledgeBaseRepository } from '../../repositories/knowledge-base.repository.js';
import { AppError } from '../../utils/app-error.js';
import { mapKnowledgeBaseToDto } from './knowledge-base.dto.js';
import type {
  CreateKnowledgeBaseInput,
  KnowledgeBaseListQueryInput,
  UpdateKnowledgeBaseInput,
} from './knowledge-base.validator.js';

export class KnowledgeBaseService {
  async list(query: KnowledgeBaseListQueryInput) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const { items, total } = await knowledgeBaseRepository.findMany({
      page,
      limit,
      skip,
      search: query.search,
      category: query.category,
      active: query.active,
    });

    return { items: items.map(mapKnowledgeBaseToDto), total, page, limit };
  }

  async getCategories() {
    return knowledgeBaseRepository.listCategories();
  }

  async getById(id: string) {
    const entry = await knowledgeBaseRepository.findById(id);
    if (!entry) throw new AppError('Knowledge base entry not found', HTTP_STATUS.NOT_FOUND);
    return mapKnowledgeBaseToDto(entry);
  }

  async create(input: CreateKnowledgeBaseInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const entry = await knowledgeBaseRepository.create({
      title: input.title,
      content: input.content,
      category: input.category,
      active: input.active,
    });

    return mapKnowledgeBaseToDto(entry);
  }

  async update(id: string, input: UpdateKnowledgeBaseInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await knowledgeBaseRepository.findById(id);
    if (!existing) throw new AppError('Knowledge base entry not found', HTTP_STATUS.NOT_FOUND);

    const entry = await knowledgeBaseRepository.update(id, {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.active !== undefined ? { active: input.active } : {}),
    });

    return mapKnowledgeBaseToDto(entry);
  }

  async delete(id: string, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await knowledgeBaseRepository.findById(id);
    if (!existing) throw new AppError('Knowledge base entry not found', HTTP_STATUS.NOT_FOUND);

    await knowledgeBaseRepository.delete(id);
    return { id };
  }

  private assertWritePermission(permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.KNOWLEDGE_BASE_WRITE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
