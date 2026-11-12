import type { SourceStatus } from '@extratime/shared';

/** Snapshot metadata carried by every envelope (HLD §4.5). */
export interface EnvelopeMeta {
  readonly generatedAt: string;
  readonly sources: readonly SourceStatus[];
}

/** One resource with its snapshot metadata. */
export interface MetaResult<T> {
  readonly data: T;
  readonly meta: EnvelopeMeta;
}

/** One numbered page with its snapshot metadata. */
export interface NumberedPage<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly meta: EnvelopeMeta;
}

/** One keyset page with its snapshot metadata; nextCursor is null on the last page. */
export interface KeysetPage<T> {
  readonly items: readonly T[];
  readonly limit: number;
  readonly nextCursor: string | null;
  readonly meta: EnvelopeMeta;
}

/** Single-resource body: { data, meta }. */
export function singleBody<T>(result: MetaResult<T>) {
  return { data: result.data, meta: metaBody(result.meta) };
}

/** Page-based list body; the page counts join meta. */
export function collectionBody<T>(page: NumberedPage<T>) {
  const { items, meta, ...counts } = page;
  return { data: [...items], meta: { ...metaBody(meta), ...counts } };
}

/** Keyset list body; limit and nextCursor join meta. */
export function cursorBody<T>(page: KeysetPage<T>) {
  const { items, meta, ...position } = page;
  return { data: [...items], meta: { ...metaBody(meta), ...position } };
}

function metaBody(meta: EnvelopeMeta) {
  return { generatedAt: meta.generatedAt, sources: [...meta.sources] };
}
