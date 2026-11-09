import { defineConfig } from 'vitest/config';

const SOURCE_CONDITIONS = ['source', 'module', 'node', 'development|production'];

export default defineConfig({
  test: {
    env: { TZ: 'Europe/London' },
    projects: [
      { test: { name: 'shared', root: './packages/shared', include: ['src/**/*.test.ts'] } },
      'apps/*',
      {
        resolve: { conditions: SOURCE_CONDITIONS },
        ssr: { resolve: { conditions: SOURCE_CONDITIONS } },
        test: {
          name: 'scripts',
          environment: 'node',
          include: ['scripts/**/*.test.ts'],
          restoreMocks: true,
          unstubGlobals: true,
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['packages/shared/src/**', 'apps/*/src/**', 'scripts/**/*.ts'],
      exclude: ['**/*.test.{ts,tsx}', '**/testing/**', '**/test/**'],
    },
  },
});
