import { readFileSync } from 'node:fs';
import type { Request, Response } from 'express';
import { z } from 'zod';
import type { AppConfig } from '../../config/env.js';

const PACKAGE_MANIFEST_URL = new URL('../../../package.json', import.meta.url);
const PackageManifestSchema = z.object({ version: z.string() });

/** GET /api/v1/health body (LFR-10); the shared LivenessSchema replaces it in T2A.13. */
interface Liveness {
  readonly status: 'ok';
  readonly version: string;
  readonly commit: string;
  readonly uptimeSeconds: number;
}

/** Liveness probe: configuration and process uptime only, never the catalog (LNFR-04). */
export class HealthController {
  private readonly version = readPackageVersion();

  constructor(private readonly config: AppConfig) {}

  /** GET /api/v1/health. */
  readonly live = (_request: Request, response: Response): void => {
    response.json(this.liveness());
  };

  private liveness(): Liveness {
    return {
      status: 'ok',
      version: this.version,
      commit: this.config.RELEASE_SHA,
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}

function readPackageVersion(): string {
  const manifest: unknown = JSON.parse(readFileSync(PACKAGE_MANIFEST_URL, 'utf8'));
  return PackageManifestSchema.parse(manifest).version;
}
