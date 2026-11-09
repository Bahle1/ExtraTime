import { Router } from 'express';
/** Liveness route, mounted under /api/v1; readiness joins in T2B.15. */
export function createHealthRouter(controller) {
    const router = Router();
    router.get('/health', controller.live);
    return router;
}
