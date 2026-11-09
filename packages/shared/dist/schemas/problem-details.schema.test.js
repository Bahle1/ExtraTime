import { describe, expect, it } from 'vitest';
import { PROBLEM_TYPE_BASE_URI } from '../constants/problem-types.constants.js';
import { GOLDEN_PROBLEM_NOT_FOUND, GOLDEN_PROBLEM_VALIDATION_ERROR } from '../testing/index.js';
import { ProblemDetailsSchema } from './problem-details.schema.js';
const notFound = ProblemDetailsSchema.parse(GOLDEN_PROBLEM_NOT_FOUND);
const validationError = ProblemDetailsSchema.parse(GOLDEN_PROBLEM_VALIDATION_ERROR);
const QUERY_ERROR = { path: 'query.pageSize', message: 'Must be at most 50' };
describe('TC-SH-011 Problem Details over the golden 404 and 400', () => {
    it.each([
        { golden: '404', problem: GOLDEN_PROBLEM_NOT_FOUND, type: 'not-found', errorCount: 0 },
        {
            golden: '400',
            problem: GOLDEN_PROBLEM_VALIDATION_ERROR,
            type: 'validation-error',
            errorCount: 2,
        },
    ])('GIVEN the golden $golden WHEN parsed THEN it passes with a /problems/ $type type', ({ problem, type, errorCount }) => {
        const parsed = ProblemDetailsSchema.parse(problem);
        expect(parsed.type).toBe(`${PROBLEM_TYPE_BASE_URI}${type}`);
        expect(parsed.errors ?? []).toHaveLength(errorCount);
    });
    it('GIVEN the golden 404 with a null requestId WHEN parsed THEN it passes', () => {
        expect(ProblemDetailsSchema.safeParse({ ...notFound, requestId: null }).success).toBe(true);
    });
    it.each([
        {
            change: 'errors on a not-found',
            problem: { ...notFound, errors: [QUERY_ERROR] },
            at: 'errors',
        },
        {
            change: 'no errors on a validation-error',
            problem: { ...validationError, errors: undefined },
            at: 'errors',
        },
        { change: 'an empty errors list', problem: { ...validationError, errors: [] }, at: 'errors' },
        {
            change: 'a type outside /problems/',
            problem: { ...notFound, type: 'https://example.com/not-found' },
            at: 'type',
        },
        { change: 'a 302 status', problem: { ...notFound, status: 302 }, at: 'status' },
        {
            change: 'a relative instance',
            problem: { ...notFound, instance: 'api/v1/episodes' },
            at: 'instance',
        },
        {
            change: 'an unknown error source',
            problem: { ...validationError, errors: [{ ...QUERY_ERROR, path: 'header.x' }] },
            at: 'errors',
        },
    ])('GIVEN a problem with $change WHEN parsed THEN it fails at $at', ({ problem, at }) => {
        const result = ProblemDetailsSchema.safeParse(problem);
        expect(result.error?.issues[0]?.path[0]).toBe(at);
    });
});
