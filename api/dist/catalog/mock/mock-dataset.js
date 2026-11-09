import { EpisodeSchema, HostSchema, SocialPostSchema, SourceStatusListSchema, } from '@extratime/shared';
import { z } from 'zod';
const NO_AUDIO_MESSAGE = 'Audio must be null: no audio source exists yet (LQ-17)';
const MockDatasetSchema = z.object({
    episodes: z.array(EpisodeSchema),
    hosts: z.array(HostSchema),
    socialPosts: z.array(SocialPostSchema),
    sourceStatuses: SourceStatusListSchema,
});
/** File name of each fixture in the mock data directory. */
export const MOCK_DATASET_FILES = {
    episodes: 'episodes.json',
    hosts: 'hosts.json',
    socialPosts: 'social-posts.json',
    sourceStatuses: 'source-statuses.json',
};
/** Broken fixtures; names every file and JSON path, so startup stops before listen(). */
export class MockDatasetError extends Error {
    issues;
    constructor(issues, options) {
        super(`Invalid mock dataset: ${issues.map(formatIssue).join('; ')}`, options);
        this.issues = issues;
        this.name = 'MockDatasetError';
    }
}
/** Shared schemas first; then unique ids and slugs, known hosts, related episodes and no audio. */
export function validateMockDataset(raw) {
    const parsed = MockDatasetSchema.safeParse(raw);
    if (!parsed.success)
        return { ok: false, issues: parsed.error.issues.map(toDatasetIssue) };
    const issues = datasetIssues(parsed.data);
    return issues.length === 0 ? { ok: true, dataset: parsed.data } : { ok: false, issues };
}
function datasetIssues({ episodes, hosts, socialPosts }) {
    const hostSlugs = new Set(hosts.map((host) => host.slug));
    return [
        ...uniqueIssues('episodes', episodes, ['id', 'slug']),
        ...uniqueIssues('hosts', hosts, ['id', 'slug']),
        ...uniqueIssues('socialPosts', socialPosts, ['id']),
        ...episodes.flatMap((episode, index) => episodeIssues({ episode, index, hostSlugs })),
        ...relatedEpisodeIssues(socialPosts, episodes),
    ];
}
function uniqueIssues(key, items, fields) {
    return fields.flatMap((field) => {
        const seen = new Set();
        return items.flatMap((item, index) => {
            const value = item[field];
            const duplicate = seen.has(value);
            seen.add(value);
            return duplicate ? [issueAt(key, [index, field], `Duplicate ${field} '${value}'`)] : [];
        });
    });
}
function episodeIssues(at) {
    const { episode, index, hostSlugs } = at;
    const unknownHosts = episode.hosts.flatMap((host, position) => hostSlugs.has(host.slug)
        ? []
        : [issueAt('episodes', [index, 'hosts', position, 'slug'], `Unknown host '${host.slug}'`)]);
    const audio = episode.media.audio === null
        ? []
        : [issueAt('episodes', [index, 'media', 'audio'], NO_AUDIO_MESSAGE)];
    return [...unknownHosts, ...audio];
}
function relatedEpisodeIssues(posts, episodes) {
    const slugById = new Map(episodes.map((episode) => [episode.id, episode.slug]));
    return posts.flatMap((post, index) => {
        const { relatedEpisodeId: id, relatedEpisodeSlug: slug } = post;
        if (id === null || slugById.get(id) === slug)
            return [];
        const message = `No episode has id '${id}' and slug '${String(slug)}'`;
        return [issueAt('socialPosts', [index, 'relatedEpisodeId'], message)];
    });
}
function toDatasetIssue(issue) {
    const [key, ...path] = issue.path;
    const file = isDatasetKey(key) ? MOCK_DATASET_FILES[key] : 'dataset';
    return { file, path: formatJsonPath(path), message: issue.message };
}
function issueAt(key, path, message) {
    return { file: MOCK_DATASET_FILES[key], path: formatJsonPath(path), message };
}
function isDatasetKey(value) {
    return Object.keys(MOCK_DATASET_FILES).some((key) => key === value);
}
function formatJsonPath(path) {
    const segments = path.map((segment) => typeof segment === 'number' ? `[${String(segment)}]` : `.${String(segment)}`);
    return `$${segments.join('')}`;
}
function formatIssue(issue) {
    return `${issue.file} ${issue.path}: ${issue.message}`;
}
