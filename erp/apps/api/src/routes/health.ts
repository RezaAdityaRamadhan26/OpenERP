import { Hono } from 'hono';
import type { ApiResponse, HealthResponse } from '@open-erp/shared';
import type { AppEnv } from '../types.js';

const VERSION = '0.0.1';

export const healthRoute = new Hono<AppEnv>();

healthRoute.get('/health', (c) => {
  const response: ApiResponse<HealthResponse> = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: VERSION,
    },
  };

  return c.json(response, 200);
});
