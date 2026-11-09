import { describe, expect, it } from 'vitest';
import { ImageUrlSchema, PublicUrlSchema } from './primitives.schema.js';
describe('TC-SH-002 PublicUrl and ImageUrl field policy', () => {
    it('GIVEN an https URL WHEN parsed THEN PublicUrl and ImageUrl pass', () => {
        const url = 'https://i.ytimg.com/vi/Xk3pQ9vL2mA/hqdefault.jpg';
        expect(PublicUrlSchema.safeParse(url).success).toBe(true);
        expect(ImageUrlSchema.safeParse(url).success).toBe(true);
    });
    it.each([
        { kind: 'site image path', url: '/images/a.jpg' },
        { kind: 'nested site image path', url: '/images/hosts/jordan-reyes.jpg' },
    ])('GIVEN a $kind WHEN parsed THEN only ImageUrl passes', ({ url }) => {
        expect(PublicUrlSchema.safeParse(url).success).toBe(false);
        expect(ImageUrlSchema.safeParse(url).success).toBe(true);
    });
    it.each([
        { kind: 'parent-directory path', url: '/images/../x.jpg' },
        { kind: 'path outside /images/', url: '/media/a.jpg' },
        { kind: 'protocol-relative URL', url: '//cdn.extratime.example/a.jpg' },
        { kind: 'http URL', url: 'http://www.extratime.example/a.jpg' },
        { kind: 'http localhost URL', url: 'http://localhost:5173/images/a.jpg' },
        { kind: 'https localhost URL', url: 'https://localhost:4000/a.jpg' },
        { kind: 'ftp URL', url: 'ftp://files.extratime.example/a.jpg' },
    ])('GIVEN a $kind WHEN parsed THEN PublicUrl and ImageUrl fail', ({ url }) => {
        expect(PublicUrlSchema.safeParse(url).success).toBe(false);
        expect(ImageUrlSchema.safeParse(url).success).toBe(false);
    });
});
