import { HostDetailSchema, HostSchema, } from '../../schemas/host.schema.js';
import goldenHost from '../golden/host.jordan-reyes.json' with { type: 'json' };
const GOLDEN_HOST = HostSchema.parse(goldenHost);
/** Fluent builder of valid Hosts; defaults to golden Jordan Reyes. */
export class HostBuilder {
    fields = GOLDEN_HOST;
    /** Overrides fields of the default host. */
    with(overrides) {
        this.fields = { ...this.fields, ...overrides };
        return this;
    }
    /** Builds and validates the Host. */
    build() {
        return HostSchema.parse(this.fields);
    }
    /** Builds and validates the HostDetail with the given recent episodes, newest first. */
    buildDetail(recentEpisodes) {
        return HostDetailSchema.parse({ ...this.fields, recentEpisodes });
    }
}
