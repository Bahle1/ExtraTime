import { EpisodeSummarySchema } from '@extratime/shared';
import { compareEpisodes, matchesEpisodeFilters } from './episode-search.js';
/** Episode reads over the snapshot. */
export class EpisodesService {
    catalog;
    constructor(catalog) {
        this.catalog = catalog;
    }
    /** A page past the end is empty. */
    async listEpisodes(query) {
        const { episodes, meta } = await this.catalog.getSnapshot();
        const { page, pageSize } = query;
        const matches = episodes
            .filter((episode) => matchesEpisodeFilters(episode, query))
            .sort(compareEpisodes(query.sort));
        const start = (page - 1) * pageSize;
        const items = matches
            .slice(start, start + pageSize)
            .map((episode) => EpisodeSummarySchema.parse(episode));
        const totalPages = Math.ceil(matches.length / pageSize);
        return { items, page, pageSize, totalItems: matches.length, totalPages, meta };
    }
    /** Exact slug, else null (fallback: T2B.2). */
    async getEpisodeBySlug(slug) {
        const { episodes, meta } = await this.catalog.getSnapshot();
        const episode = episodes.find((candidate) => candidate.slug === slug);
        return episode === undefined ? null : { data: episode, meta };
    }
}
