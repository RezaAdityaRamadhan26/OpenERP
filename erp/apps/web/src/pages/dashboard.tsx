import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from '../lib/api.js';

export function DashboardPage() {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 30_000,
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">System overview and health status</p>
      </div>

      <div className="grid gap-4 max-w-md">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-medium text-slate-500 mb-3">API Health</h3>

          {healthQuery.isLoading && (
            <p className="text-sm text-slate-400">Checking API status...</p>
          )}

          {healthQuery.isError && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-red-600">Unreachable</span>
              </div>
              <p className="text-xs text-slate-400">
                {healthQuery.error instanceof Error
                  ? healthQuery.error.message
                  : 'Connection failed'}
              </p>
            </div>
          )}

          {healthQuery.isSuccess && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    healthQuery.data.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                <span className="text-sm font-medium capitalize">{healthQuery.data.status}</span>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <p>Version: {healthQuery.data.version}</p>
                <p>Last checked: {new Date(healthQuery.data.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
