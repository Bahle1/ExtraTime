import { Router } from 'express';
import { EmptyQuerySchema, validateRequest } from '../../middleware/validate-request.js';
import type { EpisodesController } from './episodes.controller.js';
import { EpisodeListQuerySchema } from './episodes.query-schema.js';

/** Episode routes, mounted under /api/v1. */
export function createEpisodesRouter(controller: EpisodesController): Router {
  const router = Router();
  router.get('/episodes', validateRequest(EpisodeListQuerySchema, 'query'), controller.list);
  router.get('/episodes/:slug', validateRequest(EmptyQuerySchema, 'query'), controller.getBySlug);
  return router;
}
