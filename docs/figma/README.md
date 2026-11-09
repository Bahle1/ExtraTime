# ExtraTime Figma design

A local snapshot of the ExtraTime website design produced in Figma from [`figma-prompt.md`](figma-prompt.md). Use it to compare the build with the design without opening Figma.

| Field | Value |
|---|---|
| Figma file | [Untitled](https://www.figma.com/design/GlgwU4cJMsPOo7luxxDj8g/Untitled?node-id=0-1) |
| File key | `GlgwU4cJMsPOo7luxxDj8g` |
| Version | `2419638554287039684`, last modified 2026-11-09 01:46 UTC |
| Exported | 2026-11-09, through the Figma REST API (full node tree, all 25 frames, 19 components, 12 image fills) |
| Comments in Figma | none at export time |

## Contents

| Path | Format | What it holds |
|---|---|---|
| [figma-prompt.md](figma-prompt.md) | Markdown | The prompt given to Figma's AI to generate the design |
| [structure.md](structure.md) | Markdown | Frame inventory, and each page's sections at desktop and mobile with sizes, auto-layout padding, gaps and fills |
| [journeys.md](journeys.md) | Markdown | The 8 customer-journey boards: hand-off notes, each state and its on-screen copy, mapped to the prompt and the BRD |
| [design-system.md](design-system.md) | Markdown | Colours, type scale, spacing, radii, strokes, the 19 components, and a comparison with the build's tokens |
| [content.md](content.md) | Markdown | Copy deck: every text layer on every page, in order |
| [outline.md](outline.md) | Markdown | The complete layer tree (3,558 nodes) with sizes, layout and text |
| [tokens.json](tokens.json) | JSON (W3C design-token style) | Colours, typography, spacing, radii, strokes and the shared lime style, with usage counts |
| [data/figma-file.json](data/figma-file.json) | JSON | The raw Figma REST response for the whole canvas (signed thumbnail URL removed) |
| [data/frames.json](data/frames.json) | JSON | Frame inventory with sections and render paths |
| [data/components.json](data/components.json) | JSON | The 19 components with sizes, fills, strokes and text (Figma component keys removed) |
| [renders/pages/](renders/pages/) | PNG, 1× | Every page at desktop (1440 px) and mobile (390 px): Home, Episodes archive, Episode detail, Hosts, Host profile, Social, About, 404 |
| [renders/journeys/](renders/journeys/) | PNG, 1× | The 8 journey boards |
| [renders/components/](renders/components/) | PNG | The component sheet (1×) and each component on its own (`library/`, 2×) |
| [assets/images/](assets/images/) | JPEG | The 12 image fills used in the design |

## Notes

- **Placeholders.** Episode artwork, studio photography and social images in the design are placeholders generated in Figma, labelled "Episode artwork · placeholder". They are not ExtraTime's imagery; the site keeps using YouTube thumbnails.
- **Visual mock-ups only.** Playing states draw a mock YouTube player ("YouTube player · visual mockup only"); the site embeds the real `youtube-nocookie` player (LLD §3.6.4).
- **Snapshot.** Figma remains the source of truth. To refresh, re-export with the Figma REST API: `GET /v1/files/GlgwU4cJMsPOo7luxxDj8g/nodes?ids=0:1&depth=40` for the tree, `GET /v1/images/GlgwU4cJMsPOo7luxxDj8g?ids=<frame ids>&format=png` for the renders (frame ids are in `data/frames.json`), and `GET /v1/files/GlgwU4cJMsPOo7luxxDj8g/images` for the image fills. The Markdown files and `tokens.json` were generated from `data/figma-file.json` by a one-off script that is not kept in the repository, so after a refresh regenerate them the same way or edit them by hand.
- **Formatting.** `docs/figma/` is excluded from Prettier because its files are generated.
