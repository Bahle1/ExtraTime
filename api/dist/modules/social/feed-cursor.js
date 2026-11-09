import { TimestampSchema } from '@extratime/shared';
import { z } from 'zod';
import { ValidationError } from '../../http/domain-errors.js';
import { FEED_CURSOR_VERSION, MAX_CURSOR_LENGTH } from './social.constants.js';
/** Invalid cursor; 400 at query.cursor. */
export class FeedCursorError extends ValidationError {
    constructor(options) {
        super([{ path: 'query.cursor', message: 'Cursor is invalid' }], options);
        this.name = 'FeedCursorError';
    }
}
const BASE64URL = /^[A-Za-z0-9_-]+$/;
const CursorPayloadSchema = z.strictObject({
    v: z.literal(FEED_CURSOR_VERSION),
    p: TimestampSchema,
    i: z.string().min(1),
});
/** Unpadded base64url of JSON {"v":1,"p":publishedAt,"i":id}. */
export function encodeFeedCursor(key) {
    const payload = { v: FEED_CURSOR_VERSION, p: key.publishedAt, i: key.id };
    return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}
/** Inverse of encodeFeedCursor; throws FeedCursorError. */
export function decodeFeedCursor(cursor) {
    if (cursor.length > MAX_CURSOR_LENGTH || !BASE64URL.test(cursor))
        throw new FeedCursorError();
    const json = parseJson(Buffer.from(cursor, 'base64url').toString('utf8'));
    const parsed = CursorPayloadSchema.safeParse(json);
    if (!parsed.success)
        throw new FeedCursorError({ cause: parsed.error });
    return { publishedAt: parsed.data.p, id: parsed.data.i };
}
/** Post sorts after key in (publishedAt desc, id desc). */
export function isAfterCursor(post, key) {
    const delta = Date.parse(post.publishedAt) - Date.parse(key.publishedAt);
    return delta < 0 || (delta === 0 && post.id < key.id);
}
function parseJson(text) {
    try {
        return JSON.parse(text);
    }
    catch (error) {
        throw new FeedCursorError({ cause: error });
    }
}
