import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().min(1).default('/api/v1'),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('30d'),
  GEMINI_API_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().min(1).default('Portfolio <onboarding@resend.dev>'),
  CONTACT_NOTIFICATION_EMAIL: z.string().email().optional(),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:3000'),
  ALLOW_PUBLIC_REGISTRATION: z.coerce.boolean().optional(),
  COOKIE_SECURE: z.coerce.boolean().optional(),
  COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).optional(),
  AUTH_COOKIE_PATH: z.string().min(1).default('/'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  AI_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
  AI_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  CONTACT_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(6),
  AUTH_REFRESH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(60),
  GEMINI_MODEL: z.string().min(1).default('gemini-2.0-flash'),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  PUBLIC_URL: z.string().url().default('http://localhost:4000'),
  UPLOAD_DIR: z.string().min(1).default('uploads'),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(5),
});

const parsedEnvSchema = envSchema.transform((data) => ({
  ...data,
  COOKIE_SECURE: data.COOKIE_SECURE ?? data.NODE_ENV === 'production',
  COOKIE_SAME_SITE:
    data.COOKIE_SAME_SITE ?? (data.NODE_ENV === 'production' ? 'strict' : 'lax'),
  ALLOW_PUBLIC_REGISTRATION:
    data.ALLOW_PUBLIC_REGISTRATION ?? data.NODE_ENV !== 'production',
  CORS_ORIGINS: data.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean),
}));

export type Env = z.infer<typeof parsedEnvSchema>;

function parseEnv(): Env {
  const result = parsedEnvSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    console.error(`Invalid environment variables:\n${formatted}`);
    process.exit(1);
  }

  return result.data;
}

export const env = parseEnv();

export function requireEnvValue(value: string | undefined, name: string): string {
  if (!value?.trim()) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}
