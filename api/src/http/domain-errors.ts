import type { FieldError, ProblemType } from '@extratime/shared';

/** Error with a known Problem Details type (LD-12); error-handler.ts renders it. */
export abstract class DomainError extends Error {
  protected constructor(
    readonly problemType: ProblemType,
    detail: string,
    options?: ErrorOptions,
  ) {
    super(detail, options);
  }
}

/** Invalid query, params or body: 400 validation-error with one entry per field. */
export class ValidationError extends DomainError {
  constructor(
    readonly issues: readonly FieldError[],
    options?: ErrorOptions,
  ) {
    super('validation-error', describeIssues(issues.length), options);
    this.name = 'ValidationError';
  }
}

/** Unknown resource or route: 404 not-found; the detail names what was looked up. */
export class NotFoundError extends DomainError {
  constructor(detail: string) {
    super('not-found', detail);
    this.name = 'NotFoundError';
  }
}

function describeIssues(count: number): string {
  return `${String(count)} request ${count === 1 ? 'value' : 'values'} failed validation.`;
}
