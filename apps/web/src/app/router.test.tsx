import { act, fireEvent, screen, within } from '@testing-library/react';
import type { RouteObject } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FOLLOW_LINKS,
  MAIN_CONTENT_ID,
  SITE_NAME,
  SITE_SLOGAN,
} from '../components/layout/layout.constants';
import { NotFoundPage } from '../components/layout/NotFoundPage';
import { ABOUT_CONTACT, ABOUT_STORY } from '../features/about/about.constants';
import { AboutPage } from '../features/about/pages/AboutPage';
import { usePlayerStore } from '../features/player/store/playerStore';
import { HTTP_NOT_FOUND } from '../lib/api/api.constants';
import { ApiError } from '../lib/api/ApiError';
import { testCatalog } from '../test/msw/handlers';
import { renderRoutes } from '../test/renderWithProviders';
import { RootLayout } from './RootLayout';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { routes } from './router';

const ABOUT_HEADING = 'About ExtraTime';
const API_NOT_FOUND = new ApiError({
  kind: 'http',
  status: HTTP_NOT_FOUND,
  type: null,
  title: 'Not Found',
  detail: null,
  instance: '/api/v1/episodes/s03e99-unknown',
});
const NEWEST_TITLE = testCatalog.episodeSummaries[0]?.title ?? '';
const PLAY_NEWEST = `Play ${NEWEST_TITLE}`;

function routesWithThrowingPage(error: unknown): RouteObject[] {
  function ThrowingPage(): never {
    throw error;
  }
  const pages = [
    { path: 'boom', Component: ThrowingPage },
    { path: 'about', Component: AboutPage },
    { path: '*', Component: NotFoundPage },
  ];
  return [
    {
      path: '/',
      Component: RootLayout,
      children: [{ ErrorBoundary: RouteErrorBoundary, children: pages }],
    },
  ];
}

function expectInLayout(heading: string): void {
  const main = within(screen.getByRole('main'));
  expect(main.queryByRole('heading', { level: 1, name: heading })).not.toBeNull();
  expect(screen.queryByRole('banner')).not.toBeNull();
  expect(screen.queryByRole('contentinfo')).not.toBeNull();
}

afterEach(() => {
  usePlayerStore.setState(usePlayerStore.getInitialState(), true);
});

describe('TC-WEB-010 router and RootLayout', () => {
  it.each([{ path: '/no-such-page' }, { path: '/about/team' }])(
    'GIVEN the unknown path $path WHEN the router renders THEN a noindex NotFoundPage renders inside the layout',
    ({ path }) => {
      renderRoutes(routes, path);

      expectInLayout('Page not found');
      const robots = document.head.querySelector('meta[name="robots"]');
      expect(robots?.getAttribute('content')).toBe('noindex');
      expect(document.title).toBe('Page not found | ExtraTime');
    },
  );

  it.each([
    {
      thrown: 'an unexpected error',
      error: new Error('Render failed'),
      heading: 'Something went wrong',
      retries: 1,
    },
    { thrown: 'an API 404', error: API_NOT_FOUND, heading: 'Page not found', retries: 0 },
  ])(
    'GIVEN a page that throws $thrown WHEN it renders THEN the boundary shows "$heading" inside the layout',
    ({ error, heading, retries }) => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      renderRoutes(routesWithThrowingPage(error), '/boom');

      expectInLayout(heading);
      expect(screen.queryAllByRole('button', { name: 'Retry' })).toHaveLength(retries);
    },
  );

  it('GIVEN / WHEN the hero Play latest button is pressed THEN the newest episode plays inside the hero, not in a floating player', async () => {
    renderRoutes(routes, '/');
    const hero = within(screen.getByRole('region', { name: SITE_SLOGAN }));

    fireEvent.click(await hero.findByText(/Play latest/));

    expectInLayout(SITE_SLOGAN);
    expect(document.title).toBe(`${SITE_SLOGAN} | ${SITE_NAME}`);
    expect(hero.queryByTitle(`YouTube video: ${NEWEST_TITLE}`)).not.toBeNull();
    expect(hero.queryByRole('button', { name: PLAY_NEWEST, pressed: true })).not.toBeNull();
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('GIVEN a video plays WHEN the reader opens another page THEN playback stops and the embed is removed', async () => {
    const { router } = renderRoutes(routes, '/');
    const hero = within(screen.getByRole('region', { name: SITE_SLOGAN }));
    fireEvent.click(await hero.findByText(/Play latest/));

    await act(() => router.navigate('/about'));

    expectInLayout(ABOUT_HEADING);
    expect(usePlayerStore.getState().activeKey).toBeNull();
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('GIVEN the first render WHEN the page appears THEN focus is not moved', () => {
    renderRoutes(routes, '/about');

    expect(document.activeElement).toBe(document.body);
  });

  it('GIVEN a rendered page WHEN the pathname changes THEN the new page h1 receives focus', async () => {
    const { router } = renderRoutes(routes, '/no-such-page');

    await act(() => router.navigate('/about'));

    expect(document.activeElement).toBe(
      screen.getByRole('heading', { level: 1, name: ABOUT_HEADING }),
    );
  });

  it('GIVEN focus outside the h1 WHEN only the search parameters change THEN focus stays put', async () => {
    const { router } = renderRoutes(routes, '/about');
    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    skipLink.focus();

    await act(() => router.navigate('/about?from=footer'));

    expect(document.activeElement).toBe(skipLink);
  });

  it('GIVEN /about WHEN it renders THEN it shows the h1, story, slogan and contact link', () => {
    renderRoutes(routes, '/about');

    const main = within(screen.getByRole('main'));
    expectInLayout(ABOUT_HEADING);
    ABOUT_STORY.forEach((paragraph) => expect(main.queryByText(paragraph)).not.toBeNull());
    expect(main.queryByText(SITE_SLOGAN)).not.toBeNull();
    const contact = main.getByRole('link', { name: ABOUT_CONTACT.linkLabel });
    expect(contact.getAttribute('href')).toBe(ABOUT_CONTACT.url);
    expect(document.title).toBe('About | ExtraTime');
  });

  it('GIVEN any page WHEN it renders THEN the skip link is the first focusable element and nav marks the page', () => {
    renderRoutes(routes, '/about');

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    expect(document.body.querySelector('a[href], button')).toBe(skipLink);
    expect(skipLink.getAttribute('href')).toBe(`#${MAIN_CONTENT_ID}`);
    const primary = within(screen.getByRole('navigation', { name: 'Primary' }));
    expect(primary.getByRole('link', { name: 'About' }).getAttribute('aria-current')).toBe('page');
    const footer = within(screen.getByRole('contentinfo'));
    expect(footer.queryByRole('link', { name: ABOUT_HEADING })).not.toBeNull();
  });

  it.each(FOLLOW_LINKS)(
    'GIVEN any page WHEN the footer renders THEN it links $label to $url in a new tab',
    ({ label, url }) => {
      renderRoutes(routes, '/about');

      const footer = within(screen.getByRole('contentinfo'));
      const link = footer.getByRole('link', { name: new RegExp(`^${label} `) });
      expect(link.getAttribute('href')).toBe(url);
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    },
  );
});
