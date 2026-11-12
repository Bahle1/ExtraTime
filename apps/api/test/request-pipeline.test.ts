import { ProblemDetailsSchema, problemTypeUri } from '@extratime/shared';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { CatalogRepository } from '../src/catalog/catalog.repository.js';
import { NotFoundError, ValidationError } from '../src/http/domain-errors.js';
import { toProblemDetails } from '../src/http/problem-details.js';
import { captureLogs, createTestApp } from './support/test-app.js';

const PINO_INFO = 30;
const PINO_ERROR = 50;
const INSTANCE = '/api/v1/episodes';
const SECRET_MESSAGE = 'snapshot store unreachable at 10.0.0.7';
const FIELD_ERROR = { path: 'query.pageSize', message: 'Too big' };
const failingCatalog: CatalogRepository = {
  getSnapshot: () => Promise.reject(new Error(SECRET_MESSAGE)),
};

describe('TC-API-007 toProblemDetails', () => {
  it.each([
    {
      error: 'ValidationError',
      thrown: new ValidationError([FIELD_ERROR]),
      expected: {
        status: 400,
        type: 'validation-error',
        title: 'Invalid request',
        errors: [FIELD_ERROR],
      },
    },
    {
      error: 'NotFoundError',
      thrown: new NotFoundError("No episode matches the slug 's03e99-unknown'."),
      expected: { status: 404, type: 'not-found', title: 'Resource not found' },
    },
    {
      error: 'an unexpected Error',
      thrown: new Error(SECRET_MESSAGE),
      expected: { status: 500, type: 'internal-error', title: 'Internal server error' },
    },
    {
      error: 'a thrown string',
      thrown: SECRET_MESSAGE,
      expected: { status: 500, type: 'internal-error', title: 'Internal server error' },
    },
  ] as const)(
    'GIVEN $error WHEN rendered THEN it carries the catalogue status, type and title without a stack',
    ({ thrown, expected }) => {
      const problem = ProblemDetailsSchema.parse(toProblemDetails(thrown, INSTANCE));

      expect(problem).toMatchObject({ ...expected, type: problemTypeUri(expected.type) });
      expect(problem).toMatchObject({ instance: INSTANCE, requestId: null });
      expect(JSON.stringify(problem)).not.toMatch(/stack|10\.0\.0\.7|at .+\.ts/);
    },
  );
});

describe('TC-API-009 not-found and error-handler', () => {
  it.each([
    {
      route: 'an unknown path',
      path: '/api/v1/nope',
      catalog: undefined,
      status: 404,
      level: PINO_INFO,
    },
    {
      route: 'a throwing route',
      path: '/api/v1/episodes',
      catalog: failingCatalog,
      status: 500,
      level: PINO_ERROR,
    },
  ])(
    'GIVEN $route WHEN requested THEN $status problem+json, no-store, and exactly one log line',
    async ({ path, catalog, status, level }) => {
      const { logger, lines } = captureLogs();

      const response = await request(await createTestApp({ catalog, logger })).get(path);

      expect(response.status).toBe(status);
      expect(response.headers['content-type']).toBe('application/problem+json; charset=utf-8');
      expect(response.headers['cache-control']).toBe('no-store');
      expect(ProblemDetailsSchema.parse(response.body)).toMatchObject({ status, instance: path });
      expect(response.text).not.toContain(SECRET_MESSAGE);
      expect(lines).toHaveLength(1);
      expect(lines[0]).toMatchObject({ level, err: expect.any(Object) });
    },
  );

  it('GIVEN a health check WHEN requested THEN nothing is logged', async () => {
    const { logger, lines } = captureLogs();

    await request(await createTestApp({ logger }))
      .get('/api/v1/health')
      .expect(200);

    expect(lines).toHaveLength(0);
  });

  it('GIVEN a successful read WHEN requested THEN one info line is logged', async () => {
    const { logger, lines } = captureLogs();

    await request(await createTestApp({ logger }))
      .get('/api/v1/episodes')
      .expect(200);

    expect(lines).toEqual([
      expect.objectContaining({ level: PINO_INFO, msg: 'request completed' }),
    ]);
  });
});

describe('TC-API-011 validateRequest with a strict schema', () => {
  it.each([
    { input: 'two unknown keys', query: '?foo=1&bar=2', paths: ['query.foo', 'query.bar'] },
    { input: 'an out-of-range value', query: '?page=0', paths: ['query.page'] },
    {
      input: 'an unknown key on a route without parameters',
      query: '?page=1',
      route: '/api/v1/hosts',
      paths: ['query.page'],
    },
  ])(
    'GIVEN $input WHEN requested THEN 400 validation-error at $paths',
    async ({ query, route = '/api/v1/episodes', paths }) => {
      const response = await request(await createTestApp()).get(`${route}${query}`);

      const problem = ProblemDetailsSchema.parse(response.body);
      expect(response.status).toBe(400);
      expect(problem.type).toBe(problemTypeUri('validation-error'));
      expect(problem.errors?.map((error) => error.path)).toEqual(paths);
    },
  );
});
