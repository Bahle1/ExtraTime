import type { ReactNode } from 'react';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';

/** The parts of a TanStack Query result that QueryContent reads; plain and infinite queries both fit. */
export interface QueryResultView<TData> {
  readonly data: TData | undefined;
  readonly error: Error | null;
  readonly refetch: () => Promise<unknown>;
}

/** Props of QueryContent. */
export interface QueryContentProps<TData> {
  readonly query: QueryResultView<TData>;
  /** LoadingState text, such as "Loading episodes". */
  readonly loadingLabel: string;
  /** Renders loaded data, including its empty state. */
  readonly children: (data: TData) => ReactNode;
}

/** One block's L and X states (§3.6.5): data wins, so a failed background refetch keeps content. */
export function QueryContent<TData>({ query, loadingLabel, children }: QueryContentProps<TData>) {
  if (query.data !== undefined) return children(query.data);
  if (query.error !== null) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />;
  }
  return <LoadingState label={loadingLabel} />;
}
