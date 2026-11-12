import { Router } from 'express';
import { validateRequest } from '../../middleware/validate-request.js';
import type { SocialController } from './social.controller.js';
import { SocialFeedQuerySchema } from './social.query-schema.js';

/** Social feed route, mounted under /api/v1. */
export function createSocialRouter(controller: SocialController): Router {
  const router = Router();
  router.get('/social/feed', validateRequest(SocialFeedQuerySchema, 'query'), controller.feed);
  return router;
}
