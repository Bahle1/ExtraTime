# Mock data: visual fixtures

`MockCatalogRepository.fromDirectory` reads these four files when the API starts with `DATA_SOURCE=mock` (the default), validates them with `validateMockDataset` and serves them as one frozen snapshot (LLD §3.5.6, LD-17). A broken file stops startup before `listen()` with a `MockDatasetError` naming the file and JSON path; `committed-dataset.test.ts` (TC-API-016) checks the committed files in `npm run verify`. `npm run dev` restarts the API when a file here changes, so degraded states are shown by editing data, never by code.

The fixtures are visual only: no audio, no local images or media, no latency or failure simulation.

## Source

Every episode and host fact comes from the public ExtraTIME YouTube channel ([@extratimeorg](https://www.youtube.com/@extratimeorg), channel ID `UCSiJFaUsB6NwpkfO3GSZ5_A`), captured on 2026-11-08 from the public channel feed, watch pages and oEmbed in [`docs/archive/channel-facts-2026-11-08.json`](../../../../../docs/archive/channel-facts-2026-11-08.json). Corrections go through LQ-01 (episodes) and LQ-11 (hosts); see the LLD, §5.

## Files

| File                   | Contents                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `episodes.json`        | The 7 public videos, newest first                                                               |
| `hosts.json`           | The founders, Shungu Dutiro and Henry Nzuzi, in editorial order                                 |
| `social-posts.json`    | 12 posts (8 Instagram, 4 YouTube; 6 related to an episode), newest first                        |
| `source-statuses.json` | One status per platform in `PLATFORMS` order; Facebook `disabled` (no Page is confirmed, LQ-24) |

## Derivation rules

**Episodes** (one per video in the channel facts):

- `title`, `description`, `durationSeconds` and `updatedAt` as published; `+00:00` timestamps rewritten to `Z`.
- `artwork` is the video's 480x360 `hqdefault` thumbnail on `i.ytimg.com`; `alt` is "Episode artwork for {title}" without emoji.
- `media`: audio `null`, preferred `youtube`, the `youtube-nocookie.com/embed/{videoId}` embed and the watch URL (all 7 videos are embeddable).
- `summary`: the first paragraph of the description, cut at a word boundary to at most 280 characters with an ellipsis only when cut.
- One YouTube `sources` entry with the captured views and likes (comments not captured: `null`), `fetchedAt` 2026-11-08; `chapters` is empty because no description carries timestamps.
- Episode codes only where the channel states them (HLD A7, LQ-01): "JOURNEY" (described as the first episode of a 5-part Season 1) is S01E01 and "AUTHENTICITY" ("this second episode") is S01E02. "Purpose - Bigger Than Football", its Pt.2 and "Full Circle - Coach Pitso Mosimane" stay uncoded because their artwork numbers them Episode 5 Parts I-II and Episode 6, which the Content Team has not yet confirmed. "Meet The Founders || Passion to Purpose" is the uncoded `trailer` and the Kinshasa special the uncoded `bonus`.
- Ids and slugs follow LD-06 by hand: coded `ep_s01e01` and `s01e01-{kebab(title)}`; uncoded `ep_yt_{videoId}` and `kebab(title)`, cut at a hyphen to at most 60 characters.
- `hosts`: both founders, except the Kinshasa special, presented by Daniel and Haggi, who are guests with unknown descriptions (`null`) per the LQ-11 default.
- `guests` and their descriptions, and `tags`, are taken from each description's own words (the Kinshasa tags are its hashtags without `#extratime`).

**Hosts:** `role` follows the default line-up (Lead host, then Co-host, in the channel facts' founder order); `shortBio` and `bio` use only public channel text (the "Meet The Founders" description and the channel mission); `avatar` and `favoriteClub` are `null` (initials avatars until consented photos, T3C.11); `socialLinks` are the channel's YouTube and Instagram accounts, as no personal accounts are public.

**Social posts:** the channel facts hold no individual posts, so the 12 posts are visual stand-ins built from the episodes:

- Media reuse the episodes' `hqdefault` thumbnails; Instagram videos have a `null` media URL and keep the thumbnail.
- Captions quote the video descriptions; one Instagram caption is `null`.
- Instagram posts (`sp_ig_fixture-NN`) link to the [@extra.timeorg](https://www.instagram.com/extra.timeorg/) profile, have `null` metrics and fixture timestamps placed around their episode's release.
- YouTube posts (`sp_yt_{videoId}`) link to the watch page, carry the video's publish time and captured views and likes.
- The 4 YouTube posts and 2 Instagram posts are related to their episode; the other 6 are unmatched, as many real posts will be.

**Source statuses:** YouTube and Instagram `ok` with `lastSuccessAt` 2026-11-08; Facebook `disabled` with `lastSuccessAt` `null`. Edit a status (for example Instagram to `stale`) to see a degraded source; the visible notice arrives with IB-01.
