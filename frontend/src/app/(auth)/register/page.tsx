'use client';

import Link from 'next/link';

import { FormField } from '@/components/forms/form-field';
import { GuestRoute } from '@/features/auth/components/auth-guards';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/auth.schemas';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { useZodForm } from '@/hooks/use-zod-form';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const form = useZodForm(registerSchema, { name: '', email: '', password: '' });

  const onSubmit = form.handleSubmit(async (values: RegisterFormValues) => {
    await register(values);
  });

  return (
    <GuestRoute>
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Get started with your portfolio platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField control={form.control} name="name" label="Name" placeholder="John Doe" />
            <FormField control={form.control} name="email" label="Email" type="email" placeholder="you@example.com" />
            <FormField control={form.control} name="password" label="Password" type="password" placeholder="••••••••" />
            <Button type="submit" variant="accent" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href={ROUTES.login} className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </GuestRoute>
  );
}
