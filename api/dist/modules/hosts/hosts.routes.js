import { Router } from 'express';
import { EmptyQuerySchema, validateRequest } from '../../middleware/validate-request.js';
/** Host routes, mounted under /api/v1; neither takes query parameters. */
export function createHostsRouter(controller) {
    const router = Router();
    const noQuery = validateRequest(EmptyQuerySchema, 'query');
    router.get('/hosts', noQuery, controller.list);
    router.get('/hosts/:slug', noQuery, controller.getBySlug);
    return router;
}
