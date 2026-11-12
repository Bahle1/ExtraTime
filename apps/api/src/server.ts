import type { Express } from 'express';
import { pino } from 'pino';
import { createApp } from './app.js';
import { loadConfig } from './config/env.js';
import { createContainer } from './container.js';

const STARTUP_FAILURE_EXIT_CODE = 1;

async function start(): Promise<void> {
  const config = loadConfig();
  const container = await createContainer(config);
  await listen(createApp(container), config.PORT);
  container.logger.info({ port: config.PORT }, 'API listening');
}

function listen(app: Express, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    app.listen(port, (error) => {
      if (error === undefined) resolve();
      else reject(error);
    });
  });
}

start().catch((error: unknown) => {
  pino().fatal({ err: error }, 'API failed to start');
  process.exit(STARTUP_FAILURE_EXIT_CODE);
});
