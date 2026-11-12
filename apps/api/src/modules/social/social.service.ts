import type { Platform, SocialPost } from '@extratime/shared';
import type { CatalogCursorPage, CatalogRepository } from '../../catalog/catalog.repository.js';
import { encodeFeedCursor, isAfterCursor, type FeedCursorKey } from './feed-cursor.js';

/** Validated feed query: platforms to include, page size and the previous page's last post. */
export interface SocialFeedQuery {
  readonly platforms: readonly Platform[];
  readonly limit: number;
  readonly after: FeedCursorKey | null;
}

/** Social feed reads over the snapshot, keyset-paged (LD-05). */
export class SocialService {
  constructor(private readonly catalog: CatalogRepository) {}

  /** Posts newest first (id breaks ties) after the cursor; nextCursor is null on the last page. */
  async getFeed(query: SocialFeedQuery): Promise<CatalogCursorPage<SocialPost>> {
    const { socialPosts, meta } = await this.catalog.getSnapshot();
    const { platforms, limit, after } = query;
    const candidates = socialPosts
      .filter((post) => platforms.includes(post.platform))
      .filter((post) => after === null || isAfterCursor(post, after))
      .sort(byFeedOrder)
      .slice(0, limit + 1);
    const items = candidates.slice(0, limit);
    const last = items.at(-1);
    const nextCursor =
      candidates.length > limit && last !== undefined ? encodeFeedCursor(last) : null;
    return { items, limit, nextCursor, meta };
  }
}

function byFeedOrder(a: SocialPost, b: SocialPost): number {
  return Number(isAfterCursor(a, b)) - Number(isAfterCursor(b, a));
}
