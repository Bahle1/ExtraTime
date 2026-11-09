# ExtraTime

_The conversation beyond the game._

The ExtraTime website: a React single-page app and an Express API in one npm-workspaces monorepo. Phase 1 serves visual fixtures through the final `/api/v1` contract; live platform data follows in Phase 2.

## First run

Prerequisites: macOS with git and Node.js 26 (pinned in `.nvmrc` and `mise.toml`; `engine-strict` rejects other versions).

```bash
nvm use            # or: mise install
npm ci
npm run dev
```

Open http://localhost:5173. The API listens on http://localhost:4000 (liveness: http://localhost:4000/api/v1/health) and Vite proxies only `/api` to it. No build step or `.env` is needed; to override defaults, copy `.env.example` to `.env` (git-ignored).

## Scripts

| Script              | Runs                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `npm run dev`       | API (`tsx watch`, resolves `@extratime/shared` from source) and Vite dev server together |
| `npm run build`     | `@extratime/shared`, then the API (`tsc`) and the web app (`vite build`) into `dist/`    |
| `npm run lint`      | ESLint with zero warnings, then `prettier --check`                                       |
| `npm run typecheck` | `tsc -b` over shared, API and web                                                        |
| `npm test`          | Every Vitest project once; `npm test -- --coverage` reports coverage                     |
| `npm run verify`    | `lint`, `typecheck` and `test`: the gate before every merge                              |

## Workspaces

| Path              | Package             | Purpose                                                    |
| ----------------- | ------------------- | ---------------------------------------------------------- |
| `packages/shared` | `@extratime/shared` | Zod schemas, types and constants of the `/api/v1` contract |
| `apps/api`        | `@extratime/api`    | Express API on port 4000                                   |
| `apps/web`        | `@extratime/web`    | React SPA on port 5173 (`vite preview`: 4173)              |

## Configuration

The API reads only the variables below (validated at startup by `apps/api/src/config/env.ts`); the web app reads none. Later variables are listed in the LLD, Appendix C.

| Variable      | Default       | Notes                                  |
| ------------- | ------------- | -------------------------------------- |
| `PORT`        | `4000`        | 1 to 65535                             |
| `LOG_LEVEL`   | `info`        | pino level, or `silent`                |
| `NODE_ENV`    | `development` | `development`, `test` or `production`  |
| `RELEASE_SHA` | `dev`         | 40-character git SHA in release images |
| `DATA_SOURCE` | `mock`        | Only `mock` until Phase 2              |

## Working agreement

- One task = one branch and one squashed commit `type(scope): summary (T1A.3)`, tests included; run `npm run verify` before review.
- Engineering conventions, task list and test catalog: [LLD](docs/design/football-podcast-website-lld.md) §3.3, §4 and Appendix B.

## Documents

- [High-level design](docs/design/football-podcast-website-hld.md)
- [Low-level design](docs/design/football-podcast-website-lld.md) (tasks, conventions, tests)
- [Business requirements](docs/design/football-podcast-website-brd.md)
- [Platform onboarding checklist](docs/runbooks/platform-onboarding.md)
