import { NotFoundError } from '../../http/domain-errors.js';
import { collectionBody, singleBody } from '../../http/response-envelope.js';
/** GET /api/v1/episodes and /api/v1/episodes/:slug. */
export class EpisodesController {
    episodes;
    constructor(episodes) {
        this.episodes = episodes;
    }
    /** One page of summaries for the validated query. */
    list = async (_request, response) => {
        const page = await this.episodes.listEpisodes(response.locals.validated.query);
        response.json(collectionBody(page));
    };
    /** The episode with exactly this slug, else 404. */
    getBySlug = async (request, response) => {
        const { slug } = request.params;
        const result = await this.episodes.getEpisodeBySlug(slug);
        if (result === null)
            throw new NotFoundError(`No episode matches the slug '${slug}'.`);
        response.json(singleBody(result));
    };
}
