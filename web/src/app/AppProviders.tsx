import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { createQueryClient } from './queryClient';

/** Props of AppProviders. */
export interface AppProvidersProps {
  readonly children: ReactNode;
}

/** App-wide providers; holds one QueryClient for the lifetime of the app. */
export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
