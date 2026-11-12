import { z } from 'zod';

const DEFAULT_PORT = 4000;
const MAX_PORT = 65_535;
const RELEASE_SHA_PATTERN = /^[0-9a-f]{40}$/;
const LOG_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const;

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(MAX_PORT).default(DEFAULT_PORT),
  LOG_LEVEL: z.enum(LOG_LEVELS).default('info'),
  RELEASE_SHA: z.union([z.string().regex(RELEASE_SHA_PATTERN), z.literal('dev')]).default('dev'),
  DATA_SOURCE: z.literal('mock').default('mock'),
});

/** Validated, frozen process configuration. */
export type AppConfig = Readonly<z.infer<typeof EnvSchema>>;

/** Invalid environment; names the variables, never their values. */
export class ConfigError extends Error {
  constructor(readonly variables: readonly string[]) {
    super(`Invalid configuration: ${variables.join(', ')}`);
    this.name = 'ConfigError';
  }
}

/** Parses the environment once at startup. */
export function loadConfig(source: NodeJS.ProcessEnv = process.env): AppConfig {
  const result = EnvSchema.safeParse(source);
  if (!result.success) {
    const names = result.error.issues.map((issue) => String(issue.path[0]));
    throw new ConfigError([...new Set(names)]);
  }
  return Object.freeze(result.data);
}
