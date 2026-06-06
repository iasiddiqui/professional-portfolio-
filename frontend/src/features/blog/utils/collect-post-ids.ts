import { blogService } from '@/features/blog/services/blog.service';

async function collectPostIds(filter: { categoryId?: string; tagId?: string }): Promise<string[]> {
  const postIds = new Set<string>();
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const result = await blogService.list({ ...filter, page, limit: 100 });
    result.items.forEach((post) => postIds.add(post.id));
    hasNextPage = result.pagination.hasNextPage;
    page += 1;
  }

  return [...postIds];
}

export async function collectPostIdsByCategoryIds(categoryIds: string[]): Promise<string[]> {
  const postIds = new Set<string>();

  for (const categoryId of categoryIds) {
    const ids = await collectPostIds({ categoryId });
    ids.forEach((id) => postIds.add(id));
  }

  return [...postIds];
}

export async function collectPostIdsByTagIds(tagIds: string[]): Promise<string[]> {
  const postIds = new Set<string>();

  for (const tagId of tagIds) {
    const ids = await collectPostIds({ tagId });
    ids.forEach((id) => postIds.add(id));
  }

  return [...postIds];
}
