import {
  EpisodeListResponseSchema,
  EpisodeResponseSchema,
  MAX_QUERY_LENGTH,
  PLATFORMS,
  ProblemDetailsSchema,
  problemTypeUri,
} from '@extratime/shared';
import { EpisodeBuilder } from '@extratime/shared/testing';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { MockCatalogRepository } from '../../src/catalog/mock/mock-catalog.repository.js';
import { buildTestDataset, createTestApp, fixedClock, TEST_NOW } from '../support/test-app.js';

const TRAILER = new EpisodeBuilder()
  .with({
    id: 'ep_yt_Tr4iLer0001',
    slug: 'meet-the-hosts',
    title: 'Meet the Hosts',
    season: null,
    episodeNumber: null,
    episodeType: 'trailer',
    guests: [{ name: 'Ellis Marchetti', description: null }],
    publishedAt: '2026-01-05T18:00:00Z',
  })
  .build();
const catalog = new MockCatalogRepository(
  buildTestDataset({ episodes: [new EpisodeBuilder().build(), TRAILER] }),
  fixedClock,
);
const app = await createTestApp({ catalog });

describe('TC-API-024 GET /api/v1/episodes', () => {
  it('GIVEN the test app WHEN GET ?season=3 THEN a collection of summaries reports every source', async () => {
    const response = await request(app).get('/api/v1/episodes?season=3');

    const body = EpisodeListResponseSchema.parse(response.body);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(body.data.map((episode) => episode.id)).toEqual(['ep_s03e14']);
    expect(response.body.data[0]).not.toHaveProperty('description');
    expect(body.meta).toMatchObject({
      generatedAt: TEST_NOW,
      page: 1,
      pageSize: 12,
      totalItems: 1,
      totalPages: 1,
    });
    expect(body.meta.sources.map((source) => source.platform)).toEqual([...PLATFORMS]);
  });
});

describe('TC-API-025 GET /api/v1/episodes/:slug', () => {
  it.each([
    { episode: 'S03E14', slug: 's03e14-derby-day-fallout', nullPaths: ['data.media.audio'] },
    {
      episode: 'an uncoded trailer',
      slug: 'meet-the-hosts',
      nullPaths: [
        'data.season',
        'data.episodeNumber',
        'data.media.audio',
        'data.guests.0.description',
      ],
    },
  ])(
    'GIVEN $episode WHEN GET its slug THEN the full Episode keeps its nullable fields',
    async ({ slug, nullPaths }) => {
      const response = await request(app).get(`/api/v1/episodes/${slug}`);

      expect(response.status).toBe(200);
      expect(EpisodeResponseSchema.parse(response.body).data.slug).toBe(slug);
      nullPaths.forEach((path) => expect(response.body).toHaveProperty(path, null));
    },
  );
});

describe('TC-API-026 GET an unknown episode slug', () => {
  it('GIVEN an unknown slug WHEN GET THEN 404 problem+json not-found', async () => {
    const response = await request(app).get('/api/v1/episodes/s03e99-unknown');

    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toBe('application/problem+json; charset=utf-8');
    expect(ProblemDetailsSchema.parse(response.body)).toMatchObject({
      type: problemTypeUri('not-found'),
      instance: '/api/v1/episodes/s03e99-unknown',
    });
  });
});

describe('TC-API-027 GET /api/v1/episodes with an invalid query', () => {
  it.each([
    { query: 'pageSize=100', path: 'query.pageSize' },
    { query: 'sort=popular', path: 'query.sort' },
    { query: 'season=three', path: 'query.season' },
    { query: 'foo=bar', path: 'query.foo' },
    { query: `q=${'a'.repeat(MAX_QUERY_LENGTH + 1)}`, path: 'query.q' },
  ])(
    'GIVEN ?$path is invalid WHEN GET THEN 400 with one error at $path',
    async ({ query, path }) => {
      const response = await request(app).get(`/api/v1/episodes?${query}`);

      expect(response.status).toBe(400);
      expect(ProblemDetailsSchema.parse(response.body).errors).toEqual([
        { path, message: expect.any(String) },
      ]);
    },
  );
});
