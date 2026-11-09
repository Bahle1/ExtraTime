const COMBINING_MARKS = /\p{M}/gu;
/** Every active filter matches; q searches title, summary, guests and tags. */
export function matchesEpisodeFilters(episode, filters) {
    const { season, host, platform, q } = filters;
    if (season !== undefined && episode.season !== season)
        return false;
    if (host !== undefined && !episode.hosts.some((summary) => summary.slug === host))
        return false;
    if (platform !== undefined && !episode.platforms.includes(platform))
        return false;
    return q === undefined || searchableText(episode).includes(foldText(q));
}
/** publishedAt, then id, in the sort direction. */
export function compareEpisodes(sort) {
    const direction = sort === '-publishedAt' ? -1 : 1;
    return (a, b) => direction * (Date.parse(a.publishedAt) - Date.parse(b.publishedAt) || compareText(a.id, b.id));
}
function foldText(text) {
    return text.normalize('NFKD').replace(COMBINING_MARKS, '').toLowerCase();
}
function searchableText(episode) {
    const guestNames = episode.guests.map((guest) => guest.name);
    return foldText([episode.title, episode.summary, ...guestNames, ...episode.tags].join('\n'));
}
function compareText(a, b) {
    return Number(a > b) - Number(a < b);
}
