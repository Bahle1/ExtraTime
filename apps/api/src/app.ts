import express, { type Express } from 'express';
import type { Container } from './container.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import { createRequestLogger } from './middleware/request-logger.js';
import { createEpisodesRouter } from './modules/episodes/episodes.routes.js';
import { createHealthRouter } from './modules/health/health.routes.js';
import { createHostsRouter } from './modules/hosts/hosts.routes.js';
import { createSocialRouter } from './modules/social/social.routes.js';

const API_BASE_PATH = '/api/v1';

/** Builds the Express app over a wired container: request logger, routers, then 404 and errors (§3.5.9). */
export function createApp(container: Container): Express {
  const { health, episodes, hosts, social } = container.controllers;
  const app = express();
  app.use(createRequestLogger(container.logger));
  app.use(
    API_BASE_PATH,
    createHealthRouter(health),
    createEpisodesRouter(episodes),
    createHostsRouter(hosts),
    createSocialRouter(social),
  );
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
