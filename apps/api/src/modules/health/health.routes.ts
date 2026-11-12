import { Router } from 'express';
import type { HealthController } from './health.controller.js';

/** Liveness route, mounted under /api/v1; readiness joins in T2B.15. */
export function createHealthRouter(controller: HealthController): Router {
  const router = Router();
  router.get('/health', controller.live);
  return router;
}
