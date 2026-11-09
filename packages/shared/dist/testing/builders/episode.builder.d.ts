import { type Episode, type EpisodeSource, type EpisodeSummary } from '../../schemas/episode.schema.js';
type EpisodeFields = Omit<Episode, 'platforms'>;
/** Fluent builder of valid Episodes; defaults to golden S03E14 with its YouTube source only. */
export declare class EpisodeBuilder {
    private fields;
    /** Overrides fields; platforms is always derived from sources. */
    with(overrides: Partial<EpisodeFields>): this;
    /** Appends one platform copy; platforms follow on build(). */
    withSource(source: EpisodeSource): this;
    /** Sets season and episode number with the matching LD-06 id and slug. */
    withCode(season: number, episodeNumber: number): this;
    /** Builds and validates the Episode. */
    build(): Episode;
    /** Builds the validated summary projection (detail fields stripped). */
    buildSummary(): EpisodeSummary;
}
export {};
