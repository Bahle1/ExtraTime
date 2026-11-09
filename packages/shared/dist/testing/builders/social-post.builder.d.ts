import type { EpisodeSummary } from '../../schemas/episode.schema.js';
import { type SocialPost } from '../../schemas/social-post.schema.js';
/** Fluent builder of valid SocialPosts; defaults to the golden Instagram reel related to S03E14. */
export declare class SocialPostBuilder {
    private fields;
    /** Overrides fields; set both related fields together or use relatedTo(). */
    with(overrides: Partial<SocialPost>): this;
    /** Relates the post to an episode by setting both relatedEpisodeId and relatedEpisodeSlug. */
    relatedTo(episode: Pick<EpisodeSummary, 'id' | 'slug'>): this;
    /** Builds and validates the SocialPost. */
    build(): SocialPost;
}
