import type { NextFunction, Request, Response } from 'express';
import { PROBLEM_CONTENT_TYPE, toProblemDetails } from '../http/problem-details.js';

const NO_STORE = 'no-store';

/** Last middleware: renders Problem Details and hands the error to pino-http, the only failure log. */
export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (response.headersSent) {
    next(error);
    return;
  }
  const problem = toProblemDetails(error, request.path);
  response.err =
    error instanceof Error ? error : new Error('Non-error value thrown', { cause: error });
  response.status(problem.status).type(PROBLEM_CONTENT_TYPE).set('Cache-Control', NO_STORE);
  response.json(problem);
}
