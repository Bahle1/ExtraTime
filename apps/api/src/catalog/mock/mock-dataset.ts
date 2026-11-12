import {
  EpisodeSchema,
  HostSchema,
  SocialPostSchema,
  SourceStatusListSchema,
  type Episode,
  type SocialPost,
} from '@extratime/shared';
import { z } from 'zod';

const NO_AUDIO_MESSAGE = 'Audio must be null: no audio source exists yet (LQ-17)';

const MockDatasetSchema = z.object({
  episodes: z.array(EpisodeSchema),
  hosts: z.array(HostSchema),
  socialPosts: z.array(SocialPostSchema),
  sourceStatuses: SourceStatusListSchema,
});

/** Validated visual fixtures (LD-17). */
export type MockDataset = z.infer<typeof MockDatasetSchema>;
/** One fixture of the dataset. */
export type MockDatasetKey = keyof MockDataset;
/** Fixture contents as read from disk, before validation. */
export type RawMockDataset = Readonly<Record<MockDatasetKey, unknown>>;

/** File name of each fixture in the mock data directory. */
export const MOCK_DATASET_FILES: Readonly<Record<MockDatasetKey, string>> = {
  episodes: 'episodes.json',
  hosts: 'hosts.json',
  socialPosts: 'social-posts.json',
  sourceStatuses: 'source-statuses.json',
};

/** One defect: fixture file, JSON path such as $[2].media.audio, and why. */
export interface MockDatasetIssue {
  readonly file: string;
  readonly path: string;
  readonly message: string;
}

/** The dataset when every rule holds, else every issue found. */
export type MockDatasetValidation =
  | { readonly ok: true; readonly dataset: MockDataset }
  | { readonly ok: false; readonly issues: readonly MockDatasetIssue[] };

/** Broken fixtures; names every file and JSON path, so startup stops before listen(). */
export class MockDatasetError extends Error {
  constructor(
    readonly issues: readonly MockDatasetIssue[],
    options?: ErrorOptions,
  ) {
    super(`Invalid mock dataset: ${issues.map(formatIssue).join('; ')}`, options);
    this.name = 'MockDatasetError';
  }
}

/** Shared schemas first; then unique ids and slugs, known hosts, related episodes and no audio. */
export function validateMockDataset(raw: RawMockDataset): MockDatasetValidation {
  const parsed = MockDatasetSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, issues: parsed.error.issues.map(toDatasetIssue) };
  const issues = datasetIssues(parsed.data);
  return issues.length === 0 ? { ok: true, dataset: parsed.data } : { ok: false, issues };
}

function datasetIssues({ episodes, hosts, socialPosts }: MockDataset): MockDatasetIssue[] {
  const hostSlugs = new Set(hosts.map((host) => host.slug));
  return [
    ...uniqueIssues('episodes', episodes, ['id', 'slug']),
    ...uniqueIssues('hosts', hosts, ['id', 'slug']),
    ...uniqueIssues('socialPosts', socialPosts, ['id']),
    ...episodes.flatMap((episode, index) => episodeIssues({ episode, index, hostSlugs })),
    ...relatedEpisodeIssues(socialPosts, episodes),
  ];
}

function uniqueIssues<F extends string>(
  key: MockDatasetKey,
  items: readonly Readonly<Record<F, string>>[],
  fields: readonly F[],
): MockDatasetIssue[] {
  return fields.flatMap((field) => {
    const seen = new Set<string>();
    return items.flatMap((item, index) => {
      const value = item[field];
      const duplicate = seen.has(value);
      seen.add(value);
      return duplicate ? [issueAt(key, [index, field], `Duplicate ${field} '${value}'`)] : [];
    });
  });
}

function episodeIssues(at: {
  episode: Episode;
  index: number;
  hostSlugs: ReadonlySet<string>;
}): MockDatasetIssue[] {
  const { episode, index, hostSlugs } = at;
  const unknownHosts = episode.hosts.flatMap((host, position) =>
    hostSlugs.has(host.slug)
      ? []
      : [issueAt('episodes', [index, 'hosts', position, 'slug'], `Unknown host '${host.slug}'`)],
  );
  const audio =
    episode.media.audio === null
      ? []
      : [issueAt('episodes', [index, 'media', 'audio'], NO_AUDIO_MESSAGE)];
  return [...unknownHosts, ...audio];
}

function relatedEpisodeIssues(
  posts: readonly SocialPost[],
  episodes: readonly Episode[],
): MockDatasetIssue[] {
  const slugById = new Map(episodes.map((episode) => [episode.id, episode.slug]));
  return posts.flatMap((post, index) => {
    const { relatedEpisodeId: id, relatedEpisodeSlug: slug } = post;
    if (id === null || slugById.get(id) === slug) return [];
    const message = `No episode has id '${id}' and slug '${String(slug)}'`;
    return [issueAt('socialPosts', [index, 'relatedEpisodeId'], message)];
  });
}

function toDatasetIssue(issue: z.core.$ZodIssue): MockDatasetIssue {
  const [key, ...path] = issue.path;
  const file = isDatasetKey(key) ? MOCK_DATASET_FILES[key] : 'dataset';
  return { file, path: formatJsonPath(path), message: issue.message };
}

function issueAt(
  key: MockDatasetKey,
  path: readonly PropertyKey[],
  message: string,
): MockDatasetIssue {
  return { file: MOCK_DATASET_FILES[key], path: formatJsonPath(path), message };
}

function isDatasetKey(value: unknown): value is MockDatasetKey {
  return Object.keys(MOCK_DATASET_FILES).some((key) => key === value);
}

function formatJsonPath(path: readonly PropertyKey[]): string {
  const segments = path.map((segment) =>
    typeof segment === 'number' ? `[${String(segment)}]` : `.${String(segment)}`,
  );
  return `$${segments.join('')}`;
}

function formatIssue(issue: MockDatasetIssue): string {
  return `${issue.file} ${issue.path}: ${issue.message}`;
}
