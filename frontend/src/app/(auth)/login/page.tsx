'use client';

import Link from 'next/link';

import { FormField } from '@/components/forms/form-field';
import { GuestRoute } from '@/features/auth/components/auth-guards';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schemas';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { useZodForm } from '@/hooks/use-zod-form';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const registrationEnabled = process.env.NEXT_PUBLIC_ALLOW_REGISTRATION === 'true';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const form = useZodForm(loginSchema, { email: '', password: '' });

  const onSubmit = form.handleSubmit(async (values: LoginFormValues) => {
    await login(values);
  });

  return (
    <GuestRoute>
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField control={form.control} name="email" label="Email" type="email" placeholder="you@example.com" />
            <FormField control={form.control} name="password" label="Password" type="password" placeholder="••••••••" />
            <Button type="submit" variant="accent" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          {registrationEnabled ? (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No account?{' '}
              <Link href={ROUTES.register} className="text-accent hover:underline">
                Register
              </Link>
            </p>
          ) : null}
        </CardContent>
      </Card>
    </GuestRoute>
  );
}
