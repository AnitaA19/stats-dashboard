import { useDashboardStore } from "../../store/dashboardStore";

export function Controls() {
  const autoRefresh = useDashboardStore((s) => s.autoRefresh);
  const offlineMode = useDashboardStore((s) => s.offlineMode);
  const setAutoRefresh = useDashboardStore((s) => s.setAutoRefresh);
  const setOfflineMode = useDashboardStore((s) => s.setOfflineMode);

  const handleOfflineModeChange = (checked: boolean) => {
    setOfflineMode(checked);
    if (checked && autoRefresh) {
      setAutoRefresh(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            disabled={offlineMode}
            className="sr-only peer"
          />
          <div
            className={`
            w-14 h-7 rounded-full transition-all
            ${
              offlineMode
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-gray-300 peer-checked:bg-indigo-600 group-hover:shadow-lg"
            }
          `}
          />
          <div
            className={`
            absolute left-1 top-1 w-5 h-5 rounded-full bg-white
            transition-transform shadow-md
            ${autoRefresh && !offlineMode ? "translate-x-7" : ""}
          `}
          />
        </div>
        <div>
          <div
            className={`font-semibold text-sm ${offlineMode ? "text-gray-400" : "text-gray-900"}`}
          >
            Auto-Refresh
          </div>
          <div className="text-xs text-gray-500">
            {offlineMode
              ? "Disabled in offline mode"
              : "Fetch every 10 seconds"}
          </div>
        </div>
      </label>

      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={offlineMode}
            onChange={(e) => handleOfflineModeChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-14 h-7 rounded-full bg-gray-300 peer-checked:bg-gray-700 transition-all group-hover:shadow-lg" />
          <div
            className={`
            absolute left-1 top-1 w-5 h-5 rounded-full bg-white
            transition-transform shadow-md
            ${offlineMode ? "translate-x-7" : ""}
          `}
          />
        </div>
        <div>
          <div className="font-semibold text-sm text-gray-900">
            Offline Mode
          </div>
          <div className="text-xs text-gray-500">Cache only, no network</div>
        </div>
      </label>
    </div>
  );
}
