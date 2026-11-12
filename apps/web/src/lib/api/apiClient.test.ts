import { problemTypeUri } from '@extratime/shared/constants';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '../../test/msw/server';
import { API_BASE_PATH, HTTP_NOT_FOUND } from './api.constants';
import { ApiError, isNotFoundError } from './ApiError';
import { getJson } from './apiClient';

const UNKNOWN_SLUG = 's03e99-unknown';
const EPISODES_URL = `${API_BASE_PATH}/episodes`;
const BAD_GATEWAY = 502;
const HTTP_OK = 200;

const NO_PROBLEM = { type: null, title: null, detail: null, instance: null } as const;

function rejectionOf(promise: Promise<unknown>): Promise<unknown> {
  return promise.then(
    () => null,
    (caught: unknown) => caught,
  );
}

describe('TC-WEB-006 getJson', () => {
  it.each([
    {
      response: 'a problem+json 404',
      path: `/episodes/${UNKNOWN_SLUG}`,
      overrides: [],
      fields: {
        kind: 'http',
        status: HTTP_NOT_FOUND,
        type: problemTypeUri('not-found'),
        title: 'Resource not found',
        instance: `${EPISODES_URL}/${UNKNOWN_SLUG}`,
      },
    },
    {
      response: 'an HTML 502',
      path: '/episodes',
      overrides: [
        http.get(EPISODES_URL, () =>
          HttpResponse.html('<h1>Bad gateway</h1>', { status: BAD_GATEWAY }),
        ),
      ],
      fields: { ...NO_PROBLEM, kind: 'http', status: BAD_GATEWAY },
    },
    {
      response: 'a rejected fetch',
      path: '/episodes',
      overrides: [http.get(EPISODES_URL, () => HttpResponse.error())],
      fields: { ...NO_PROBLEM, kind: 'network', status: null, detail: EPISODES_URL },
    },
    {
      response: 'a 200 without an envelope',
      path: '/episodes',
      overrides: [http.get(EPISODES_URL, () => HttpResponse.json([]))],
      fields: {
        ...NO_PROBLEM,
        kind: 'http',
        status: HTTP_OK,
        detail: '/episodes returned no envelope',
      },
    },
  ])(
    'GIVEN $response WHEN getJson runs THEN it rejects with an ApiError of kind $fields.kind',
    async ({ path, overrides, fields }) => {
      server.use(...overrides);

      const error = await rejectionOf(getJson(path));

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ fields });
    },
  );

  it('GIVEN a problem+json 404 WHEN the caller checks it THEN isNotFoundError is true', async () => {
    const error = await rejectionOf(getJson(`/episodes/${UNKNOWN_SLUG}`));

    expect(isNotFoundError(error)).toBe(true);
  });

  it('GIVEN query values WHEN getJson succeeds THEN it requests the base path without undefined values', async () => {
    server.use(
      http.get(EPISODES_URL, ({ request }) =>
        HttpResponse.json({ data: new URL(request.url).search }),
      ),
    );

    const body = await getJson<{ data: string }>('/episodes', {
      query: { page: 2, pageSize: 6, q: undefined },
    });

    expect(body.data).toBe('?page=2&pageSize=6');
  });

  it('GIVEN an aborted signal WHEN getJson runs THEN it rethrows the abort, not an ApiError', async () => {
    const controller = new AbortController();
    controller.abort();

    const error = await rejectionOf(getJson('/episodes', { signal: controller.signal }));

    expect(error).not.toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ name: 'AbortError' });
  });
});
