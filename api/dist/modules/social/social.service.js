import { encodeFeedCursor, isAfterCursor } from './feed-cursor.js';
/** Social feed reads over the snapshot, keyset-paged (LD-05). */
export class SocialService {
    catalog;
    constructor(catalog) {
        this.catalog = catalog;
    }
    /** Posts newest first (id breaks ties) after the cursor; nextCursor is null on the last page. */
    async getFeed(query) {
        const { socialPosts, meta } = await this.catalog.getSnapshot();
        const { platforms, limit, after } = query;
        const candidates = socialPosts
            .filter((post) => platforms.includes(post.platform))
            .filter((post) => after === null || isAfterCursor(post, after))
            .sort(byFeedOrder)
            .slice(0, limit + 1);
        const items = candidates.slice(0, limit);
        const last = items.at(-1);
        const nextCursor = candidates.length > limit && last !== undefined ? encodeFeedCursor(last) : null;
        return { items, limit, nextCursor, meta };
    }
}
function byFeedOrder(a, b) {
    return Number(isAfterCursor(a, b)) - Number(isAfterCursor(b, a));
}
