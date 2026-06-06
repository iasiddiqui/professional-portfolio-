import { EditProjectView } from '@/features/projects/components/edit-project-view';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  return <EditProjectView projectId={id} />;
}
