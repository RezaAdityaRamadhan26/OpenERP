import type { ApiResponse, HealthResponse } from '@open-erp/shared';

const API_BASE = '/api/v1';

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE}/health`);

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  const body: ApiResponse<HealthResponse> = await response.json();

  if (!body.success) {
    throw new Error('Health check returned unsuccessful response');
  }

  return body.data;
}
