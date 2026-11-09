import { pinoHttp } from 'pino-http';
const HEALTH_CHECK_PATH = /^\/api\/v1\/health(?:[/?]|$)/;
const MIN_SERVER_ERROR_STATUS = 500;
/** pino-http: one line per finished request, 5xx at error and the rest at info; health checks are skipped. */
export function createRequestLogger(logger) {
    return pinoHttp({
        logger,
        autoLogging: { ignore: (request) => HEALTH_CHECK_PATH.test(request.url ?? '') },
        customLogLevel: (_request, response) => response.statusCode >= MIN_SERVER_ERROR_STATUS ? 'error' : 'info',
    });
}
