import { describe, expect, it } from 'vitest';
import { MAX_SHORT_BIO_LENGTH } from '../constants/api-limits.constants.js';
import { EpisodeBuilder, GOLDEN_HOST_JORDAN_REYES, HostBuilder } from '../testing/index.js';
import { HostSchema } from './host.schema.js';
const golden = HostSchema.parse(GOLDEN_HOST_JORDAN_REYES);
const LONGEST_SHORT_BIO = 'a'.repeat(MAX_SHORT_BIO_LENGTH);
describe('TC-SH-007 Host schema over the golden Jordan Reyes', () => {
    it('GIVEN the golden Jordan Reyes WHEN parsed THEN it passes with its /images/ avatar', () => {
        const result = HostSchema.safeParse(GOLDEN_HOST_JORDAN_REYES);
        expect(result.data?.avatar?.url).toBe('/images/hosts/jordan-reyes.jpg');
    });
    it.each([
        { change: 'a null favoriteClub', field: 'favoriteClub', value: null },
        { change: 'a null avatar', field: 'avatar', value: null },
        { change: 'a 160-character shortBio', field: 'shortBio', value: LONGEST_SHORT_BIO },
    ])('GIVEN the golden with $change WHEN parsed THEN it passes', ({ field, value }) => {
        expect(HostSchema.safeParse({ ...golden, [field]: value }).success).toBe(true);
    });
    it.each([
        { change: 'a 161-character shortBio', field: 'shortBio', value: `${LONGEST_SHORT_BIO}a` },
        { change: 'an unknown role', field: 'role', value: 'Pundit' },
    ])('GIVEN the golden with $change WHEN parsed THEN it fails at $field', ({ field, value }) => {
        const result = HostSchema.safeParse({ ...golden, [field]: value });
        expect(result.error?.issues[0]?.path).toEqual([field]);
    });
});
describe('TC-SH-007 HostBuilder defaults to the golden Jordan Reyes', () => {
    it('GIVEN no overrides WHEN built THEN it is the golden host', () => {
        expect(new HostBuilder().build()).toEqual(golden);
    });
    it('GIVEN one recent episode WHEN built as a detail THEN recentEpisodes holds its summary', () => {
        const summary = new EpisodeBuilder().buildSummary();
        expect(new HostBuilder().buildDetail([summary]).recentEpisodes).toEqual([summary]);
    });
    it('GIVEN an invalid override WHEN built THEN build throws', () => {
        expect(() => new HostBuilder().with({ slug: 'Jordan Reyes' }).build()).toThrow();
    });
});
