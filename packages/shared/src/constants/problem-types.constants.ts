/** Placeholder domain until LQ-10 is decided. */
export const PROBLEM_TYPE_BASE_URI = 'https://www.extratime.example/problems/';

/** Phase 1 slugs; later DomainError subclasses append theirs (LD-12). */
export const PROBLEM_TYPES = ['validation-error', 'not-found', 'internal-error'] as const;

/** v1 problem-type slug. */
export type ProblemType = (typeof PROBLEM_TYPES)[number];

/** Returns the absolute URI of a problem type. */
export function problemTypeUri(type: ProblemType): string {
  return `${PROBLEM_TYPE_BASE_URI}${type}`;
}
