import { QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter, type RouteObject } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { createQueryClient } from '../app/queryClient';

const DEFAULT_PATH = '/';
const CATCH_ALL_ROUTE = '*';

/** Memory router created for one render. */
export type TestRouter = ReturnType<typeof createMemoryRouter>;

/** Render result plus its router, for location assertions and navigation. */
export type RenderWithRouterResult = RenderResult & { readonly router: TestRouter };

/** Options of renderWithProviders. */
export interface RenderWithProvidersOptions {
  /** Initial URL; defaults to '/'. */
  readonly path?: string;
  /** Route pattern the element mounts at, so it can read params; defaults to '*'. */
  readonly routePath?: string;
}

/** Renders routes in a memory router with a fresh query client that never retries (§3.9.2). */
export function renderRoutes(routes: RouteObject[], path = DEFAULT_PATH): RenderWithRouterResult {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const client = createQueryClient({ retry: false });
  const result = render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return { ...result, router };
}

/** Renders one element as a route, with the providers of renderRoutes. */
export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
): RenderWithRouterResult {
  return renderRoutes([{ path: options.routePath ?? CATCH_ALL_ROUTE, element: ui }], options.path);
}
