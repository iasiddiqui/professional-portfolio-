import { redirect } from 'next/navigation';

import { ROUTES } from '@/constants/routes';

export default function LegacyAdminPage() {
  redirect(ROUTES.admin.dashboard);
}
