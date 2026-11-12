import { describe, expect, it } from 'vitest';
import type { Episode } from '@extratime/shared';
import { EpisodeBuilder } from '@extratime/shared/testing';
import type { CatalogRepository, CatalogSnapshot } from '../../catalog/catalog.repository.js';
import { EpisodesService, type EpisodeListQuery } from './episodes.service.js';

const PAGE_SIZE = 12;
const ARCHIVE_SIZE = 16;
const DAY_MS = 86_400_000;
const NEWEST_MS = Date.parse('2026-11-02T18:00:00Z');
const DERBY_ID = 'ep_s03e14';
const CAFE_ID = 'ep_s02e03';

const ids = (items: readonly { id: string }[]): string[] => items.map((item) => item.id);

function serviceOver(episodes: readonly Episode[]): EpisodesService {
  const meta = { generatedAt: '2026-11-08T09:00:00Z', sources: [] };
  const snapshot: CatalogSnapshot = { episodes, hosts: [], socialPosts: [], meta };
  const catalog: CatalogRepository = { getSnapshot: () => Promise.resolve(snapshot) };
  return new EpisodesService(catalog);
}

function listQuery(overrides: Partial<EpisodeListQuery> = {}): EpisodeListQuery {
  return { page: 1, pageSize: PAGE_SIZE, sort: '-publishedAt', ...overrides };
}

const FACEBOOK_COPY = {
  platform: 'facebook',
  externalId: '1093847562019384',
  url: 'https://www.facebook.com/watch/?v=1093847562019384',
  publishedAt: '2026-11-02T19:30:00Z',
  metrics: { views: null, likes: 412, comments: 37 },
  fetchedAt: '2026-11-06T21:45:00Z',
} as const;

const CAFE_FIELDS = {
  id: CAFE_ID,
  slug: 's02e03-cafe-culture',
  season: 2,
  episodeNumber: 3,
  title: 'Café Culture',
  summary: 'Matchday habits in the stands.',
  hosts: [],
  guests: [],
  tags: ['rituals'],
  publishedAt: '2026-01-20T18:00:00Z',
};

function filterArchive(): Episode[] {
  const derby = new EpisodeBuilder().withSource(FACEBOOK_COPY).build();
  return [derby, new EpisodeBuilder().with(CAFE_FIELDS).build()];
}

function datedArchive(): Episode[] {
  return Array.from({ length: ARCHIVE_SIZE }, (_, index) =>
    new EpisodeBuilder()
      .with({
        id: archiveId(index),
        publishedAt: new Date(NEWEST_MS - index * DAY_MS).toISOString(),
      })
      .build(),
  );
}

function archiveId(index: number): string {
  return `ep_archive_${String(index).padStart(2, '0')}`;
}

describe('TC-API-021 EpisodesService.listEpisodes filters', () => {
  it.each([
    { filter: 'season 2', query: { season: 2 }, expected: [CAFE_ID] },
    { filter: 'host', query: { host: 'jordan-reyes' }, expected: [DERBY_ID] },
    { filter: 'platform', query: { platform: 'facebook' }, expected: [DERBY_ID] },
    { filter: 'q in a title', query: { q: 'FALLOUT' }, expected: [DERBY_ID] },
    { filter: 'q in a summary', query: { q: 'stands' }, expected: [CAFE_ID] },
    { filter: 'q in a guest name', query: { q: 'marchetti' }, expected: [DERBY_ID] },
    { filter: 'q in a tag', query: { q: 'rituals' }, expected: [CAFE_ID] },
    { filter: 'q without diacritics', query: { q: 'cafe' }, expected: [CAFE_ID] },
    { filter: 'season 2 and q derby', query: { season: 2, q: 'derby' }, expected: [] },
  ] as const)(
    'GIVEN two episodes WHEN filtering by $filter THEN returns only episodes matching every filter',
    async ({ query, expected }) => {
      const result = await serviceOver(filterArchive()).listEpisodes(listQuery(query));

      expect(ids(result.items)).toEqual(expected);
    },
  );
});

describe('TC-API-022 EpisodesService.listEpisodes paging and sorting', () => {
  it.each([
    { sort: '-publishedAt', page: 2, expected: [12, 13, 14, 15] },
    { sort: 'publishedAt', page: 2, expected: [3, 2, 1, 0] },
    { sort: '-publishedAt', page: 3, expected: [] },
  ] as const)(
    'GIVEN 16 episodes WHEN sort=$sort and page=$page THEN returns $expected of 2 pages',
    async ({ sort, page, expected }) => {
      const result = await serviceOver(datedArchive()).listEpisodes(listQuery({ sort, page }));

      expect(ids(result.items)).toEqual(expected.map(archiveId));
      expect(result).toMatchObject({ page, totalItems: ARCHIVE_SIZE, totalPages: 2 });
    },
  );

  it('GIVEN equal publishedAt values WHEN listing newest first THEN the higher id comes first', async () => {
    const twins = ['ep_twin_a', 'ep_twin_b'].map((id) => new EpisodeBuilder().with({ id }).build());

    const result = await serviceOver(twins).listEpisodes(listQuery());

    expect(ids(result.items)).toEqual(['ep_twin_b', 'ep_twin_a']);
  });
});
