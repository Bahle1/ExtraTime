import { cursorBody } from '../../http/response-envelope.js';
import { decodeFeedCursor } from './feed-cursor.js';
/** GET /api/v1/social/feed. */
export class SocialController {
    social;
    constructor(social) {
        this.social = social;
    }
    /** One keyset page of the feed; an invalid cursor is a 400 at query.cursor. */
    feed = async (_request, response) => {
        const { platform, limit, cursor } = response.locals.validated.query;
        const after = cursor === undefined ? null : decodeFeedCursor(cursor);
        const page = await this.social.getFeed({ platforms: platform, limit, after });
        response.json(cursorBody(page));
    };
}
