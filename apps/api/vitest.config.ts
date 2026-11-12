import { defineConfig } from 'vitest/config';

const SOURCE_CONDITIONS = ['source', 'module', 'node', 'development|production'];

export default defineConfig({
  resolve: { conditions: SOURCE_CONDITIONS },
  ssr: { resolve: { conditions: SOURCE_CONDITIONS } },
  test: { name: 'api', environment: 'node', restoreMocks: true, unstubGlobals: true },
});
