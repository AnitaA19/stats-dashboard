import { useState } from "react";
import DebugItem from "./DebugItem";
import { useDashboardStore } from "../../store/dashboardStore";
import { clearCache } from "../../cache/statsCache";

export function DebugPanel() {
  const debug = useDashboardStore((s) => s.debug);
  const [open, setOpen] = useState(false);

  function handleClearCache() {
    clearCache();
    useDashboardStore.setState((s) => ({
      debug: { ...s.debug, usedCacheCount: 0, serverRequestCount: 0 },
    }));
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50
                   hover:bg-indigo-50 transition-colors font-medium text-gray-700"
      >
        <span>Debug Panel</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="p-4 border-t border-gray-200 space-y-4 bg-indigo-50/30 rounded-b-xl">
          <div className="grid grid-cols-2 gap-4">
            <DebugItem label="Cache Usage" value={debug.usedCacheCount} />
            <DebugItem
              label="Server Requests"
              value={debug.serverRequestCount}
            />
            <DebugItem
              label="Last Request Duration"
              value={
                debug.lastRequestDurationMs != null
                  ? `${debug.lastRequestDurationMs}ms`
                  : "—"
              }
            />
            <DebugItem
              label="Last Error Code"
              value={
                debug.lastRequestErrorCode && debug.lastRequestErrorCode !== 200
                  ? debug.lastRequestErrorCode
                  : "None"
              }
            />
          </div>

          <button
            onClick={handleClearCache}
            className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-sm rounded-md 
                       shadow-sm transition-all duration-200"
          >
            Clear Cache
          </button>
        </div>
      )}
    </div>
  );
}
