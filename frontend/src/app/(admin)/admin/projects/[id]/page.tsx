import { ProjectDetailsView } from '@/features/projects/components/project-details-view';

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { id } = await params;
  return <ProjectDetailsView projectId={id} />;
}
