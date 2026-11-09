import { readFileSync } from 'node:fs';
import { z } from 'zod';
const PACKAGE_MANIFEST_URL = new URL('../../../package.json', import.meta.url);
const PackageManifestSchema = z.object({ version: z.string() });
/** Liveness probe: configuration and process uptime only, never the catalog (LNFR-04). */
export class HealthController {
    config;
    version = readPackageVersion();
    constructor(config) {
        this.config = config;
    }
    /** GET /api/v1/health. */
    live = (_request, response) => {
        response.json(this.liveness());
    };
    liveness() {
        return {
            status: 'ok',
            version: this.version,
            commit: this.config.RELEASE_SHA,
            uptimeSeconds: Math.floor(process.uptime()),
        };
    }
}
function readPackageVersion() {
    const manifest = JSON.parse(readFileSync(PACKAGE_MANIFEST_URL, 'utf8'));
    return PackageManifestSchema.parse(manifest).version;
}
