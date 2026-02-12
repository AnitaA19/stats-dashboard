import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchStats, incrementStats } from "../api/statsApi";
import { useDashboardStore } from "../store/dashboardStore";
import type { StatsData } from "../types/types";
import { AUTO_REFRESH_MS, CACHE_TTL_MS } from "../config/constants";

export function useStats() {
  const queryClient = useQueryClient();
  const autoRefresh = useDashboardStore((s) => s.autoRefresh);
  const offlineMode = useDashboardStore((s) => s.offlineMode);
  const intervalRef = useRef<number | null>(null);

  const statsQuery = useQuery<StatsData>({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: CACHE_TTL_MS,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: false,
  });

  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const shouldAutoRefresh =
      autoRefresh && !offlineMode && statsQuery.isFetchedAfterMount;

    if (shouldAutoRefresh) {
      intervalRef.current = setInterval(() => {
        statsQuery.refetch();
      }, AUTO_REFRESH_MS);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    autoRefresh,
    offlineMode,
    statsQuery.isFetchedAfterMount,
    statsQuery.refetch,
  ]);

  const mutation = useMutation({
    mutationFn: incrementStats,
    onMutate: async ({ delta }) => {
      await queryClient.cancelQueries({ queryKey: ["stats"] });

      const previous = queryClient.getQueryData<StatsData>(["stats"]);

      if (previous) {
        queryClient.setQueryData<StatsData>(["stats"], {
          ...previous,
          visits: previous.visits + delta,
        });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["stats"], context.previous);
      }
    },
    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData(["stats"], result.data);
      } else if (result.conflict) {
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      }
    },
  });

  return { statsQuery, incrementMutation: mutation };
}
