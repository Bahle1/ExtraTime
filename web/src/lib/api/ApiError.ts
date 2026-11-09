import { HTTP_NOT_FOUND } from './api.constants';

/** 'http': the API answered with a failure; 'network': no usable response. */
export type ApiErrorKind = 'http' | 'network';

/** Failure kind plus the Problem Details fields the UI reads; null when absent. */
export interface ApiErrorFields {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly type: string | null;
  readonly title: string | null;
  readonly detail: string | null;
  readonly instance: string | null;
}

/** Every failure apiClient raises, except the caller's own abort (LFR-13). */
export class ApiError extends Error {
  readonly fields: ApiErrorFields;

  constructor(fields: ApiErrorFields, options?: ErrorOptions) {
    super(fields.title ?? fields.detail ?? `API ${fields.kind} error`, options);
    this.name = 'ApiError';
    this.fields = fields;
  }
}

/** True for an API 404; detail pages then render NotFoundPage. */
export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.fields.status === HTTP_NOT_FOUND;
}
