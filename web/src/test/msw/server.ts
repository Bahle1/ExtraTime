import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/** MSW server for every web test (LD-09); setup.ts starts it and resets handlers after each test. */
export const server = setupServer(...handlers);
