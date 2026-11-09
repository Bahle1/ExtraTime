# Platform onboarding checklist

Onboarding gate OB-1 to OB-8 (LLD LD-22; HLD §4.6 "Onboarding prerequisites" and §5.5, with the LQ-27 date amendments). The onboarding track (product owner plus one engineer) runs in parallel with Phase 1 from week 1 and is the critical path to live data.

- **Phase 2 entry (2026-12-07)** needs OB-1, OB-2 and OB-4 to OB-6; otherwise Phase 2 starts YouTube-only (LFR-43).
- **Phase 3 entry (2027-01-18)** needs OB-8.
- Named owners are set at the Phase 0 exit review (2026-11-13); the Engineering Lead reviews this file at the 2026-11-25 checkpoint.

## Checklist

| ID   | Item                                                                                                                                                | Owner role         | Named owner | Due        | Status      | Unblocks                                    |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- | ---------- | ----------- | ------------------------------------------- |
| OB-1 | GitHub organization (Team plan), private repository and branch protection on `main` (HLD Q9, LQ-03)                                                 | Engineering Lead   | TBC         | 2026-12-07 | Not started | T2A.11 CI; `origin` moves off the bare repo |
| OB-2 | The business owns the YouTube channel, the Instagram professional account and any Facebook Page, each with two or more admins (LQ-18, LQ-24)        | CEO                | TBC         | 2026-11-20 | Not started | OB-4; Meta access (R1, R14)                 |
| OB-3 | Consented host photos; real bios if ready (HLD Q18, LQ-11); Phase 1 uses initials avatars and public channel text                                   | Content Team       | TBC         | 2027-01-18 | Not started | `public/images/hosts/` (Phase 3)            |
| OB-4 | Meta business portfolio, Development-mode app with Standard Access, admin and developer roles; Instagram professional account linked to the Page    | Product owner      | TBC         | 2026-11-27 | Not started | OB-5 Meta tokens; T2A.1 spike               |
| OB-5 | Google Cloud project with restricted YouTube Data API keys; Meta tokens minted; one test call per platform (steps below)                            | Engineering Lead   | TBC         | 2026-12-04 | Not started | Phase 2 clients; per-developer `.env`       |
| OB-6 | Privacy policy and data-deletion instructions at an interim public URL (required by the Meta app); `/privacy` and `/data-deletion` follow at launch | CEO; Legal adviser | TBC         | 2026-12-04 | Not started | Meta app setup; T3C.3                       |
| OB-7 | Publishing conventions: the episode code (for example `S01E05`) in YouTube titles and social captions (HLD A7, LQ-14)                               | Content lead       | TBC         | 2026-12-04 | Not started | Matching and host filters (T2B.2, T2B.5)    |
| OB-8 | Company AWS account; GitHub OIDC and environments                                                                                                   | Engineering Lead   | TBC         | 2027-01-18 | Not started | Phase 3 stacks (T3A.1)                      |

This combination (owned assets, Development-mode app, Standard Access) needs no App Review or Business Verification; re-check if third-party accounts or Advanced Access are ever needed (HLD §4.6).

## Credential rules

- Secrets live only in the git-ignored root `.env` (variable names in LLD Appendix C) and, from Phase 3, in Secrets Manager. Never commit, paste into chat or tickets, or log a token.
- Prefer loading values from `.env` (`set -a; . ./.env; set +a`) over typing them on the command line, so they stay out of shell history.
- Revoke laptop tokens at go-live (T3D.2).

## OB-5: YouTube Data API key and test call

As of Nov 2026 — verify.

1. In the company Google Cloud project, enable **YouTube Data API v3**.
2. Create one API key per developer and per environment; restrict it to the YouTube Data API v3 (staging and production keys also get an IP or referrer restriction in Phase 3).
3. Put the key in `.env` as `YOUTUBE_API_KEY`, and the channel ID `UCSiJFaUsB6NwpkfO3GSZ5_A` (`docs/archive/channel-facts-2026-11-08.json`) as `YOUTUBE_CHANNEL_ID`.
4. Test call (1 quota unit): the response lists the channel's uploads playlist.

   ```bash
   set -a; . ./.env; set +a
   curl -sG https://www.googleapis.com/youtube/v3/channels \
     --data-urlencode part=contentDetails \
     --data-urlencode "id=${YOUTUBE_CHANNEL_ID}" \
     --data-urlencode "key=${YOUTUBE_API_KEY}"
   ```

## OB-5: Meta tokens with the Graph API Explorer

As of Nov 2026 — verify; Graph API `v27.0`. These steps mint per-developer tokens for local development. The production default (non-expiring system-user or Page tokens) and re-minting after error 190 are covered by `docs/runbooks/meta-token-remint.md` (T2A.7); the login mode (Unified Login or Facebook Login for Business) is decided by the T2A.1 spike (LQ-07).

Prerequisites: OB-2 and OB-4 done; you hold a developer or admin role on the app and a task role on the Page and Instagram account.

1. Open the [Graph API Explorer](https://developers.facebook.com/tools/explorer/), select the ExtraTime app under **Meta App** and **User Token** under **User or Page**.
2. Add only read scopes: `pages_show_list`, `pages_read_engagement`, `pages_read_user_content`, `instagram_basic` and `business_management`. Never add `instagram_manage_messages`, which exposes fans' direct messages (LQ-07).
3. Select **Generate Access Token** and grant access to the ExtraTime Page and Instagram account only. The result is a short-lived user token (about one hour).
4. Put `META_APP_ID`, `META_APP_SECRET` and the short-lived token (`META_SHORT_LIVED_TOKEN`, a temporary variable) in `.env`, then exchange it for a long-lived user token (about 60 days):

   ```bash
   set -a; . ./.env; set +a
   curl -sG https://graph.facebook.com/v27.0/oauth/access_token \
     --data-urlencode grant_type=fb_exchange_token \
     --data-urlencode "client_id=${META_APP_ID}" \
     --data-urlencode "client_secret=${META_APP_SECRET}" \
     --data-urlencode "fb_exchange_token=${META_SHORT_LIVED_TOKEN}"
   ```

5. With the long-lived user token (`META_USER_TOKEN` in `.env`), list the Pages: `GET /v27.0/me/accounts`. A Page token taken from a long-lived user token does not expire; store it as `FACEBOOK_PAGE_ACCESS_TOKEN` and the Page `id` as `FACEBOOK_PAGE_ID` (skip while no Page exists, LQ-24).
6. Find the Instagram professional account: `GET /v27.0/{FACEBOOK_PAGE_ID}?fields=instagram_business_account`; store its `id` as `INSTAGRAM_USER_ID` and the token used by the chosen login mode as `INSTAGRAM_ACCESS_TOKEN`.
7. Check every token: `GET /v27.0/debug_token?input_token={token}` authenticated with the app token `{META_APP_ID}|{META_APP_SECRET}`. Expect `is_valid: true`, only the scopes above, and `expires_at: 0` for the Page token.
8. Test call per platform, then delete `META_SHORT_LIVED_TOKEN` and `META_USER_TOKEN` from `.env`:
   - Instagram: `GET /v27.0/{INSTAGRAM_USER_ID}/media?fields=id,caption,media_type,media_product_type,permalink,timestamp&limit=1`
   - Facebook: `GET /v27.0/{FACEBOOK_PAGE_ID}/published_posts?limit=1`
9. Record the date, the scopes granted and the token expiry (not the token) in the OB-5 row above.
