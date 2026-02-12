import { StatCardSkeleton } from "./StatCardSkeleton";
import { StatCard } from "./StatCard";
import type { StatsData, AppError } from "../../types/types";
import { ErrorState } from "../../ui/ErrorState";
import { EmptyState } from "../../ui/EmptyState";

interface StatsSectionProps {
  stats: StatsData | null;
  isLoading: boolean;
  error: AppError | null;
  hasData: boolean;
  hasEverFetched: boolean;
  isEmpty: boolean;
  optimisticPending: boolean;
  onRetry: () => void;
}

export function StatsSection({
  stats,
  isLoading,
  error,
  hasData,
  hasEverFetched,
  isEmpty,
  optimisticPending,
  onRetry,
}: StatsSectionProps) {
  const showSkeletons = isLoading && !hasData;

  if (showSkeletons) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-indigo-600">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-indigo-600 mb-4">
          Statistics
        </h2>
        <ErrorState error={error} onRetry={onRetry} />
      </section>
    );
  }

  if (!hasEverFetched) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-indigo-600 mb-4">
          Statistics
        </h2>
        <EmptyState type="initial" />
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-indigo-600 mb-4">
          Statistics
        </h2>
        <EmptyState type="empty" />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-indigo-600">Statistics</h2>
        {hasData && !isEmpty && (
          <span className="text-sm text-gray-400">
            Updated:{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          field="visits"
          value={stats!.visits}
          isOptimistic={optimisticPending}
        />
        <StatCard field="uniqueUsers" value={stats!.uniqueUsers} />
        <StatCard field="conversionRate" value={stats!.conversionRate} />
      </div>
    </section>
  );
}
