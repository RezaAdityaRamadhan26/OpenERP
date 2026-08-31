/** Standard API success response envelope */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/** Standard API error response envelope */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
}

/** Health check response shape */
export interface HealthResponse {
  status: 'healthy' | 'degraded';
  timestamp: string;
  version: string;
}
