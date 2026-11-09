import { EpisodeSummarySchema, type Episode, type EpisodeSummary } from '@extratime/shared';
import type {
  CatalogPage,
  CatalogRepository,
  CatalogResult,
} from '../../catalog/catalog.repository.js';
import { compareEpisodes, matchesEpisodeFilters, type EpisodeFilters } from './episode-search.js';
import type { EpisodeSort } from './episodes.constants.js';

/** Validated query, defaults applied. */
export interface EpisodeListQuery extends EpisodeFilters {
  readonly page: number;
  readonly pageSize: number;
  readonly sort: EpisodeSort;
}

/** Episode reads over the snapshot. */
export class EpisodesService {
  constructor(private readonly catalog: CatalogRepository) {}

  /** A page past the end is empty. */
  async listEpisodes(query: EpisodeListQuery): Promise<CatalogPage<EpisodeSummary>> {
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
  async getEpisodeBySlug(slug: string): Promise<CatalogResult<Episode> | null> {
    const { episodes, meta } = await this.catalog.getSnapshot();
    const episode = episodes.find((candidate) => candidate.slug === slug);
    return episode === undefined ? null : { data: episode, meta };
  }
}
