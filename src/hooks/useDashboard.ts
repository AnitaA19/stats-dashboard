import { useState, useCallback } from "react";
import { useDashboardStore } from "../store/dashboardStore";
import { fetchStats, incrementStats } from "../api/statsApi";

export function useDashboardLogic() {
  const store = useDashboardStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAddVisit = useCallback(async () => {
    if (!store.stats || isUpdating) return;

    const snapshot = { ...store.stats };
    const expectedVersion = store.stats.version ?? 0;

    setIsUpdating(true);
    useDashboardStore.setState((s) => ({
      stats: s.stats ? { ...s.stats, visits: s.stats.visits + 1 } : s.stats,
    }));

    const result = await incrementStats({ delta: 1, expectedVersion });

    if (result.conflict || !result.ok) {
      useDashboardStore.setState({ stats: snapshot });
      if (result.conflict) await fetchStats();
    } else if (result.data) {
      useDashboardStore.setState({ stats: result.data });
    }
    setIsUpdating(false);
  }, [store.stats, isUpdating]);

  return { ...store, isUpdating, handleAddVisit };
}
