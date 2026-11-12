import {
  HostListResponseSchema,
  HostResponseSchema,
  ProblemDetailsSchema,
  problemTypeUri,
} from '@extratime/shared';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createTestApp } from '../support/test-app.js';

const app = await createTestApp();

describe('TC-API-029 GET /api/v1/hosts and /api/v1/hosts/:slug', () => {
  it('GIVEN the mock container WHEN GET hosts THEN a collection in editorial order on one page', async () => {
    const response = await request(app).get('/api/v1/hosts');

    const body = HostListResponseSchema.parse(response.body);
    expect(response.status).toBe(200);
    expect(body.data.map((host) => host.slug)).toEqual(['jordan-reyes', 'sam-okafor']);
    expect(body.meta).toMatchObject({ page: 1, pageSize: 2, totalItems: 2, totalPages: 1 });
  });

  it('GIVEN the mock container WHEN GET a host THEN a HostDetail with recent episode summaries', async () => {
    const response = await request(app).get('/api/v1/hosts/sam-okafor');

    const body = HostResponseSchema.parse(response.body);
    expect(response.status).toBe(200);
    expect(body.data).toMatchObject({ slug: 'sam-okafor', role: 'Co-host' });
    expect(body.data.recentEpisodes.map((episode) => episode.id)).toEqual(['ep_s03e14']);
    expect(response.body.data.recentEpisodes[0]).not.toHaveProperty('description');
  });

  it('GIVEN an unknown slug WHEN GET a host THEN 404 problem+json not-found', async () => {
    const response = await request(app).get('/api/v1/hosts/alex-unknown');

    expect(response.status).toBe(404);
    expect(ProblemDetailsSchema.parse(response.body).type).toBe(problemTypeUri('not-found'));
  });
});
