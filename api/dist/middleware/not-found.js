import { NotFoundError } from '../http/domain-errors.js';
/** After every router: unmatched paths become a 404 Problem Details. */
export const notFound = (request, _response, next) => {
    next(new NotFoundError(`No route matches '${request.path}'.`));
};
