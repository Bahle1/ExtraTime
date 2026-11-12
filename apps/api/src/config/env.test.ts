import { describe, expect, it } from 'vitest';
import { ConfigError, loadConfig } from './env.js';

const RELEASE_SHA = '3f9c2a7e1b4d8f06a5c3e9b2d7f1a4c8e6b0d2f5';

describe('TC-API-003 loadConfig', () => {
  it('GIVEN an empty environment WHEN loading THEN the mock defaults apply and the config is frozen', () => {
    const config = loadConfig({});

    expect(config).toEqual({
      NODE_ENV: 'development',
      PORT: 4000,
      LOG_LEVEL: 'info',
      RELEASE_SHA: 'dev',
      DATA_SOURCE: 'mock',
    });
    expect(Object.isFrozen(config)).toBe(true);
  });

  it('GIVEN a numeric PORT and a 40-hex RELEASE_SHA WHEN loading THEN PORT is coerced and the SHA kept', () => {
    expect(loadConfig({ PORT: '8080', RELEASE_SHA })).toMatchObject({ PORT: 8080, RELEASE_SHA });
  });

  it.each([
    { variable: 'PORT', value: '65536' },
    { variable: 'PORT', value: 'abc' },
    { variable: 'LOG_LEVEL', value: 'verbose' },
    { variable: 'RELEASE_SHA', value: 'not-a-release-sha' },
    { variable: 'DATA_SOURCE', value: 'remote' },
  ] as const)(
    'GIVEN $variable=$value WHEN loading THEN a ConfigError names $variable but not its value',
    ({ variable, value }) => {
      const load = (): unknown => loadConfig({ [variable]: value });

      expect(load).toThrow(ConfigError);
      expect(load).toThrow(
        expect.objectContaining({
          variables: [variable],
          message: `Invalid configuration: ${variable}`,
        }),
      );
    },
  );
});
