import { describe, expect, test } from 'bun:test';
import type { ApiResponse } from './api-types.js';

describe('Shared API types', () => {
  test('constructs valid success envelope', () => {
    const res: ApiResponse<{ status: string }> = {
      success: true,
      data: { status: 'ok' },
    };
    expect(res.success).toBe(true);
    expect(res.data.status).toBe('ok');
  });
});
