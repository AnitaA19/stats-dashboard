export type StatField = "visits" | "uniqueUsers" | "conversionRate";

export interface StatsData {
  visits: number;
  uniqueUsers: number;
  conversionRate: number;
  version?: number;
}

export interface CacheEntry {
  value: StatsData;
  cachedAt: number;
}

export interface AppError {
  message: string;
  code?: number;
}

export interface CardConfig {
  label: string;
  format: (v: number) => string;
}

export interface IncrementPayload {
  delta: number;
  expectedVersion: number;
}

export interface DebugState {
  usedCacheCount: number;
  serverRequestCount: number;
  lastRequestDurationMs: number | null;
  lastRequestErrorCode: number | null;
}

export interface DashboardState {
  stats: StatsData | null;
  isLoading: boolean;
  error: AppError | null;
  isStale: boolean;
  autoRefresh: boolean;
  offlineMode: boolean;
  debug: DebugState;
  setAutoRefresh: (v: boolean) => void;
  setOfflineMode: (v: boolean) => void;
}
