import { createBrowserRouter, type RouteObject } from 'react-router';
import { NotFoundPage } from '../components/layout/NotFoundPage';
import { AboutPage } from '../features/about/pages/AboutPage';
import { EpisodeDetailPage } from '../features/episodes/pages/EpisodeDetailPage';
import { EpisodesPage } from '../features/episodes/pages/EpisodesPage';
import { HomePage } from '../features/home/pages/HomePage';
import { HostDetailPage } from '../features/hosts/pages/HostDetailPage';
import { HostsPage } from '../features/hosts/pages/HostsPage';
import { SocialPage } from '../features/social/pages/SocialPage';
import { RootLayout } from './RootLayout';
import { RouteErrorBoundary } from './RouteErrorBoundary';

/** Phase 1 routes; tests mount them with createMemoryRouter(routes, { initialEntries }). */
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        ErrorBoundary: RouteErrorBoundary,
        children: [
          { index: true, Component: HomePage },
          { path: 'episodes', Component: EpisodesPage },
          { path: 'episodes/:slug', Component: EpisodeDetailPage },
          { path: 'hosts', Component: HostsPage },
          { path: 'hosts/:slug', Component: HostDetailPage },
          { path: 'social', Component: SocialPage },
          { path: 'about', Component: AboutPage },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
];

/** Creates the browser router; main.tsx calls it once. */
export function createAppRouter(): ReturnType<typeof createBrowserRouter> {
  return createBrowserRouter(routes);
}
