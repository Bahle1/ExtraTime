import type { EpisodeListResponse, EpisodeSummary } from '@extratime/shared';
import { DEFAULT_PAGE_SIZE } from '@extratime/shared/constants';
import { EpisodeBuilder } from '@extratime/shared/testing';
import { act, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API_BASE_PATH } from '../../../lib/api/api.constants';
import { testCatalog } from '../../../test/msw/handlers';
import { server } from '../../../test/msw/server';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { EpisodesPage } from './EpisodesPage';

const EPISODES_URL = `${API_BASE_PATH}/episodes`;
const SEARCH_TERM = 'identity';
const SERVER_ERROR = 500;
const RESULTS_HEADING = `Results for “${SEARCH_TERM}”`;
const IDENTITY_TITLE = 'Purpose - Bigger Than Football';
const IDENTITY_BUILDER = new EpisodeBuilder().withCode(1, 3).with({ title: IDENTITY_TITLE });

function listOf(data: EpisodeSummary[]): EpisodeListResponse {
  const meta = { generatedAt: '2026-11-08T09:00:00Z', sources: [...testCatalog.sources] };
  const page = { page: 1, pageSize: DEFAULT_PAGE_SIZE, totalItems: data.length, totalPages: 1 };
  return { data, meta: { ...meta, ...page } };
}

function searchHandler() {
  return http.get(EPISODES_URL, ({ request }) => {
    const q = new URL(request.url).searchParams.get('q');
    const matches =
      q === SEARCH_TERM ? [IDENTITY_BUILDER.buildSummary()] : [...testCatalog.episodeSummaries];
    return HttpResponse.json(listOf(matches));
  });
}

describe('TC-WEB-018 EpisodesPage search and data states', () => {
  it.each([
    {
      state: 'a pending request',
      handler: http.get(EPISODES_URL, () => delay('infinite')),
      find: () => screen.findByRole('status', { busy: true }),
    },
    {
      state: 'no matches',
      handler: http.get(EPISODES_URL, () => HttpResponse.json(listOf([]))),
      find: () => screen.findByText(`No episodes match “${SEARCH_TERM}”`),
    },
    {
      state: 'a 500 response',
      handler: http.get(EPISODES_URL, () => new HttpResponse(null, { status: SERVER_ERROR })),
      find: () => screen.findByRole('button', { name: 'Retry' }),
    },
    {
      state: 'matching episodes',
      handler: searchHandler(),
      find: () => screen.findByRole('link', { name: IDENTITY_TITLE }),
    },
  ])(
    'GIVEN $state WHEN "identity" is submitted with Enter THEN ?q=identity is set and the state renders',
    async ({ handler, find }) => {
      server.use(handler);
      const { router } = renderWithProviders(<EpisodesPage />, { path: '/episodes' });

      const field = screen.getByRole('searchbox', { name: 'Search episodes' });
      await userEvent.type(field, `${SEARCH_TERM}{Enter}`);

      await waitFor(() => expect(router.state.location.search).toBe(`?q=${SEARCH_TERM}`));
      expect(document.activeElement).toBe(field);
      expect(screen.queryByRole('heading', { name: RESULTS_HEADING })).not.toBeNull();
      expect(await find()).not.toBeNull();
    },
  );

  it('GIVEN a reloaded ?q=identity URL WHEN it renders and q later leaves the URL THEN the field and list follow the URL', async () => {
    server.use(searchHandler());
    const path = `/episodes?q=${SEARCH_TERM}`;
    const { router } = renderWithProviders(<EpisodesPage />, { path });

    expect(await screen.findByRole('link', { name: IDENTITY_TITLE })).not.toBeNull();
    const field = screen.getByRole('searchbox', { name: 'Search episodes' });
    expect(field).toHaveProperty('value', SEARCH_TERM);
    expect(screen.getAllByRole('article')).toHaveLength(1);

    await act(() => router.navigate('/episodes'));

    expect(field).toHaveProperty('value', '');
    expect(await screen.findByRole('heading', { level: 2, name: 'All episodes' })).not.toBeNull();
  });
});
