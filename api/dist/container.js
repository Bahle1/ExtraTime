import { pino } from 'pino';
import { systemClock } from './catalog/clock.js';
import { MockCatalogRepository } from './catalog/mock/mock-catalog.repository.js';
import { EpisodesController } from './modules/episodes/episodes.controller.js';
import { EpisodesService } from './modules/episodes/episodes.service.js';
import { HealthController } from './modules/health/health.controller.js';
import { HostsController } from './modules/hosts/hosts.controller.js';
import { HostsService } from './modules/hosts/hosts.service.js';
import { SocialController } from './modules/social/social.controller.js';
import { SocialService } from './modules/social/social.service.js';
const SERVICE_NAME = 'extratime-api';
/** Builds every class by constructor injection. */
export async function createContainer(config, deps = {}) {
    const catalog = deps.catalog ??
        (await MockCatalogRepository.fromDirectory({
            clock: systemClock,
            directory: deps.mockDataDirectory,
        }));
    const episodes = new EpisodesService(catalog);
    const controllers = {
        health: new HealthController(config),
        episodes: new EpisodesController(episodes),
        hosts: new HostsController(new HostsService(catalog, episodes)),
        social: new SocialController(new SocialService(catalog)),
    };
    return Object.freeze({ config, logger: createLogger(config), controllers });
}
function createLogger(config) {
    const { LOG_LEVEL: level, RELEASE_SHA: commit, DATA_SOURCE: dataSource } = config;
    return pino({ level, base: { service: SERVICE_NAME, commit, dataSource } });
}
