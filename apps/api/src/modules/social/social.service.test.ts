import { PLATFORMS, type Platform, type SocialPost } from '@extratime/shared';
import { SocialPostBuilder } from '@extratime/shared/testing';
import { describe, expect, it } from 'vitest';
import type { CatalogRepository, CatalogSnapshot } from '../../catalog/catalog.repository.js';
import { decodeFeedCursor } from './feed-cursor.js';
import { SocialService, type SocialFeedQuery } from './social.service.js';

const LIMIT = 12;
const FEED_SIZE = 24;
const INSTAGRAM_COUNT = 14;
const HOUR_MS = 3_600_000;
const NEWEST_MS = Date.parse('2026-11-06T21:00:00Z');

function serviceOver(socialPosts: readonly SocialPost[]): SocialService {
  const meta = { generatedAt: '2026-11-08T09:00:00Z', sources: [] };
  const snapshot: CatalogSnapshot = { episodes: [], hosts: [], socialPosts, meta };
  const catalog: CatalogRepository = { getSnapshot: () => Promise.resolve(snapshot) };
  return new SocialService(catalog);
}

function post(index: number, publishedAtMs = NEWEST_MS - index * HOUR_MS): SocialPost {
  const platform: Platform = index < INSTAGRAM_COUNT ? 'instagram' : 'youtube';
  const id = `sp_${platform === 'instagram' ? 'ig' : 'yt'}_${String(index).padStart(2, '0')}`;
  return new SocialPostBuilder()
    .with({ id, platform, publishedAt: new Date(publishedAtMs).toISOString() })
    .build();
}

const NEWEST_FIRST = Array.from({ length: FEED_SIZE }, (_, index) => post(index));
const FEED = NEWEST_FIRST.toReversed();

function feedQuery(overrides: Partial<SocialFeedQuery> = {}): SocialFeedQuery {
  return { platforms: PLATFORMS, limit: LIMIT, after: null, ...overrides };
}

async function readAllPages(service: SocialService, query: SocialFeedQuery): Promise<string[][]> {
  const pages: string[][] = [];
  let after = query.after;
  do {
    const page = await service.getFeed({ ...query, after });
    pages.push(page.items.map((item) => item.id));
    after = page.nextCursor === null ? null : decodeFeedCursor(page.nextCursor);
  } while (after !== null);
  return pages;
}

describe('TC-API-032 SocialService.getFeed keyset pages', () => {
  it('GIVEN 24 posts WHEN paging by 12 THEN 12 and 12 newest first, then a null cursor', async () => {
    const pages = await readAllPages(serviceOver(FEED), feedQuery());

    expect(pages.map((page) => page.length)).toEqual([LIMIT, LIMIT]);
    expect(pages.flat()).toEqual(NEWEST_FIRST.map((item) => item.id));
  });

  it('GIVEN 14 Instagram posts WHEN paging platform=instagram THEN all 14 and only Instagram', async () => {
    const pages = await readAllPages(serviceOver(FEED), feedQuery({ platforms: ['instagram'] }));

    expect(pages.map((page) => page.length)).toEqual([LIMIT, INSTAGRAM_COUNT - LIMIT]);
    expect(pages.flat().every((id) => id.startsWith('sp_ig_'))).toBe(true);
  });

  it('GIVEN exactly one page of posts WHEN read THEN nextCursor is null', async () => {
    const page = await serviceOver(NEWEST_FIRST.slice(0, LIMIT)).getFeed(feedQuery());

    expect(page).toMatchObject({ limit: LIMIT, nextCursor: null });
  });

  it('GIVEN posts at the same instant WHEN paging by 1 THEN the higher id comes first', async () => {
    const twins = [post(1, NEWEST_MS), post(2, NEWEST_MS)];

    const pages = await readAllPages(serviceOver(twins), feedQuery({ limit: 1 }));

    expect(pages).toEqual([['sp_ig_02'], ['sp_ig_01']]);
  });
});

describe('TC-API-033 cursor stability', () => {
  it('GIVEN a page-1 cursor WHEN a newer post is published THEN page 2 is unchanged', async () => {
    const before = serviceOver(FEED);
    const firstPage = await before.getFeed(feedQuery());
    const after = firstPage.nextCursor === null ? null : decodeFeedCursor(firstPage.nextCursor);
    const newer = post(FEED_SIZE, NEWEST_MS + HOUR_MS);

    const secondPage = await before.getFeed(feedQuery({ after }));
    const secondPageAfterPublish = await serviceOver([newer, ...FEED]).getFeed(
      feedQuery({ after }),
    );

    expect(after).not.toBeNull();
    expect(secondPageAfterPublish.items).toEqual(secondPage.items);
  });
});
