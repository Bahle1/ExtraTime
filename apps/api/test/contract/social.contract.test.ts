import { MAX_FEED_LIMIT, ProblemDetailsSchema, SocialFeedResponseSchema } from '@extratime/shared';
import { SocialPostBuilder } from '@extratime/shared/testing';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { MockCatalogRepository } from '../../src/catalog/mock/mock-catalog.repository.js';
import { buildTestDataset, createTestApp, fixedClock } from '../support/test-app.js';

const REEL = new SocialPostBuilder().build();
const SHORT = new SocialPostBuilder()
  .with({
    id: 'sp_yt_Sh0rtClip01',
    platform: 'youtube',
    permalink: 'https://www.youtube.com/shorts/Sh0rtClip01',
    publishedAt: '2026-11-03T12:00:00Z',
    relatedEpisodeId: null,
    relatedEpisodeSlug: null,
  })
  .build();
const catalog = new MockCatalogRepository(
  buildTestDataset({ socialPosts: [SHORT, REEL] }),
  fixedClock,
);
const app = await createTestApp({ catalog });

async function firstPageCursor(): Promise<string> {
  const response = await request(app).get('/api/v1/social/feed?limit=1');
  return SocialFeedResponseSchema.parse(response.body).meta.nextCursor ?? '';
}

describe('TC-API-034 GET /api/v1/social/feed', () => {
  it('GIVEN the mock container WHEN GET the feed THEN a cursor envelope newest first', async () => {
    const response = await request(app).get('/api/v1/social/feed');

    const body = SocialFeedResponseSchema.parse(response.body);
    expect(response.status).toBe(200);
    expect(body.data.map((post) => post.id)).toEqual([REEL.id, SHORT.id]);
    expect(body.meta).toMatchObject({ limit: 12, nextCursor: null });
  });

  it('GIVEN a valid cursor WHEN GET the next page THEN the envelope holds the older post', async () => {
    const cursor = await firstPageCursor();

    const response = await request(app).get('/api/v1/social/feed').query({ limit: 1, cursor });

    const body = SocialFeedResponseSchema.parse(response.body);
    expect(body.data.map((post) => post.id)).toEqual([SHORT.id]);
    expect(body.meta.nextCursor).toBeNull();
  });

  it('GIVEN platform=youtube WHEN GET the feed THEN only YouTube posts', async () => {
    const response = await request(app).get('/api/v1/social/feed?platform=youtube');

    expect(SocialFeedResponseSchema.parse(response.body).data.map((post) => post.id)).toEqual([
      SHORT.id,
    ]);
  });

  it.each([
    {
      input: 'a tampered cursor',
      query: async () => ({ cursor: `x${(await firstPageCursor()).slice(1)}` }),
      path: 'query.cursor',
    },
    {
      input: `limit=${String(MAX_FEED_LIMIT + 1)}`,
      query: () => Promise.resolve({ limit: MAX_FEED_LIMIT + 1 }),
      path: 'query.limit',
    },
    {
      input: 'an unknown platform',
      query: () => Promise.resolve({ platform: 'instagram,tiktok' }),
      path: 'query.platform.1',
    },
  ])('GIVEN $input WHEN GET the feed THEN 400 at $path', async ({ query, path }) => {
    const response = await request(app)
      .get('/api/v1/social/feed')
      .query(await query());

    expect(response.status).toBe(400);
    expect(ProblemDetailsSchema.parse(response.body).errors).toEqual([
      { path, message: expect.any(String) },
    ]);
  });
});
