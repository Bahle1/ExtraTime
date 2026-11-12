import { API_BASE_PATH, PROBLEM_JSON_MEDIA_TYPE } from './api.constants';
import { ApiError, type ApiErrorFields } from './ApiError';

/** Query values for getJson; undefined entries are dropped. */
export type QueryParams = Readonly<Record<string, string | number | undefined>>;

/** Options for getJson. */
export interface GetJsonOptions {
  readonly query?: QueryParams;
  readonly signal?: AbortSignal;
}

const NO_PROBLEM_FIELDS = { type: null, title: null, detail: null, instance: null } as const;

function toQueryString(query: QueryParams): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value));
  }
  const encoded = params.toString();
  return encoded === '' ? '' : `?${encoded}`;
}

function httpFields(response: Response, detail: string | null = null): ApiErrorFields {
  return { ...NO_PROBLEM_FIELDS, kind: 'http', status: response.status, detail };
}

function problemFields(body: unknown): Omit<ApiErrorFields, 'kind' | 'status'> {
  const fields = new Map(typeof body === 'object' && body !== null ? Object.entries(body) : []);
  const read = (key: string): string | null => {
    const value: unknown = fields.get(key);
    return typeof value === 'string' ? value : null;
  };
  return {
    type: read('type'),
    title: read('title'),
    detail: read('detail'),
    instance: read('instance'),
  };
}

async function toHttpError(response: Response): Promise<ApiError> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.startsWith(PROBLEM_JSON_MEDIA_TYPE)) return new ApiError(httpFields(response));
  try {
    const body: unknown = await response.json();
    return new ApiError({ ...httpFields(response), ...problemFields(body) });
  } catch (cause) {
    return new ApiError(httpFields(response, 'Malformed problem body'), { cause });
  }
}

async function send(url: string, signal: AbortSignal | undefined): Promise<Response> {
  try {
    return await fetch(url, { credentials: 'omit', signal });
  } catch (cause) {
    if (signal?.aborted === true) throw cause;
    throw new ApiError(
      { ...NO_PROBLEM_FIELDS, kind: 'network', status: null, detail: url },
      { cause },
    );
  }
}

/** GETs API_BASE_PATH + path; T is the shared envelope type of that endpoint (LFR-13). */
export async function getJson<T>(path: string, options: GetJsonOptions = {}): Promise<T> {
  const isEnvelope = (value: unknown): value is T =>
    typeof value === 'object' && value !== null && 'data' in value;
  const url = `${API_BASE_PATH}${path}${toQueryString(options.query ?? {})}`;
  const response = await send(url, options.signal);
  if (!response.ok) throw await toHttpError(response);
  const body: unknown = await response.json().catch((cause: unknown) => {
    throw new ApiError(httpFields(response, `${path} returned invalid JSON`), { cause });
  });
  if (!isEnvelope(body)) throw new ApiError(httpFields(response, `${path} returned no envelope`));
  return body;
}
