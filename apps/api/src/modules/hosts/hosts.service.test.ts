import type { Episode, Host } from '@extratime/shared';
import { EpisodeBuilder, HostBuilder } from '@extratime/shared/testing';
import { describe, expect, it } from 'vitest';
import type { CatalogRepository, CatalogSnapshot } from '../../catalog/catalog.repository.js';
import { EpisodesService } from '../episodes/episodes.service.js';
import { RECENT_EPISODES_LIMIT } from './hosts.constants.js';
import { HostsService } from './hosts.service.js';

const DAY_MS = 86_400_000;
const NEWEST_MS = Date.parse('2026-11-02T18:00:00Z');
const ARCHIVE_SIZE = 8;
const JORDAN = new HostBuilder().build();
const SAM = new HostBuilder()
  .with({ id: 'host_sam-okafor', slug: 'sam-okafor', name: 'Sam Okafor', role: 'Co-host' })
  .build();

function serviceOver(hosts: readonly Host[], episodes: readonly Episode[] = []): HostsService {
  const meta = { generatedAt: '2026-11-08T09:00:00Z', sources: [] };
  const snapshot: CatalogSnapshot = { episodes, hosts, socialPosts: [], meta };
  const catalog: CatalogRepository = { getSnapshot: () => Promise.resolve(snapshot) };
  return new HostsService(catalog, new EpisodesService(catalog));
}

function datedArchive(): Episode[] {
  return Array.from({ length: ARCHIVE_SIZE }, (_, index) =>
    new EpisodeBuilder()
      .with({
        id: `ep_archive_${String(index)}`,
        publishedAt: new Date(NEWEST_MS - index * DAY_MS).toISOString(),
      })
      .build(),
  );
}

describe('TC-API-028 HostsService', () => {
  it('GIVEN hosts in editorial order WHEN listing THEN the order is kept on one page', async () => {
    const page = await serviceOver([SAM, JORDAN]).listHosts();

    expect(page.items.map((host) => host.slug)).toEqual(['sam-okafor', 'jordan-reyes']);
    expect(page).toMatchObject({ page: 1, pageSize: 2, totalItems: 2, totalPages: 1 });
  });

  it('GIVEN no hosts WHEN listing THEN the page is empty with no pages', async () => {
    const page = await serviceOver([]).listHosts();

    expect(page).toMatchObject({ items: [], page: 1, pageSize: 1, totalItems: 0, totalPages: 0 });
  });

  it('GIVEN 8 episodes of a host WHEN reading the host THEN only the 6 newest are recent, newest first', async () => {
    const result = await serviceOver([JORDAN, SAM], datedArchive()).getHostBySlug('jordan-reyes');

    expect(result?.data.slug).toBe('jordan-reyes');
    expect(result?.data.recentEpisodes.map((episode) => episode.id)).toEqual(
      Array.from({ length: RECENT_EPISODES_LIMIT }, (_, index) => `ep_archive_${String(index)}`),
    );
  });

  it('GIVEN an episode without the host WHEN reading the host THEN it is not recent', async () => {
    const solo = new EpisodeBuilder().with({ hosts: [] }).build();

    const result = await serviceOver([JORDAN], [solo]).getHostBySlug('jordan-reyes');

    expect(result?.data.recentEpisodes).toEqual([]);
  });

  it('GIVEN an unknown slug WHEN reading a host THEN the result is null', async () => {
    expect(await serviceOver([JORDAN]).getHostBySlug('alex-unknown')).toBeNull();
  });
});
