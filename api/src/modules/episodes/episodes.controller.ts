import type { EpisodeListResponse, EpisodeResponse } from '@extratime/shared';
import type { Request, Response } from 'express';
import { NotFoundError } from '../../http/domain-errors.js';
import { collectionBody, singleBody } from '../../http/response-envelope.js';
import type { ValidatedQueryLocals } from '../../middleware/validate-request.js';
import type { EpisodeListQueryParams } from './episodes.query-schema.js';
import type { EpisodesService } from './episodes.service.js';

/** GET /api/v1/episodes and /api/v1/episodes/:slug. */
export class EpisodesController {
  constructor(private readonly episodes: EpisodesService) {}

  /** One page of summaries for the validated query. */
  readonly list = async (
    _request: Request,
    response: Response<EpisodeListResponse, ValidatedQueryLocals<EpisodeListQueryParams>>,
  ): Promise<void> => {
    const page = await this.episodes.listEpisodes(response.locals.validated.query);
    response.json(collectionBody(page));
  };

  /** The episode with exactly this slug, else 404. */
  readonly getBySlug = async (
    request: Request<{ slug: string }>,
    response: Response<EpisodeResponse>,
  ): Promise<void> => {
    const { slug } = request.params;
    const result = await this.episodes.getEpisodeBySlug(slug);
    if (result === null) throw new NotFoundError(`No episode matches the slug '${slug}'.`);
    response.json(singleBody(result));
  };
}
