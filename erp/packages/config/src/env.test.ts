import { afterEach, describe, expect, test } from 'bun:test';
import { envSchema, loadEnv, resetEnvCache } from './env.js';

const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  if (originalDatabaseUrl === undefined) {
    process.env.DATABASE_URL = undefined;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
  resetEnvCache();
});

describe('environment validation', () => {
  test('accepts valid environment with defaults', () => {
    const result = envSchema.parse({
      DATABASE_URL: 'postgresql://localhost:5432/test',
    });

    expect(result.NODE_ENV).toBe('development');
    expect(result.API_PORT).toBe(3001);
    expect(result.API_HOST).toBe('0.0.0.0');
    expect(result.CORS_ORIGIN).toBe('http://localhost:5173');
    expect(result.LOG_LEVEL).toBe('info');
  });

  test('coerces API_PORT to number', () => {
    const result = envSchema.parse({
      DATABASE_URL: 'postgresql://localhost:5432/test',
      API_PORT: '4000',
    });

    expect(result.API_PORT).toBe(4000);
  });

  test('rejects missing DATABASE_URL', () => {
    const result = envSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  test('rejects invalid API_PORT', () => {
    const result = envSchema.safeParse({
      DATABASE_URL: 'postgresql://localhost:5432/test',
      API_PORT: '-1',
    });

    expect(result.success).toBe(false);
  });

  test('loadEnv throws descriptive error for invalid environment', () => {
    process.env.DATABASE_URL = '';
    resetEnvCache();

    expect(() => loadEnv()).toThrow('Environment validation failed');
  });
});
