'use client';

import { useEffect } from 'react';

import { FormCheckboxField } from '@/components/forms/form-checkbox-field';
import { FormField } from '@/components/forms/form-field';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SettingsModuleShell } from '@/features/admin/components/module-shells';
import { useUpdateSettings } from '@/features/settings/hooks/use-settings-mutations';
import { useSettings } from '@/features/settings/hooks/use-settings';
import {
  settingsFormDefaultValues,
  settingsFormSchema,
  toSettingsFormValues,
  toSettingsPayload,
  type SettingsFormValues,
} from '@/features/settings/schemas/settings.schemas';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { useZodForm } from '@/hooks/use-zod-form';
import { formatDateTime } from '@/utils/date';

export function SettingsModuleView() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.settings.write);

  const { data: settings, isLoading, isError, refetch } = useSettings();
  const updateMutation = useUpdateSettings();
  const form = useZodForm(settingsFormSchema, settingsFormDefaultValues);

  useEffect(() => {
    if (settings) {
      form.reset(toSettingsFormValues(settings));
    }
  }, [form, settings]);

  const handleSubmit = form.handleSubmit(async (values: SettingsFormValues) => {
    await updateMutation.mutateAsync(toSettingsPayload(values));
  });

  if (isLoading) {
    return (
      <SettingsModuleShell>
        <Loader label="Loading settings..." />
      </SettingsModuleShell>
    );
  }

  if (isError || !settings) {
    return (
      <SettingsModuleShell>
        <ErrorState title="Failed to load settings" message="Please try again." onRetry={() => void refetch()} />
      </SettingsModuleShell>
    );
  }

  return (
    <SettingsModuleShell>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Last updated {formatDateTime(settings.updatedAt)}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>Basic site identity and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="siteName" label="Site name" />
              <FormField
                control={form.control}
                name="siteDescription"
                label="Site description"
                as="textarea"
              />
              <FormField control={form.control} name="contactEmail" label="Contact email" type="email" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Logo and favicon URLs for the public site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="logoUrl" label="Logo URL" />
              <FormField control={form.control} name="faviconUrl" label="Favicon URL" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social links</CardTitle>
              <CardDescription>Profiles linked from the site footer and contact areas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="linkedinUrl" label="LinkedIn URL" />
              <FormField control={form.control} name="githubUrl" label="GitHub URL" />
              <FormField control={form.control} name="twitterUrl" label="Twitter / X URL" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO defaults</CardTitle>
              <CardDescription>Fallback metadata when pages do not define their own SEO.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="seoTitle" label="Default SEO title" />
              <FormField
                control={form.control}
                name="seoDescription"
                label="Default SEO description"
                as="textarea"
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance</CardTitle>
            <CardDescription>Control public site availability.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormCheckboxField
              control={form.control}
              name="maintenanceMode"
              label="Maintenance mode"
              description="When enabled, visitors see a maintenance page instead of the public site."
            />
          </CardContent>
        </Card>

        {canWrite ? (
          <Button type="submit" variant="accent" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save settings'}
          </Button>
        ) : null}
      </form>
    </SettingsModuleShell>
  );
}
