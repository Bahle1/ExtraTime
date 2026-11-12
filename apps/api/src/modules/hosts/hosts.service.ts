import type { Host, HostDetail } from '@extratime/shared';
import type {
  CatalogPage,
  CatalogRepository,
  CatalogResult,
} from '../../catalog/catalog.repository.js';
import type { EpisodesService } from '../episodes/episodes.service.js';
import { RECENT_EPISODES_LIMIT } from './hosts.constants.js';

const FIRST_PAGE = 1;

/** Host reads over the snapshot. */
export class HostsService {
  constructor(
    private readonly catalog: CatalogRepository,
    private readonly episodes: EpisodesService,
  ) {}

  /** Every host on one page, in editorial order. */
  async listHosts(): Promise<CatalogPage<Host>> {
    const { hosts, meta } = await this.catalog.getSnapshot();
    const totalItems = hosts.length;
    const pageSize = Math.max(totalItems, 1);
    const totalPages = Math.min(totalItems, 1);
    return { items: hosts, page: FIRST_PAGE, pageSize, totalItems, totalPages, meta };
  }

  /** The host with exactly this slug and its newest episodes, else null. */
  async getHostBySlug(slug: string): Promise<CatalogResult<HostDetail> | null> {
    const { hosts, meta } = await this.catalog.getSnapshot();
    const host = hosts.find((candidate) => candidate.slug === slug);
    if (host === undefined) return null;
    const recent = await this.episodes.listEpisodes({
      host: slug,
      page: FIRST_PAGE,
      pageSize: RECENT_EPISODES_LIMIT,
      sort: '-publishedAt',
    });
    return { data: { ...host, recentEpisodes: [...recent.items] }, meta };
  }
}
