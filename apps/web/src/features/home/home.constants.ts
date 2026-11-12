/** Episodes in the latest-conversations carousel, after the hero's newest episode (LFR-15). */
export const RAIL_SIZE = 6;

/** Social posts shown in the home carousel, taken from the first feed page (LFR-15). */
export const SOCIAL_HIGHLIGHTS_COUNT = 6;

/** Words looped in the accent ticker under the hero. */
export const TICKER_WORDS: readonly string[] = [
  'Identity',
  'Purpose',
  'Mentorship',
  'Football',
  'Life beyond the game',
  'The conversation beyond the game',
];

/** Hero copy; the h1 lines spell the slogan. */
export const HERO_COPY = {
  eyebrow: 'Football conversations · Since 2024',
  headingLines: ['The conversation', 'beyond', 'the game'],
  accentLine: 1,
  standfirst:
    'Honest conversations with coaches, players and creatives about identity, purpose and life after the final whistle.',
} as const;

/** About split on the home page. */
export const ABOUT_INTRO = {
  eyebrow: 'Meet ExtraTime',
  headingLines: ['More than football.', 'Our stories.', 'Your next chapter.'],
  accentLine: 2,
} as const;

/** One "Ways in" tile: an editorial route into the archive. */
export interface WayIn {
  readonly number: string;
  readonly title: string;
  readonly meta: string;
  readonly linkLabel: string;
  readonly to: string;
  /** 'accent' and 'paper' are colour blocks; 'photo' uses the artwork of the episode at `to`. */
  readonly tone: 'accent' | 'paper' | 'photo';
  /** Episode slug whose artwork the photo tile shows. */
  readonly artworkSlug?: string;
}

/** Three editorial routes into the archive (Filthy Fellas "shows" pattern). */
export const WAYS_IN: readonly WayIn[] = [
  {
    number: '01',
    title: 'Season 1: The Journey',
    meta: 'Journey · Authenticity · Purpose',
    linkLabel: 'Start at episode 1',
    to: '/episodes/s01e01-journey',
    tone: 'accent',
  },
  {
    number: '02',
    title: 'Purpose: Bigger Than Football',
    meta: 'Two parts · Cavin Johnson & Jesse Donn',
    linkLabel: 'Watch both parts',
    to: '/episodes?q=purpose',
    tone: 'paper',
  },
  {
    number: '03',
    title: 'ExtraTime Specials',
    meta: 'Kinshasa · En français',
    linkLabel: 'Watch the special',
    to: '/episodes/plus-que-le-football-construire-son-identite-extratime',
    tone: 'photo',
    artworkSlug: 'plus-que-le-football-construire-son-identite-extratime',
  },
];

/** A featured-guest card in "At our table". */
export interface FeaturedGuest {
  readonly slug: string;
  readonly label: string;
  readonly nameLines: readonly [string, string];
  readonly tone: 'accent' | 'ink';
}

/** Featured conversations, by episode slug (editorial picks). */
export const FEATURED_GUESTS: readonly FeaturedGuest[] = [
  {
    slug: 'full-circle-coach-pitso-mosimane',
    label: 'The ExtraTime archive / 01',
    nameLines: ['Coach Pitso', 'Mosimane.'],
    tone: 'accent',
  },
  {
    slug: 'purpose-bigger-than-football',
    label: 'The ExtraTime archive / 02',
    nameLines: ['Cavin Johnson', '& Jesse Donn.'],
    tone: 'ink',
  },
];

/** Everyone who has sat at the ExtraTime table, from the episode descriptions. */
export const TABLE_GUESTS: readonly string[] = [
  'Pitso Mosimane',
  'Cavin Johnson',
  'Jesse Donn',
  'Kay Kay Ribane',
  'Daniel',
  'Haggi',
];
