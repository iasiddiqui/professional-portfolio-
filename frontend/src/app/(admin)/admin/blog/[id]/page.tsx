import { BlogPostDetailsView } from '@/features/blog/components/blog-post-details-view';

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  return <BlogPostDetailsView postId={id} />;
}
