import { NotFoundError } from '../../http/domain-errors.js';
import { collectionBody, singleBody } from '../../http/response-envelope.js';
/** GET /api/v1/hosts and /api/v1/hosts/:slug. */
export class HostsController {
    hosts;
    constructor(hosts) {
        this.hosts = hosts;
    }
    /** Every host in editorial order. */
    list = async (_request, response) => {
        response.json(collectionBody(await this.hosts.listHosts()));
    };
    /** The host profile with exactly this slug, else 404. */
    getBySlug = async (request, response) => {
        const { slug } = request.params;
        const result = await this.hosts.getHostBySlug(slug);
        if (result === null)
            throw new NotFoundError(`No host matches the slug '${slug}'.`);
        response.json(singleBody(result));
    };
}
