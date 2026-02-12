import { useCallback } from "react";
import { useStats } from "../../hooks/useStats";
import type { StatsData, AppError } from "../../types/types";
import { Header } from "./Header";
import { StatusBar } from "./StatusBar";
import { Controls } from "./Controls";
import { StatsSection } from "./StatsSection";
import { DebugPanel } from "./DebugPanel";

function isAllZeros(stats: StatsData) {
  return (
    stats.visits === 0 && stats.uniqueUsers === 0 && stats.conversionRate === 0
  );
}

export function Dashboard() {
  const { statsQuery, incrementMutation } = useStats();

  const handleAddFakeVisit = useCallback(() => {
    if (!statsQuery.data || incrementMutation.isPending) return;

    incrementMutation.mutate({
      delta: 1,
      expectedVersion: statsQuery.data.version ?? 0,
    });
  }, [statsQuery.data, incrementMutation]);

  const handleRefresh = useCallback(() => {
    statsQuery.refetch();
  }, [statsQuery]);

  const hasEverFetched = statsQuery.isFetchedAfterMount;
  const hasData = !!statsQuery.data;
  const isEmpty = statsQuery.data ? isAllZeros(statsQuery.data) : true;

  const error: AppError | null = statsQuery.error
    ? {
        message:
          statsQuery.error instanceof Error
            ? statsQuery.error.message
            : String(statsQuery.error),
        code: undefined,
      }
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 text-gray-900">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <Header
          isLoading={statsQuery.isLoading}
          hasData={hasData}
          optimisticPending={incrementMutation.isPending}
          onAddVisit={handleAddFakeVisit}
          onRefresh={handleRefresh}
        />

        <StatusBar />

        <Controls />

        <StatsSection
          stats={statsQuery.data ?? null}
          isLoading={statsQuery.isLoading}
          error={error}
          hasData={hasData}
          hasEverFetched={hasEverFetched}
          isEmpty={isEmpty}
          optimisticPending={incrementMutation.isPending}
          onRetry={handleRefresh}
        />

        <DebugPanel />
      </div>
    </main>
  );
}
