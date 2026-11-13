import react from '@vitejs/plugin-react';
import { defaultClientConditions } from 'vite';
import { defineConfig } from 'vitest/config';

const DEV_PORT = 5173;
const PREVIEW_PORT = 4173;
const API_PROXY = { '/api': 'http://localhost:4000' };
/** Hosts allowed besides localhost: Cloudflare Quick Tunnel links and extratime.site with its subdomains. */
const SHARED_HOSTS = ['.trycloudflare.com', '.extratime.site'];

export default defineConfig({
  plugins: [react()],
  resolve: { conditions: ['source', ...defaultClientConditions] },
  server: { port: DEV_PORT, strictPort: true, proxy: API_PROXY, allowedHosts: SHARED_HOSTS },
  preview: { port: PREVIEW_PORT, strictPort: true, proxy: API_PROXY, allowedHosts: SHARED_HOSTS },
  test: {
    name: 'web',
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true,
    unstubGlobals: true,
  },
});
