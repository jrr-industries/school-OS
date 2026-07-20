import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('SchoolOS'),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  DATABASE_URL: z.string().url(),
  DIRECT_DATABASE_URL: z.string().url(),

  REDIS_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),

  ENCRYPTION_KEY: z.string().min(32),

  STORAGE_BUCKET: z.string().default('schoolos-uploads'),
  SUPABASE_STORAGE_URL: z.string().url(),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().positive().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().positive().default(100),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('debug'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json'),

  ENABLE_AUDIT_LOGGING: z
    .string()
    .transform((v) => v === 'true')
    .default('true'),
  ENABLE_API_LOGGING: z
    .string()
    .transform((v) => v === 'true')
    .default('true'),
});

export type Environment = z.infer<typeof environmentSchema>;

let cachedEnv: Environment | null = null;

export function getEnvironment(): Environment {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = environmentSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const missingVars = Object.entries(errors)
      .map(([key, messages]) => `  ${key}: ${messages?.join(', ')}`)
      .join('\n');

    throw new Error(
      `Environment validation failed:\n${missingVars}\n\n` +
        `Please check your .env file and ensure all required variables are set.`,
    );
  }

  cachedEnv = result.data as Environment;
  return cachedEnv;
}

export function getServerEnvironment(): Environment {
  return getEnvironment();
}

export function getClientEnvironment(): Pick<
  Environment,
  'NEXT_PUBLIC_APP_NAME' | 'NEXT_PUBLIC_APP_URL'
> {
  const env = getEnvironment();
  return {
    NEXT_PUBLIC_APP_NAME: env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
  };
}
