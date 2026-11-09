import { EpisodeSchema, EpisodeSummarySchema, } from '../../schemas/episode.schema.js';
import goldenEpisode from '../golden/episode.s03e14.json' with { type: 'json' };
const GOLDEN_EPISODE = EpisodeSchema.parse(goldenEpisode);
const YOUTUBE_ONLY_EPISODE = {
    ...GOLDEN_EPISODE,
    sources: GOLDEN_EPISODE.sources.filter((source) => source.platform === 'youtube'),
};
const DEFAULT_TITLE_SLUG = 'derby-day-fallout';
const CODE_DIGITS = 2;
/** Fluent builder of valid Episodes; defaults to golden S03E14 with its YouTube source only. */
export class EpisodeBuilder {
    fields = YOUTUBE_ONLY_EPISODE;
    /** Overrides fields; platforms is always derived from sources. */
    with(overrides) {
        this.fields = { ...this.fields, ...overrides };
        return this;
    }
    /** Appends one platform copy; platforms follow on build(). */
    withSource(source) {
        return this.with({ sources: [...this.fields.sources, source] });
    }
    /** Sets season and episode number with the matching LD-06 id and slug. */
    withCode(season, episodeNumber) {
        const code = `s${padCode(season)}e${padCode(episodeNumber)}`;
        return this.with({
            id: `ep_${code}`,
            slug: `${code}-${DEFAULT_TITLE_SLUG}`,
            season,
            episodeNumber,
        });
    }
    /** Builds and validates the Episode. */
    build() {
        const platforms = [...new Set(this.fields.sources.map((source) => source.platform))];
        return EpisodeSchema.parse({ ...this.fields, platforms });
    }
    /** Builds the validated summary projection (detail fields stripped). */
    buildSummary() {
        return EpisodeSummarySchema.parse(this.build());
    }
}
function padCode(value) {
    return String(value).padStart(CODE_DIGITS, '0');
}
