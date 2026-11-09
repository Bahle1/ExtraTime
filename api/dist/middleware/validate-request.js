import { z } from 'zod';
import { ValidationError } from '../http/domain-errors.js';
/** Strict query schema of routes that take no query parameters. */
export const EmptyQuerySchema = z.strictObject({});
/** Parses one request part into res.locals.validated[source], else throws ValidationError. */
export function validateRequest(schema, source) {
    return (request, response, next) => {
        const result = schema.safeParse(request[source]);
        if (!result.success)
            throw new ValidationError(toFieldErrors(result.error.issues, source));
        response.locals.validated = { ...response.locals.validated, [source]: result.data };
        next();
    };
}
function toFieldErrors(issues, source) {
    return issues.flatMap((issue) => {
        const path = [source, ...issue.path.map(String)].join('.');
        if (issue.code !== 'unrecognized_keys')
            return [{ path, message: issue.message }];
        return issue.keys.map((key) => ({ path: `${path}.${key}`, message: `Unknown key '${key}'` }));
    });
}
