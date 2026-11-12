import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import type { CatalogRepository } from '../src/catalog/catalog.repository.js';
import { createTestApp } from './support/test-app.js';

const RELEASE_SHA = '3f9c2a7e1b4d8f06a5c3e9b2d7f1a4c8e6b0d2f5';
const LivenessBodySchema = z.strictObject({
  status: z.literal('ok'),
  version: z.string().regex(/^\d+\.\d+\.\d+/),
  commit: z.string(),
  uptimeSeconds: z.int().nonnegative(),
});
const unreachableCatalog: CatalogRepository = {
  getSnapshot: () => Promise.reject(new Error('liveness must not read the catalog')),
};

describe('TC-API-035 GET /api/v1/health', () => {
  it.each([
    { state: 'unset', env: {}, commit: 'dev' },
    { state: 'set', env: { RELEASE_SHA }, commit: RELEASE_SHA },
  ])(
    'GIVEN RELEASE_SHA $state and an unreachable catalog WHEN GET /api/v1/health THEN 200 with commit $commit and an integer uptime',
    async ({ env, commit }) => {
      const app = await createTestApp({ env, catalog: unreachableCatalog });

      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(LivenessBodySchema.parse(response.body).commit).toBe(commit);
    },
  );
});
