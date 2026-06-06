export function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return path;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

export function getQueryParam(searchParams: URLSearchParams, key: string): string | null {
  return searchParams.get(key);
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

export function joinPaths(...parts: string[]): string {
  return parts
    .map((part, index) => {
      if (index === 0) return part.replace(/\/+$/, '');
      return part.replace(/^\/+|\/+$/g, '');
    })
    .filter(Boolean)
    .join('/');
}
