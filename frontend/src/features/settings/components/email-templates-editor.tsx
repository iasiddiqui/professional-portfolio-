'use client';

import { useEffect, useState } from 'react';

import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpdateSettings } from '@/features/settings/hooks/use-settings-mutations';
import {
  emailTemplatesFormDefaultValues,
  emailTemplatesFormSchema,
  toEmailTemplatesFormValues,
  toEmailTemplatesPayload,
  type EmailTemplatesFormValues,
} from '@/features/settings/schemas/email-templates.schemas';
import {
  EMAIL_TEMPLATE_PLACEHOLDERS,
  EMAIL_TEMPLATE_TABS,
  type EmailTemplateTab,
} from '@/features/settings/types/email-templates.types';
import type { SiteSettings } from '@/features/settings/types/settings.types';
import { useZodForm } from '@/hooks/use-zod-form';
import { cn } from '@/lib/utils';

interface EmailTemplatesEditorProps {
  settings: SiteSettings;
  canWrite: boolean;
}

function LeadConfirmationFields({
  prefix,
  control,
}: {
  prefix: 'contact' | 'hireMe' | 'consultation';
  control: ReturnType<typeof useZodForm<EmailTemplatesFormValues>>['control'];
}) {
  return (
    <div className="space-y-4">
      <FormField control={control} name={`${prefix}.subject`} label="Email subject" />
      <FormField control={control} name={`${prefix}.title`} label="Email heading" />
      <FormField control={control} name={`${prefix}.greeting`} label="Greeting" placeholder="Hi {{name}}," />
      <FormField control={control} name={`${prefix}.intro`} label="Intro paragraph" as="textarea" />
      <FormField control={control} name={`${prefix}.nextStep`} label="Next step message" as="textarea" />
      <FormField
        control={control}
        name={`${prefix}.closing`}
        label="Closing / signature"
        as="textarea"
        placeholder={'Best regards,\n{{owner}}'}
      />
      <FormField control={control} name={`${prefix}.footer`} label="Email footer" as="textarea" />
      <FormField
        control={control}
        name={`${prefix}.successMessage`}
        label="On-screen success message"
        as="textarea"
        description="Shown on the website after the form is submitted."
      />
    </div>
  );
}

export function EmailTemplatesEditor({ settings, canWrite }: EmailTemplatesEditorProps) {
  const [activeTab, setActiveTab] = useState<EmailTemplateTab>('contact');
  const updateMutation = useUpdateSettings();
  const form = useZodForm(emailTemplatesFormSchema, emailTemplatesFormDefaultValues);

  useEffect(() => {
    form.reset(toEmailTemplatesFormValues(settings.emailTemplates));
  }, [form, settings.emailTemplates, settings.updatedAt]);

  const handleSave = form.handleSubmit(async (values) => {
    await updateMutation.mutateAsync({
      emailTemplates: toEmailTemplatesPayload(values, settings.emailTemplates),
    });
  });

  const activeTabMeta = EMAIL_TEMPLATE_TABS.find((tab) => tab.id === activeTab)!;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email templates</CardTitle>
        <CardDescription>
          Customize confirmation emails, admin alerts, and on-screen success messages. Use placeholders
          like {EMAIL_TEMPLATE_PLACEHOLDERS}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-wrap gap-2">
          {EMAIL_TEMPLATE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border/60 text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="mb-5 text-sm text-muted-foreground">{activeTabMeta.description}</p>

        <div className="space-y-4">
          {activeTab === 'admin' ? (
            <>
              <FormField control={form.control} name="admin.subject" label="Email subject" />
              <FormField control={form.control} name="admin.title" label="Email heading" />
              <FormField control={form.control} name="admin.intro" label="Intro paragraph" as="textarea" />
              <FormField control={form.control} name="admin.footer" label="Email footer" as="textarea" />
            </>
          ) : (
            <LeadConfirmationFields prefix={activeTab} control={form.control} />
          )}

          {canWrite ? (
            <Button type="button" variant="accent" disabled={updateMutation.isPending} onClick={handleSave}>
              {updateMutation.isPending ? 'Saving...' : 'Save email templates'}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
