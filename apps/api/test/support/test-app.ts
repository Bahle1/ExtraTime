import { PLATFORMS, SourceStatusListSchema, type SourceStatus } from '@extratime/shared';
import { EpisodeBuilder, HostBuilder, SocialPostBuilder } from '@extratime/shared/testing';
import type { Express } from 'express';
import { pino, type Logger } from 'pino';
import { z } from 'zod';
import { createApp } from '../../src/app.js';
import type { CatalogRepository } from '../../src/catalog/catalog.repository.js';
import type { Clock } from '../../src/catalog/clock.js';
import { MockCatalogRepository } from '../../src/catalog/mock/mock-catalog.repository.js';
import type { MockDataset } from '../../src/catalog/mock/mock-dataset.js';
import { loadConfig } from '../../src/config/env.js';
import { createContainer } from '../../src/container.js';

/** Instant every test clock reports. */
export const TEST_NOW = '2026-11-08T09:00:00.000Z';
/** Clock fixed at TEST_NOW (LD-14). */
export const fixedClock: Clock = { now: () => new Date(TEST_NOW) };

const LAST_SUCCESS_AT = '2026-11-08T08:50:00Z';
const SAM_OKAFOR = {
  id: 'host_sam-okafor',
  slug: 'sam-okafor',
  name: 'Sam Okafor',
  role: 'Co-host',
  avatar: { url: '/images/hosts/sam-okafor.jpg', width: 800, height: 800, alt: 'Sam Okafor' },
} as const;

/** Every platform ok, in PLATFORMS order. */
export const OK_SOURCES: readonly SourceStatus[] = SourceStatusListSchema.parse(
  PLATFORMS.map((platform) => ({
    platform,
    status: 'ok',
    lastSuccessAt: LAST_SUCCESS_AT,
    message: null,
  })),
);

/** Valid builder-made dataset: S03E14 with its two hosts, one related reel, every source ok. */
export function buildTestDataset(overrides: Partial<MockDataset> = {}): MockDataset {
  const episode = new EpisodeBuilder().build();
  return {
    episodes: [episode],
    hosts: [new HostBuilder().build(), new HostBuilder().with(SAM_OKAFOR).build()],
    socialPosts: [new SocialPostBuilder().relatedTo(episode).build()],
    sourceStatuses: [...OK_SOURCES],
    ...overrides,
  };
}

/** Options of createTestApp; defaults to the builder dataset, an empty environment and a silent logger. */
export interface TestAppOptions {
  readonly catalog?: CatalogRepository;
  readonly env?: NodeJS.ProcessEnv;
  readonly logger?: Logger;
}

/** The real app and container over a builder-made catalog (LD-16). */
export async function createTestApp(options: TestAppOptions = {}): Promise<Express> {
  const catalog = options.catalog ?? new MockCatalogRepository(buildTestDataset(), fixedClock);
  const config = loadConfig({ LOG_LEVEL: 'silent', ...options.env });
  const container = await createContainer(config, { catalog });
  return createApp({ ...container, logger: options.logger ?? container.logger });
}

const LogLineSchema = z.looseObject({ level: z.number(), msg: z.string() });

/** One parsed pino line. */
export type LogLine = z.infer<typeof LogLineSchema>;

/** A pino logger at info that keeps every line it writes. */
export function captureLogs(): { readonly logger: Logger; readonly lines: LogLine[] } {
  const lines: LogLine[] = [];
  const stream = { write: (line: string) => lines.push(LogLineSchema.parse(JSON.parse(line))) };
  return { logger: pino({ level: 'info' }, stream), lines };
}
