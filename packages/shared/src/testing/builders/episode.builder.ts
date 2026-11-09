import {
  EpisodeSchema,
  EpisodeSummarySchema,
  type Episode,
  type EpisodeSource,
  type EpisodeSummary,
} from '../../schemas/episode.schema.js';
import goldenEpisode from '../golden/episode.s03e14.json' with { type: 'json' };

type EpisodeFields = Omit<Episode, 'platforms'>;

const GOLDEN_EPISODE = EpisodeSchema.parse(goldenEpisode);
const YOUTUBE_ONLY_EPISODE: EpisodeFields = {
  ...GOLDEN_EPISODE,
  sources: GOLDEN_EPISODE.sources.filter((source) => source.platform === 'youtube'),
};
const DEFAULT_TITLE_SLUG = 'derby-day-fallout';
const CODE_DIGITS = 2;

/** Fluent builder of valid Episodes; defaults to golden S03E14 with its YouTube source only. */
export class EpisodeBuilder {
  private fields: EpisodeFields = YOUTUBE_ONLY_EPISODE;

  /** Overrides fields; platforms is always derived from sources. */
  with(overrides: Partial<EpisodeFields>): this {
    this.fields = { ...this.fields, ...overrides };
    return this;
  }

  /** Appends one platform copy; platforms follow on build(). */
  withSource(source: EpisodeSource): this {
    return this.with({ sources: [...this.fields.sources, source] });
  }

  /** Sets season and episode number with the matching LD-06 id and slug. */
  withCode(season: number, episodeNumber: number): this {
    const code = `s${padCode(season)}e${padCode(episodeNumber)}`;
    return this.with({
      id: `ep_${code}`,
      slug: `${code}-${DEFAULT_TITLE_SLUG}`,
      season,
      episodeNumber,
    });
  }

  /** Builds and validates the Episode. */
  build(): Episode {
    const platforms = [...new Set(this.fields.sources.map((source) => source.platform))];
    return EpisodeSchema.parse({ ...this.fields, platforms });
  }

  /** Builds the validated summary projection (detail fields stripped). */
  buildSummary(): EpisodeSummary {
    return EpisodeSummarySchema.parse(this.build());
  }
}

function padCode(value: number): string {
  return String(value).padStart(CODE_DIGITS, '0');
}
