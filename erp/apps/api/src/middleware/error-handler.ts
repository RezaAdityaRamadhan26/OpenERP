import type { Context } from 'hono';
import { ZodError } from 'zod';
import type { AppEnv } from '../types.js';

export function errorHandler(err: Error, c: Context<AppEnv>): Response {
  const requestId = c.get('requestId');

  // Zod validation errors
  if (err instanceof ZodError) {
    return c.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: err.flatten().fieldErrors,
        },
        requestId,
      },
      400,
    );
  }

  // Log unexpected errors server-side only
  console.error(`[${requestId}] Unhandled error:`, err.message);

  // Do not expose stack traces to client
  return c.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
      requestId,
    },
    500,
  );
}
