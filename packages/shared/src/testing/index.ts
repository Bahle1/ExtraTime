/** Test-only entry: validating builders and golden fixtures (LD-04); never imported by production code. */
import episodeS03e14 from './golden/episode.s03e14.json' with { type: 'json' };
import hostJordanReyes from './golden/host.jordan-reyes.json' with { type: 'json' };
import problemNotFound from './golden/problem.not-found.json' with { type: 'json' };
import problemValidationError from './golden/problem.validation-error.json' with { type: 'json' };
import socialFeedPage1 from './golden/social-feed.page-1.json' with { type: 'json' };

export { EpisodeBuilder } from './builders/episode.builder.js';
export { HostBuilder } from './builders/host.builder.js';
export { SocialPostBuilder } from './builders/social-post.builder.js';

/** HLD v0.1 S03E14 Episode with YouTube and Facebook copies; parse before use. */
export const GOLDEN_EPISODE_S03E14: unknown = episodeS03e14;
/** HLD v0.1 Host Jordan Reyes with a root-relative /images/ avatar; parse before use. */
export const GOLDEN_HOST_JORDAN_REYES: unknown = hostJordanReyes;
/** HLD v0.1 social feed cursor envelope (Instagram reel, Facebook photo); parse before use. */
export const GOLDEN_SOCIAL_FEED_PAGE_1: unknown = socialFeedPage1;
/** HLD v0.1 404 Problem Details for an unknown episode slug; parse before use. */
export const GOLDEN_PROBLEM_NOT_FOUND: unknown = problemNotFound;
/** HLD v0.1 400 Problem Details with two query errors; parse before use. */
export const GOLDEN_PROBLEM_VALIDATION_ERROR: unknown = problemValidationError;
