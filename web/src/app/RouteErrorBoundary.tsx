import { isRouteErrorResponse, useRouteError } from 'react-router';
import { ErrorState } from '../components/feedback/ErrorState';
import { NotFoundPage } from '../components/layout/NotFoundPage';
import { pageTitle } from '../components/layout/layout.constants';
import { HTTP_NOT_FOUND } from '../lib/api/api.constants';
import { isNotFoundError } from '../lib/api/ApiError';

const ERROR_HEADING = 'Something went wrong';

function isRouteNotFound(error: unknown): boolean {
  const isNotFoundResponse = isRouteErrorResponse(error) && error.status === HTTP_NOT_FOUND;
  return isNotFoundResponse || isNotFoundError(error);
}

function reloadPage(): void {
  window.location.reload();
}

/** Route error boundary inside RootLayout, so header, footer and player stay (LFR-12). */
export function RouteErrorBoundary() {
  const error = useRouteError();
  if (isRouteNotFound(error)) return <NotFoundPage />;
  return (
    <section>
      <title>{pageTitle(ERROR_HEADING)}</title>
      <h1 tabIndex={-1}>{ERROR_HEADING}</h1>
      <ErrorState error={error} onRetry={reloadPage} />
    </section>
  );
}
