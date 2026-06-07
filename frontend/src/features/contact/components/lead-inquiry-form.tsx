'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ContactSuccessState } from '@/features/contact/components/contact-success-state';
import { contactFormSchema, type ContactFormValues } from '@/features/contact/schemas/contact.schema';
import {
  consultationFormSchema,
  hireMeFormSchema,
  LEAD_INQUIRY_FORM_CONFIG,
  type ConsultationFormValues,
  type HireMeFormValues,
  type LeadInquiryVariant,
} from '@/features/contact/schemas/lead-inquiry.schema';
import {
  PROJECT_TYPE_OTHER_VALUE,
  resolveProjectTypeForSubmit,
} from '@/features/contact/schemas/project-type.schema';
import { projectTypeOptions } from '@/features/public/config/navigation';
import { publicApi } from '@/lib/public-api';
import { cn } from '@/lib/utils';

type FormValues = ContactFormValues | HireMeFormValues | ConsultationFormValues;

interface LeadInquiryFormProps {
  variant: LeadInquiryVariant;
  className?: string;
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

function ProjectTypeFields({
  variant,
  projectType,
  onProjectTypeChange,
  registerOther,
  otherError,
}: {
  variant: LeadInquiryVariant;
  projectType: string;
  onProjectTypeChange: (value: string) => void;
  registerOther: ReturnType<typeof useForm<FormValues>>['register'];
  otherError?: string;
}) {
  const showOther = projectType === PROJECT_TYPE_OTHER_VALUE;

  return (
    <div className="space-y-2">
      <Label htmlFor={`${variant}-projectType`}>Project type</Label>
      <ProjectTypeSelect variant={variant} value={projectType} onChange={onProjectTypeChange} />
      {showOther ? (
        <div className="space-y-2 pt-1">
          <Label htmlFor={`${variant}-projectTypeOther`}>Specify project type *</Label>
          <Input
            id={`${variant}-projectTypeOther`}
            placeholder="Describe your project type"
            aria-invalid={Boolean(otherError)}
            {...registerOther('projectTypeOther' as keyof FormValues)}
          />
          {otherError ? <p className="text-xs text-destructive">{otherError}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function ProjectTypeSelect({
  variant,
  value,
  onChange,
}: {
  variant: LeadInquiryVariant;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      id={`${variant}-projectType`}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">Select a project type</option>
      {projectTypeOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function getSchema(variant: LeadInquiryVariant) {
  if (variant === 'hire-me') return hireMeFormSchema;
  if (variant === 'consultation') return consultationFormSchema;
  return contactFormSchema;
}

function getDefaultValues(variant: LeadInquiryVariant): FormValues {
  const base = {
    name: '',
    email: '',
    company: '',
    projectType: '',
    projectTypeOther: '',
    message: '',
  };

  if (variant === 'hire-me') {
    return { ...base, budget: '', timeline: '' };
  }

  if (variant === 'consultation') {
    return { ...base, preferredTime: '' };
  }

  return base;
}

async function submitInquiry(variant: LeadInquiryVariant, values: FormValues) {
  const projectType = resolveProjectTypeForSubmit(values.projectType, values.projectTypeOther);

  if (variant === 'hire-me') {
    const v = values as HireMeFormValues;
    return publicApi.submitHireMe({
      name: v.name,
      email: v.email,
      company: v.company || undefined,
      budget: v.budget || undefined,
      projectType,
      timeline: v.timeline || undefined,
      message: v.message,
    });
  }

  if (variant === 'consultation') {
    const v = values as ConsultationFormValues;
    return publicApi.submitConsultation({
      name: v.name,
      email: v.email,
      company: v.company || undefined,
      projectType,
      preferredTime: v.preferredTime || undefined,
      message: v.message,
    });
  }

  const v = values as ContactFormValues;
  return publicApi.submitContact({
    name: v.name,
    email: v.email,
    company: v.company || undefined,
    projectType,
    message: v.message,
  });
}

export function LeadInquiryForm({ variant, className }: LeadInquiryFormProps) {
  const config = LEAD_INQUIRY_FORM_CONFIG[variant];
  const defaultValues = getDefaultValues(variant);
  const schema = getSchema(variant);

  const [success, setSuccess] = useState<{ message: string; emailSent: boolean } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema as z.ZodType<FormValues>),
    defaultValues,
    mode: 'onBlur',
  });

  const isSubmitting = form.formState.isSubmitting;
  const isContact = variant === 'contact';
  const showBudget = variant === 'hire-me';
  const showTimeline = variant === 'hire-me';
  const showPreferredTime = variant === 'consultation';
  const projectType = form.watch('projectType') ?? '';
  const projectTypeOtherError = (
    form.formState.errors as Partial<Record<'projectTypeOther', { message?: string }>>
  ).projectTypeOther?.message;

  const handleProjectTypeChange = (value: string) => {
    form.setValue('projectType', value, { shouldDirty: true, shouldValidate: true });
    if (value !== PROJECT_TYPE_OTHER_VALUE) {
      form.setValue('projectTypeOther' as keyof FormValues, '', {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await submitInquiry(variant, values);
      setSuccess({
        message: result.message,
        emailSent: result.emailSent,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit form');
    }
  });

  if (success) {
    return (
      <ContactSuccessState
        title={config.successTitle}
        message={success.message}
        emailSent={success.emailSent}
        onReset={() => {
          setSuccess(null);
          form.reset(defaultValues);
        }}
        resetLabel={config.resetLabel}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        'glass-panel relative overflow-hidden rounded-2xl p-6 sm:p-8',
        isContact && 'space-y-8',
        !isContact && 'space-y-5',
        className
      )}
    >
      {isContact ? <div className="pointer-events-none absolute inset-0 linear-glow opacity-40" aria-hidden /> : null}

      <div className={cn(isContact && 'relative z-10')}>
        <h2 className={cn('font-semibold', isContact ? 'text-2xl tracking-tight text-foreground' : 'text-lg')}>
          {config.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{config.description}</p>
      </div>

      {isContact ? (
        <div className="relative z-10 space-y-8">
          <FormSection title="About you">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${variant}-name`}>Name *</Label>
                <Input
                  id={`${variant}-name`}
                  placeholder="Your name"
                  aria-invalid={Boolean(form.formState.errors.name)}
                  {...form.register('name')}
                />
                {form.formState.errors.name ? (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${variant}-email`}>Email *</Label>
                <Input
                  id={`${variant}-email`}
                  type="email"
                  placeholder="you@company.com"
                  aria-invalid={Boolean(form.formState.errors.email)}
                  {...form.register('email')}
                />
                {form.formState.errors.email ? (
                  <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${variant}-company`}>Subject</Label>
              <Input id={`${variant}-company`} placeholder="Optional subject" {...form.register('company')} />
            </div>
          </FormSection>

          <FormSection title="Your project">
            <ProjectTypeFields
              variant={variant}
              projectType={projectType}
              onProjectTypeChange={handleProjectTypeChange}
              registerOther={form.register}
              otherError={projectTypeOtherError}
            />
            <div className="space-y-2">
              <Label htmlFor={`${variant}-message`}>Message *</Label>
              <Textarea
                id={`${variant}-message`}
                rows={6}
                placeholder="Tell me about your project, timeline, and goals."
                aria-invalid={Boolean(form.formState.errors.message)}
                {...form.register('message')}
              />
              {form.formState.errors.message ? (
                <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>
              ) : null}
            </div>
          </FormSection>

          <Button type="submit" variant="accent" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {config.submitLabel}
          </Button>
        </div>
      ) : (
        <>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${variant}-name`}>Name *</Label>
          <Input
            id={`${variant}-name`}
            placeholder="Your name"
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register('name')}
          />
          {form.formState.errors.name ? (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${variant}-email`}>Email *</Label>
          <Input
            id={`${variant}-email`}
            type="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register('email')}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${variant}-company`}>Subject</Label>
          <Input id={`${variant}-company`} placeholder="Optional subject" {...form.register('company')} />
        </div>
        {showBudget ? (
          <div className="space-y-2">
            <Label htmlFor={`${variant}-budget`}>Budget</Label>
            <Input
              id={`${variant}-budget`}
              placeholder="e.g. $10k–$20k"
              {...form.register('budget' as keyof FormValues)}
            />
          </div>
        ) : showPreferredTime ? (
          <div className="space-y-2">
            <Label htmlFor={`${variant}-preferredTime`}>Preferred time</Label>
            <Input
              id={`${variant}-preferredTime`}
              placeholder="e.g. Weekday mornings, next week"
              {...form.register('preferredTime' as keyof FormValues)}
            />
          </div>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <ProjectTypeFields
          variant={variant}
          projectType={projectType}
          onProjectTypeChange={handleProjectTypeChange}
          registerOther={form.register}
          otherError={projectTypeOtherError}
        />
        {showTimeline ? (
          <div className="space-y-2">
            <Label htmlFor={`${variant}-timeline`}>Timeline</Label>
            <Input
              id={`${variant}-timeline`}
              placeholder="e.g. Start in 4 weeks, 3-month engagement"
              {...form.register('timeline' as keyof FormValues)}
            />
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${variant}-message`}>Message *</Label>
        <Textarea
          id={`${variant}-message`}
          rows={6}
          placeholder={
            variant === 'consultation'
              ? 'What would you like to discuss? Include goals and any constraints.'
              : variant === 'hire-me'
                ? 'Describe the project, deliverables, and how you would like to collaborate.'
                : 'Tell me about your project, timeline, and goals.'
          }
          aria-invalid={Boolean(form.formState.errors.message)}
          {...form.register('message')}
        />
        {form.formState.errors.message ? (
          <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        {config.submitLabel}
      </Button>
        </>
      )}
    </form>
  );
}
