import { create } from "zustand";
import type { AppError, DashboardState, StatsData } from "../types/types";

interface FullState extends DashboardState {
  setStats: (stats: StatsData) => void;
  setLoading: (value: boolean) => void;
  setError: (error: AppError | null) => void;
  setStale: (value: boolean) => void;
  setAutoRefresh: (value: boolean) => void;
  setOfflineMode: (value: boolean) => void;
  recordCacheUsage: () => void;
  recordServerRequest: () => void;
  setRequestDuration: (ms: number) => void;
  setRequestErrorCode: (code: number | null) => void;
}

export const useDashboardStore = create<FullState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,
  isStale: false,
  autoRefresh: false,
  offlineMode: false,
  debug: {
    usedCacheCount: 0,
    serverRequestCount: 0,
    lastRequestDurationMs: null,
    lastRequestErrorCode: null,
  },
  setStats: (stats) => set({ stats, error: null, isStale: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setStale: (isStale) => set({ isStale }),
  setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
  setOfflineMode: (offlineMode) => set({ offlineMode }),
  recordCacheUsage: () =>
    set((state) => ({
      debug: { ...state.debug, usedCacheCount: state.debug.usedCacheCount + 1 },
    })),
  recordServerRequest: () =>
    set((state) => ({
      debug: {
        ...state.debug,
        serverRequestCount: state.debug.serverRequestCount + 1,
      },
    })),
  setRequestDuration: (ms) =>
    set((state) => ({ debug: { ...state.debug, lastRequestDurationMs: ms } })),
  setRequestErrorCode: (code) =>
    set((state) => ({ debug: { ...state.debug, lastRequestErrorCode: code } })),
}));
