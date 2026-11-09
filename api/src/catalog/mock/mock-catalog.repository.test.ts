import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { HostBuilder, SocialPostBuilder } from '@extratime/shared/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { buildTestDataset, fixedClock, TEST_NOW } from '../../../test/support/test-app.js';
import { loadConfig } from '../../config/env.js';
import { createContainer } from '../../container.js';
import { MockCatalogRepository } from './mock-catalog.repository.js';
import {
  MOCK_DATASET_FILES,
  MockDatasetError,
  type MockDatasetKey,
  type RawMockDataset,
} from './mock-dataset.js';

const DATASET_KEYS = ['episodes', 'hosts', 'socialPosts', 'sourceStatuses'] as const;

const DEGRADED_SOURCES = [
  { platform: 'youtube', status: 'ok', lastSuccessAt: '2026-11-08T08:45:00Z', message: null },
  {
    platform: 'instagram',
    status: 'stale',
    lastSuccessAt: '2026-11-07T22:10:00Z',
    message: 'Instagram updates delayed',
  },
  { platform: 'facebook', status: 'error', lastSuccessAt: null, message: null },
] as const;

const temporaryDirectories: string[] = [];

afterEach(async () => {
  const directories = temporaryDirectories.splice(0);
  await Promise.all(directories.map((path) => rm(path, { recursive: true, force: true })));
});

async function writeDataset(
  raw: RawMockDataset,
  texts: Partial<Record<MockDatasetKey, string>> = {},
): Promise<URL> {
  const directory = await mkdtemp(join(tmpdir(), 'extratime-mock-'));
  temporaryDirectories.push(directory);
  const writes = DATASET_KEYS.map((key) =>
    writeFile(join(directory, MOCK_DATASET_FILES[key]), texts[key] ?? JSON.stringify(raw[key])),
  );
  await Promise.all(writes);
  return pathToFileURL(`${directory}/`);
}

describe('TC-API-017 MockCatalogRepository snapshot', () => {
  it('GIVEN instagram stale and facebook error WHEN loaded THEN sources are served verbatim in enum order with every post', async () => {
    const reel = new SocialPostBuilder().build();
    const dataset = buildTestDataset({
      sourceStatuses: [...DEGRADED_SOURCES],
      socialPosts: [reel],
    });
    const directory = await writeDataset(dataset);

    const repository = await MockCatalogRepository.fromDirectory({ clock: fixedClock, directory });
    const snapshot = await repository.getSnapshot();

    expect(snapshot.meta).toEqual({ generatedAt: TEST_NOW, sources: DEGRADED_SOURCES });
    expect(snapshot.socialPosts).toEqual([reel]);
  });

  it('GIVEN a dataset WHEN the snapshot is read THEN it is deeply frozen', async () => {
    const snapshot = await new MockCatalogRepository(buildTestDataset(), fixedClock).getSnapshot();

    expect(Object.isFrozen(snapshot.episodes)).toBe(true);
    expect(Object.isFrozen(snapshot.episodes[0]?.hosts)).toBe(true);
    expect(Object.isFrozen(snapshot.meta.sources[0])).toBe(true);
  });
});

describe('TC-API-018 createContainer with a broken mock data directory', () => {
  it.each([
    {
      defect: 'one invalid host',
      raw: {
        ...buildTestDataset(),
        hosts: [{ ...new HostBuilder().build(), slug: 'Jordan Reyes' }],
      },
      texts: {},
      issue: { file: 'hosts.json', path: '$[0].slug' },
    },
    {
      defect: 'a file that is not JSON',
      raw: buildTestDataset(),
      texts: { sourceStatuses: '[{"platform": "youtube",' },
      issue: { file: 'source-statuses.json', path: '$' },
    },
  ])(
    'GIVEN $defect WHEN the container is created THEN it rejects with MockDatasetError naming file and path',
    async ({ raw, texts, issue }) => {
      const mockDataDirectory = await writeDataset(raw, texts);

      const created = createContainer(loadConfig({}), { mockDataDirectory });

      await expect(created).rejects.toThrow(MockDatasetError);
      await expect(created).rejects.toMatchObject({ issues: [expect.objectContaining(issue)] });
    },
  );
});
