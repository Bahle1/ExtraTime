import type { EpisodeSummary } from '../../schemas/episode.schema.js';
import { type Host, type HostDetail } from '../../schemas/host.schema.js';
/** Fluent builder of valid Hosts; defaults to golden Jordan Reyes. */
export declare class HostBuilder {
    private fields;
    /** Overrides fields of the default host. */
    with(overrides: Partial<Host>): this;
    /** Builds and validates the Host. */
    build(): Host;
    /** Builds and validates the HostDetail with the given recent episodes, newest first. */
    buildDetail(recentEpisodes: readonly EpisodeSummary[]): HostDetail;
}
