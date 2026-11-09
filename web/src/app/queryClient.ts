import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '../lib/api/ApiError';

const MAX_RETRIES = 2;
const MIN_SERVER_ERROR_STATUS = 500;

/** Test seam: renderWithProviders passes `{ retry: false }` so errors render on the first failure. */
export interface QueryClientOverrides {
  readonly retry?: false;
}

function isRetryable(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  const { kind, status } = error.fields;
  return kind === 'network' || (status !== null && status >= MIN_SERVER_ERROR_STATUS);
}

function retryTransientFailures(failureCount: number, error: unknown): boolean {
  return failureCount < MAX_RETRIES && isRetryable(error);
}

/** Creates the app's QueryClient: at most 2 retries, only for network failures and 5xx (LFR-13). */
export function createQueryClient(overrides: QueryClientOverrides = {}): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: overrides.retry ?? retryTransientFailures } },
  });
}
