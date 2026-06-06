import { absoluteUrl } from '@/lib/seo/config';
import type { SeoSiteConfig } from '@/lib/seo/site-config';
import type { PublicBlogPost } from '@/features/public/types/public.types';
import type { PublicProject } from '@/features/public/types/public.types';
import { ROUTES } from '@/constants/routes';
import { resolveAbsoluteMediaUrl } from '@/lib/media-url';

type JsonLd = Record<string, unknown>;

export function buildWebSiteSchema(site: SeoSiteConfig): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.siteName,
    description: site.description,
    url: site.url,
    ...(site.logoUrl ? { image: site.logoUrl } : {}),
  };
}

export function buildOrganizationSchema(site: SeoSiteConfig): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.siteName,
    url: site.url,
    ...(site.logoUrl ? { logo: site.logoUrl } : {}),
    ...(site.contactEmail ? { email: site.contactEmail } : {}),
  };
}

export function buildPersonSchema(site: SeoSiteConfig): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.siteName,
    url: site.url,
    ...(site.logoUrl ? { image: site.logoUrl } : {}),
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildBlogPostingSchema(
  post: PublicBlogPost,
  site: SeoSiteConfig
): JsonLd {
  const image = resolveAbsoluteMediaUrl(post.featuredImage);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription ?? post.excerpt,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    author: post.author
      ? { '@type': 'Person', name: post.author.name }
      : { '@type': 'Person', name: site.siteName },
    publisher: {
      '@type': 'Organization',
      name: site.siteName,
      ...(site.logoUrl ? { logo: { '@type': 'ImageObject', url: site.logoUrl } } : {}),
    },
    mainEntityOfPage: absoluteUrl(ROUTES.blogPost(post.slug)),
    url: absoluteUrl(ROUTES.blogPost(post.slug)),
    ...(image ? { image } : {}),
    keywords: post.tags.map((tag) => tag.name).join(', '),
  };
}

export function buildProjectSchema(project: PublicProject, site: SeoSiteConfig): JsonLd {
  const image = resolveAbsoluteMediaUrl(project.thumbnail?.url ?? null);

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.shortDescription,
    url: absoluteUrl(ROUTES.project(project.slug)),
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
    ...(image ? { image } : {}),
    programmingLanguage: project.techStack,
    author: {
      '@type': 'Person',
      name: site.siteName,
    },
  };
}

export function buildCollectionPageSchema(
  title: string,
  description: string,
  path: string
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: absoluteUrl(path),
  };
}
