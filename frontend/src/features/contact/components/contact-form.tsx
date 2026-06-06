'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ContactSuccessState } from '@/features/contact/components/contact-success-state';
import {
  contactFormSchema,
  type ContactFormValues,
} from '@/features/contact/schemas/contact.schema';
import { projectTypeOptions } from '@/features/public/config/navigation';
import { publicApi } from '@/lib/public-api';

const defaultValues: ContactFormValues = {
  name: '',
  email: '',
  company: '',
  budget: '',
  projectType: '',
  message: '',
};

export function ContactForm() {
  const [success, setSuccess] = useState<{ message: string; emailSent: boolean } | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await publicApi.submitContact({
        name: values.name,
        email: values.email,
        company: values.company || undefined,
        budget: values.budget || undefined,
        projectType: values.projectType || undefined,
        message: values.message,
      });

      setSuccess({
        message: result.message,
        emailSent: result.emailSent,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    }
  });

  if (success) {
    return (
      <ContactSuccessState
        message={success.message}
        emailSent={success.emailSent}
        onReset={() => {
          setSuccess(null);
          form.reset(defaultValues);
        }}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel space-y-5 rounded-2xl p-6 sm:p-8">
      <div>
        <h2 className="text-lg font-semibold">Send a message</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your project goals and I&apos;ll respond within one business day.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="Your name"
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register('name')}
          />
          {form.formState.errors.name ? (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
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
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Optional" {...form.register('company')} />
          {form.formState.errors.company ? (
            <p className="text-xs text-destructive">{form.formState.errors.company.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input id="budget" placeholder="e.g. $10k–$20k" {...form.register('budget')} />
          {form.formState.errors.budget ? (
            <p className="text-xs text-destructive">{form.formState.errors.budget.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectType">Project type</Label>
        <Select
          value={form.watch('projectType') || undefined}
          onValueChange={(value) =>
            form.setValue('projectType', value, { shouldDirty: true, shouldValidate: true })
          }
        >
          <SelectTrigger id="projectType" aria-invalid={Boolean(form.formState.errors.projectType)}>
            <SelectValue placeholder="Select a project type" />
          </SelectTrigger>
          <SelectContent>
            {projectTypeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.projectType ? (
          <p className="text-xs text-destructive" role="alert">
            {form.formState.errors.projectType.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="Tell me about your project, timeline, and goals."
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
        Send message
      </Button>
    </form>
  );
}
