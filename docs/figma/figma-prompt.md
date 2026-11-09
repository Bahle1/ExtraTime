# Figma prompt: ExtraTime website design and customer journeys

Paste the prompt below into Figma's AI chat (Figma Make or First Draft). Attach screenshots of the two reference sites if the tool accepts images. The prompt describes their patterns in words, so it also works without them.

```text
Design a responsive website and clickable prototype for ExtraTime, a football conversation series. Produce desktop frames at 1440 px wide and mobile frames at 390 px wide, a small component library, and prototype flows for the customer journeys listed at the end.

ABOUT EXTRATIME
- Name: ExtraTime (written "ExtraTIME" on its channels). Slogan: "The conversation beyond the game".
- Mission: help young people see their value beyond what they do on the pitch, through honest conversations with coaches, players and creatives about identity, purpose, mentorship and life after the final whistle.
- Founders and hosts: Shungu Dutiro and Henry Nzuzi. No host photos yet, so use bold initials monograms.
- Channels: YouTube @extratimeorg; Instagram and TikTok @extra.timeorg. No Facebook Page yet.
- Audience: football fans and young players aged 16-25, mostly on mobile and often arriving from an Instagram or TikTok link.
- Real episodes (newest first; use these exact titles):
  1. "Plus que le football : construire son identité | ExtraTime Kinshasa" (22 Apr 2026, 50 min, French-language special presented by Daniel and Haggi)
  2. "Full Circle - Coach Pitso Mosimane" (8 Jul 2025, 58 min)
  3. "Purpose - Bigger Than Football Pt.2" (22 May 2025, 42 min, Coach Cavin Johnson and Jesse Donn)
  4. "Purpose - Bigger Than Football" (19 Mar 2025, 33 min, Coach Cavin Johnson and former Bafana Bafana player Jesse Donn)
  5. "Meet The Founders || Passion to Purpose" (17 Feb 2025, 16 min)
  6. "AUTHENTICITY" (14 Oct 2024, 24 min, visual artist Kay Kay Ribane)
  7. "JOURNEY" (10 Jun 2024, 67 min, first episode of Season 1)
- Episode artwork is 16:9 YouTube thumbnails with lime-green and black graphics. Use placeholder 16:9 images, desaturated to black and white in large hero and feature panels.

LAYOUT AND INTERACTION INSPIRATION (bold football-culture podcast style)
- Fixed header: 86 px tall, shrinking to 68 px on scroll with a 92% black background and a 1 px hairline. Wordmark on the left. Small uppercase nav links with wide letter spacing: Episodes, Hosts, Social, About. One solid accent "Watch" button on the right. On mobile, a hamburger opens a full-screen black menu with huge uppercase links.
- Hero: full viewport height. Copy column on the left; a large black-and-white episode image filling the right two-thirds, with subtle film grain. Small uppercase eyebrow ("FOOTBALL CONVERSATIONS · SINCE 2024"). A giant three-line stacked uppercase headline, "THE CONVERSATION / BEYOND / THE GAME.", with "BEYOND" in the accent color. A primary accent button "Play latest" and a secondary underlined text link "Explore episodes". In the bottom-right corner, a white badge: "LATEST · KINSHASA SPECIAL".
- A scrolling ticker band in the accent color with black, heavy uppercase text: "IDENTITY — PURPOSE — MENTORSHIP — FOOTBALL — LIFE BEYOND THE GAME —". It stops for users who prefer reduced motion.
- About split: a big three-line uppercase heading ("MORE THAN FOOTBALL. / OUR STORIES. / YOUR NEXT CHAPTER.") on the left, and the mission text plus an "About ExtraTime" link on the right.
- "Meet the founders": section heading with the second line in the accent color, a line of names, and two large host cards with an initials monogram, name, role and "View profile".
- "The latest conversations": a horizontal, swipeable carousel of large episode cards with arrow buttons and a "Swipe or scroll for more" hint. Each card shows artwork, a mono meta line ("EP. 01 · 67 MIN" or "SPECIAL · 50 MIN"), a heavy uppercase title, guests, a round accent play button and "Watch on YouTube".
- "Ways in": three tall color-blocked tiles side by side (solid accent; paper white; a photo tile). They hold "Season 1 — the Journey series", "Purpose — Bigger Than Football (two parts)" and "ExtraTime Specials — Kinshasa". Each has a number, title, a mono meta line and a link.
- "At our table": two large featured-guest cards (Coach Pitso Mosimane; Coach Cavin Johnson and Jesse Donn). Each has a black-and-white image on top; a color block with the guest's name in two huge uppercase lines (one line in the accent color); and a black footer with the label "FEATURED GUEST", the episode title, one sentence, and Play plus "Watch on YouTube". Below them, a grey panel "The people at our table" with a grid of name chips and a "More on Instagram" link.
- "From the socials": a horizontal carousel of Instagram and TikTok post cards (numbered 01/06, image, caption, platform label) that link to the original posts.
- Closing call to action: a full-width accent-colored section with a giant black statement, "DON'T JUST WATCH. / JOIN THE / CONVERSATION.", and on the right a list of large follow rows (YouTube, Instagram, TikTok), each with an icon, separated by hairlines.
- Footer: black, with the wordmark, slogan, explore links, follow links and a contact link.

PAGES TO DESIGN (desktop and mobile)
1. Home: all sections above.
2. Episodes archive: eyebrow "THE ARCHIVE", huge title "ALL EPISODES", standfirst "Real conversations. The whole story.", a search field on the right, a count line ("7 CONVERSATIONS"), and a 3-column grid of episode cards (1 column on mobile) with a "Explore episode →" link.
3. Episode page: a split hero. On the left: meta, a huge title, host links, and the Play, "Watch on YouTube" and Share buttons. On the right: a large 16:9 video panel. Below: "About this episode" with an editorial italic standfirst and the plain-text show notes, guest chips, and a "More conversations" carousel.
4. Hosts and a host profile: big host cards; the profile shows bio, role, social links and the host's episodes.
5. Social: a page title, platform filter chips (All, Instagram, Facebook — Facebook shown as unavailable), a grid of post cards, and a "Load more" button.
6. About: the mission, values set in huge words separated by accent "+" marks (FOOTBALL + IDENTITY + MENTALITY + CULTURE + PURPOSE + LIFE), and the founders.
7. 404: "OFF THE PITCH." with links back home and to episodes.

COLORS (use exactly these; dark-first)
- Ink (page background) #0A0A0A; raised surfaces #131311 and #1B1B18; hairlines #262624
- Paper (main text on ink; light sections) #F5F4EF; light-section surfaces #E8E7E0; light-section lines #CFCDC2
- Accent (lime) #B4F071, with text on the accent #0A0A0A. Use it sparingly: primary buttons, one highlighted headline line, the ticker, active states and the closing call-to-action section.
- Secondary text: #A8A69C on ink, #55534C on paper. Error: #FF8A72 on ink, #C8452F on paper.
- Contrast must meet WCAG 2.2 AA.

TYPE AND SHAPE
- Display: Helvetica Neue or Inter, heavy weight, uppercase, tight letter spacing (-0.045em), stacked multi-line headlines.
- Labels and meta: monospace, uppercase, 10-11 px, letter spacing 0.18em.
- Standfirsts and quotes: an editorial serif italic (Iowan Old Style or Georgia).
- Square corners everywhere (radius 0). Pill shapes only for filter chips. A 4 px spacing scale and a 1360 px container.

PLAYBACK BEHAVIOR (important)
- There is NO floating or pop-out mini-player.
- Pressing Play on a large surface (hero image panel, carousel card, featured-guest card, episode page video panel) swaps that image for the YouTube video playing in the same place, at least 200 x 200 px, with YouTube's own controls. Show a small "Close video" control that restores the artwork.
- Only one video plays at a time; starting another stops the first. Leaving the page stops playback.
- Small surfaces (chips, thumbnails smaller than 200 px, list rows) link straight to the episode on YouTube in a new tab.
- Every episode always offers "Watch on YouTube".
- Design the states for each playable card: default, hover (image zoom, accent play button grows), playing (video in place, accent outline, "Now playing" label), and unavailable.

STATES AND RULES
- Include loading skeletons, empty search results ("No conversations match 'xyz'"), an error state with Retry, and keyboard focus styles (2 px accent outline).
- Do not include a shop, merchandise, partners, score centre, newsletter sign-up, login or comments.

CUSTOMER JOURNEYS TO PROTOTYPE (link the frames as clickable flows)
1. Catch the latest episode: Home → Play latest → the video plays in the hero → scroll to the latest conversations.
2. From an Instagram post to the full episode (mobile): land on the episode page → Play → it plays in the video panel → tap a host link.
3. Find an episode in the archive: Episodes → type "identity" → results → open a card → episode page.
4. Play inside a carousel: on Home, press Play on a carousel card → it plays inside the card → press Play on another card → the first one stops.
5. Meet the founders: Home → founders section → host profile → play one of their episodes.
6. Catch up on social: Social → filter by Instagram → Load more → open a post on Instagram.
7. Share and follow (mobile): episode page → Share (native share sheet or "Link copied") → closing call to action → follow on YouTube.
8. Not found: a mistyped link → 404 → back to Episodes.
```

## Tips

- If the tool limits prompt length, send it in two parts. First send everything up to "COLORS". Then send "COLORS" to the end, prefixed with "Continue the same design with these rules:".
- Ask for a component sheet: buttons, episode card in all four playback states, filter chip, follow row and ticker.
- The accent `#B4F071` is marked provisional in the ExtraTime preview. Keep it as a color style so it can be changed in one place.
