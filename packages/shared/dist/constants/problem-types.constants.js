/** Placeholder domain until LQ-10 is decided. */
export const PROBLEM_TYPE_BASE_URI = 'https://www.extratime.example/problems/';
/** Phase 1 slugs; later DomainError subclasses append theirs (LD-12). */
export const PROBLEM_TYPES = ['validation-error', 'not-found', 'internal-error'];
/** Returns the absolute URI of a problem type. */
export function problemTypeUri(type) {
    return `${PROBLEM_TYPE_BASE_URI}${type}`;
}
