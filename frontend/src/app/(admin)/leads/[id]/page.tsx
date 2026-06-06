import { LeadDetailsView } from '@/features/leads/components/lead-details-view';

interface LeadDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailsPage({ params }: LeadDetailsPageProps) {
  const { id } = await params;
  return <LeadDetailsView leadId={id} />;
}
