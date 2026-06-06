import { EditBlogPostView } from '@/features/blog/components/edit-blog-post-view';

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  return <EditBlogPostView postId={id} />;
}
