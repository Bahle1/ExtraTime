import { problemTypeUri, type ProblemDetails, type ProblemType } from '@extratime/shared';
import { DomainError, ValidationError } from './domain-errors.js';

/** Media type of every error body (RFC 9457). */
export const PROBLEM_CONTENT_TYPE = 'application/problem+json';

interface ProblemEntry {
  readonly status: number;
  readonly title: string;
}

/** The v1 catalogue of error statuses and fixed titles (HLD §4.5). */
const PROBLEM_CATALOGUE: Readonly<Record<ProblemType, ProblemEntry>> = {
  'validation-error': { status: 400, title: 'Invalid request' },
  'not-found': { status: 404, title: 'Resource not found' },
  'internal-error': { status: 500, title: 'Internal server error' },
};

const INTERNAL_ERROR_DETAIL = 'The server could not complete the request.';

/** Renders a thrown value for the request path; anything but a DomainError is a generic 500. */
export function toProblemDetails(error: unknown, instance: string): ProblemDetails {
  if (!(error instanceof DomainError)) {
    return problemOf({ type: 'internal-error', detail: INTERNAL_ERROR_DETAIL, instance });
  }
  const problem = problemOf({ type: error.problemType, detail: error.message, instance });
  return error instanceof ValidationError ? { ...problem, errors: [...error.issues] } : problem;
}

function problemOf(occurrence: {
  type: ProblemType;
  detail: string;
  instance: string;
}): ProblemDetails {
  const { type, detail, instance } = occurrence;
  const { status, title } = PROBLEM_CATALOGUE[type];
  return { type: problemTypeUri(type), title, status, detail, instance, requestId: null };
}
