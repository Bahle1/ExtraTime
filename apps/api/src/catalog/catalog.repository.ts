import type { Episode, Host, SocialPost, SourceStatus } from '@extratime/shared';

/** Envelope metadata of one snapshot. */
export interface SnapshotMeta {
  readonly generatedAt: string;
  readonly sources: readonly SourceStatus[];
}

/** Immutable catalog, replaced by one reference swap. */
export interface CatalogSnapshot {
  readonly episodes: readonly Episode[];
  readonly hosts: readonly Host[];
  readonly socialPosts: readonly SocialPost[];
  readonly meta: SnapshotMeta;
}

/** One item with its snapshot metadata. */
export interface CatalogResult<T> {
  readonly data: T;
  readonly meta: SnapshotMeta;
}

/** One numbered page. */
export interface CatalogPage<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly meta: SnapshotMeta;
}

/** One keyset page; nextCursor is null on the last page. */
export interface CatalogCursorPage<T> {
  readonly items: readonly T[];
  readonly limit: number;
  readonly nextCursor: string | null;
  readonly meta: SnapshotMeta;
}

/** Service read boundary; never calls platforms. */
export interface CatalogRepository {
  /** Mock resolves at once; live waits up to 10 s for the first snapshot (T2B.10). */
  getSnapshot(): Promise<CatalogSnapshot>;
}
