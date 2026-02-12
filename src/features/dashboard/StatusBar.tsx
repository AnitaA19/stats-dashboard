import { useDashboardStore } from "../../store/dashboardStore";

export function StatusBar() {
  const autoRefresh = useDashboardStore((s) => s.autoRefresh);
  const offlineMode = useDashboardStore((s) => s.offlineMode);
  const isStale = useDashboardStore((s) => s.isStale);

  if (!autoRefresh && !offlineMode && !isStale) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {isStale && (
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-amber-800 border border-amber-300">
          <svg className="h-4 w-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Showing stale data, refreshing…</span>
        </div>
      )}
      
      {autoRefresh && !offlineMode && (
        <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-800 border border-green-300">
          <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
          <span className="font-medium">Auto-refresh ON</span>
        </div>
      )}
      
      {offlineMode && (
        <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-gray-800 border border-gray-300">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
          <span className="font-medium">Offline Mode</span>
        </div>
      )}
    </div>
  );
}