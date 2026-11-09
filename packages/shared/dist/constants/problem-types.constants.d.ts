/** Placeholder domain until LQ-10 is decided. */
export declare const PROBLEM_TYPE_BASE_URI = "https://www.extratime.example/problems/";
/** Phase 1 slugs; later DomainError subclasses append theirs (LD-12). */
export declare const PROBLEM_TYPES: readonly ["validation-error", "not-found", "internal-error"];
/** v1 problem-type slug. */
export type ProblemType = (typeof PROBLEM_TYPES)[number];
/** Returns the absolute URI of a problem type. */
export declare function problemTypeUri(type: ProblemType): string;
