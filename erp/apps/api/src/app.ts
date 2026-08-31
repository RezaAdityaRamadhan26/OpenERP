import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestIdMiddleware } from './middleware/request-id.js';
import { errorHandler } from './middleware/error-handler.js';
import { healthRoute } from './routes/health.js';
import type { AppEnv } from './types.js';

interface CreateAppOptions {
  corsOrigin?: string;
}

export function createApp(options: CreateAppOptions = {}) {
  const app = new Hono<AppEnv>();
  const corsOrigin = options.corsOrigin ?? 'http://localhost:5173';

  // Global middleware
  app.use('*', requestIdMiddleware);
  app.use(
    '*',
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  );

  // Error handler
  app.onError(errorHandler);

  // Routes
  app.route('/api/v1', healthRoute);

  // 404
  app.notFound((c) => {
    return c.json(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Route ${c.req.method} ${c.req.path} not found`,
        },
        requestId: c.get('requestId'),
      },
      404,
    );
  });

  return app;
}
