import { SocialPostSchema } from '../../schemas/social-post.schema.js';
import goldenFeedPage from '../golden/social-feed.page-1.json' with { type: 'json' };
const GOLDEN_REEL = SocialPostSchema.parse(goldenFeedPage.data[0]);
/** Fluent builder of valid SocialPosts; defaults to the golden Instagram reel related to S03E14. */
export class SocialPostBuilder {
    fields = GOLDEN_REEL;
    /** Overrides fields; set both related fields together or use relatedTo(). */
    with(overrides) {
        this.fields = { ...this.fields, ...overrides };
        return this;
    }
    /** Relates the post to an episode by setting both relatedEpisodeId and relatedEpisodeSlug. */
    relatedTo(episode) {
        return this.with({ relatedEpisodeId: episode.id, relatedEpisodeSlug: episode.slug });
    }
    /** Builds and validates the SocialPost. */
    build() {
        return SocialPostSchema.parse(this.fields);
    }
}
