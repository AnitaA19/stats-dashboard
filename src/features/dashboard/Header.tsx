import { useDashboardStore } from "../../store/dashboardStore";

interface HeaderProps {
  isLoading: boolean;
  hasData: boolean;
  optimisticPending: boolean;
  onAddVisit: () => void;
  onRefresh: () => void;
}

export function Header({
  isLoading,
  hasData,
  optimisticPending,
  onAddVisit,
  onRefresh,
}: HeaderProps) {
  const offlineMode = useDashboardStore((s) => s.offlineMode);

  const addVisitDisabled = !hasData || optimisticPending || offlineMode;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-indigo-600">Stats Dashboard</h1>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onAddVisit}
          disabled={addVisitDisabled}
          className={`
            rounded-lg px-5 py-2.5 text-sm font-medium
            shadow-sm transition-all relative
            ${
              addVisitDisabled
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
            }
          `}
          title={offlineMode && hasData ? "Disabled in offline mode" : ""}
        >
          {optimisticPending ? "..." : "+ Add fake visit"}
          {offlineMode && hasData && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
              title="Disabled in offline mode"
            />
          )}
        </button>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`
            rounded-lg px-5 py-2.5 text-sm font-medium
            shadow-sm transition-all relative
            ${
              isLoading
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
            }
          `}
          title={
            offlineMode
              ? "Fetch from cache only"
              : "Fetch latest stats from server"
          }
        >
          {isLoading
            ? "Loading..."
            : offlineMode
              ? "Fetch from Cache"
              : "Fetch Stats"}
          {offlineMode && !isLoading && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"
              title="Offline - cache only"
            />
          )}
        </button>
      </div>
    </header>
  );
}
