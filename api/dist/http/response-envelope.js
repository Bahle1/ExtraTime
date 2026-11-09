/** Single-resource body: { data, meta }. */
export function singleBody(result) {
    return { data: result.data, meta: metaBody(result.meta) };
}
/** Page-based list body; the page counts join meta. */
export function collectionBody(page) {
    const { items, meta, ...counts } = page;
    return { data: [...items], meta: { ...metaBody(meta), ...counts } };
}
/** Keyset list body; limit and nextCursor join meta. */
export function cursorBody(page) {
    const { items, meta, ...position } = page;
    return { data: [...items], meta: { ...metaBody(meta), ...position } };
}
function metaBody(meta) {
    return { generatedAt: meta.generatedAt, sources: [...meta.sources] };
}
