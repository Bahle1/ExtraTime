import { z } from 'zod';
import { PROBLEM_TYPE_BASE_URI, problemTypeUri } from '../constants/problem-types.constants.js';
const MIN_ERROR_STATUS = 400;
const MAX_ERROR_STATUS = 599;
const VALIDATION_ERROR_URI = problemTypeUri('validation-error');
export const FieldErrorSchema = z.object({
    path: z.string().regex(/^(?:query|params|body)(?:\.[^.]+)*$/),
    message: z.string().min(1),
});
export const ProblemDetailsSchema = z
    .object({
    type: z.string().startsWith(PROBLEM_TYPE_BASE_URI),
    title: z.string().min(1),
    status: z.int().min(MIN_ERROR_STATUS).max(MAX_ERROR_STATUS),
    detail: z.string(),
    instance: z.string().startsWith('/'),
    requestId: z.string().min(1).nullable(),
    errors: z.array(FieldErrorSchema).min(1).optional(),
})
    .refine((problem) => (problem.errors !== undefined) === (problem.type === VALIDATION_ERROR_URI), {
    error: 'errors is present exactly when type is validation-error',
    path: ['errors'],
});
