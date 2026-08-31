import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../types.js';

export const requestIdMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const requestId =
    c.req.header('x-request-id') ?? crypto.randomUUID();
  c.set('requestId', requestId);
  c.header('X-Request-Id', requestId);
  await next();
});
