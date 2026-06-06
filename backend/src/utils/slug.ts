export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function generateUniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const normalized = slugify(base);

  if (!normalized) {
    throw new Error('Unable to generate slug from empty value');
  }

  let slug = normalized;
  let counter = 1;

  while (await exists(slug)) {
    slug = `${normalized}-${counter}`;
    counter += 1;
  }

  return slug;
}
