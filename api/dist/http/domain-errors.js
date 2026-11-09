/** Error with a known Problem Details type (LD-12); error-handler.ts renders it. */
export class DomainError extends Error {
    problemType;
    constructor(problemType, detail, options) {
        super(detail, options);
        this.problemType = problemType;
    }
}
/** Invalid query, params or body: 400 validation-error with one entry per field. */
export class ValidationError extends DomainError {
    issues;
    constructor(issues, options) {
        super('validation-error', describeIssues(issues.length), options);
        this.issues = issues;
        this.name = 'ValidationError';
    }
}
/** Unknown resource or route: 404 not-found; the detail names what was looked up. */
export class NotFoundError extends DomainError {
    constructor(detail) {
        super('not-found', detail);
        this.name = 'NotFoundError';
    }
}
function describeIssues(count) {
    return `${String(count)} request ${count === 1 ? 'value' : 'values'} failed validation.`;
}
