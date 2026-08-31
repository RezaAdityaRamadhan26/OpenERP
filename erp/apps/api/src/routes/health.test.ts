import { describe, expect, test } from 'bun:test';
import { createApp } from '../app.js';

describe('GET /api/v1/health', () => {
  test('returns healthy response', async () => {
    const app = createApp();
    const response = await app.request('/api/v1/health');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('x-request-id')).toBeTruthy();
    expect(body).toEqual({
      success: true,
      data: {
        status: 'healthy',
        timestamp: expect.any(String),
        version: '0.0.1',
      },
    });
  });

  test('preserves incoming request ID', async () => {
    const app = createApp();
    const response = await app.request('/api/v1/health', {
      headers: { 'x-request-id': 'test-request-id' },
    });

    expect(response.headers.get('x-request-id')).toBe('test-request-id');
  });

  test('returns standard 404 response', async () => {
    const app = createApp();
    const response = await app.request('/api/v1/missing');
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.requestId).toBeTruthy();
  });
});
