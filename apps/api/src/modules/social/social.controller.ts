import type { SocialFeedResponse } from '@extratime/shared';
import type { Request, Response } from 'express';
import { cursorBody } from '../../http/response-envelope.js';
import type { ValidatedQueryLocals } from '../../middleware/validate-request.js';
import { decodeFeedCursor } from './feed-cursor.js';
import type { SocialFeedQueryParams } from './social.query-schema.js';
import type { SocialService } from './social.service.js';

/** GET /api/v1/social/feed. */
export class SocialController {
  constructor(private readonly social: SocialService) {}

  /** One keyset page of the feed; an invalid cursor is a 400 at query.cursor. */
  readonly feed = async (
    _request: Request,
    response: Response<SocialFeedResponse, ValidatedQueryLocals<SocialFeedQueryParams>>,
  ): Promise<void> => {
    const { platform, limit, cursor } = response.locals.validated.query;
    const after = cursor === undefined ? null : decodeFeedCursor(cursor);
    const page = await this.social.getFeed({ platforms: platform, limit, after });
    response.json(cursorBody(page));
  };
}
