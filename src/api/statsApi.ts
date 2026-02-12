import {
  readCache,
  writeCache,
  isCacheValid,
  isCacheExpired,
} from "../cache/statsCache";
import { API_BASE } from "../config/constants";
import { retryFetch } from "../lib/retryFetch";
import { useDashboardStore } from "../store/dashboardStore";
import type { IncrementPayload, StatsData } from "../types/types";

let activeRequest: Promise<StatsData> | null = null;

function transformResponse(json: any): StatsData {
  const { data = {}, version = 0 } = json ?? {};
  return {
    visits: data.visits ?? 0,
    uniqueUsers: data.uniqueUsers ?? 0,
    conversionRate: data.conversionRate ?? 0,
    version,
  };
}

export async function fetchStats(): Promise<StatsData> {
  const store = useDashboardStore.getState();
  const cached = readCache();

  if (store.offlineMode) {
    if (!cached) throw new Error("Offline mode: no cached data available");
    store.recordCacheUsage();
    return cached.value;
  }

  if (isCacheValid(cached)) {
    store.recordCacheUsage();
    return cached.value;
  }

  if (activeRequest) return activeRequest;

  activeRequest = (async () => {
    const startTime = Date.now();
    try {
      store.setLoading(true);
      store.setError(null);
      store.setRequestErrorCode(null);

      if (isCacheExpired(cached)) {
        store.setStale(true);
        store.setStats(cached.value);
        store.recordCacheUsage();
      } else {
        store.recordServerRequest();
      }

      const response = await retryFetch(`${API_BASE}/api/stats/get`);
      store.setRequestErrorCode(response.status);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      const data = transformResponse(json);

      writeCache(data);
      store.setStats(data);
      store.setStale(false);

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error";
      store.setError({ message });
      throw error;
    } finally {
      store.setRequestDuration(Date.now() - startTime);
      store.setLoading(false);
      activeRequest = null;
    }
  })();

  return activeRequest;
}

export interface IncrementResult {
  ok: boolean;
  conflict: boolean;
  data: StatsData | null;
  errorCode: number | null;
}

export async function incrementStats(
  payload: IncrementPayload,
): Promise<IncrementResult> {
  const store = useDashboardStore.getState();
  if (store.offlineMode)
    return { ok: false, conflict: false, data: null, errorCode: null };

  const startTime = Date.now();
  try {
    store.recordServerRequest();
    store.setRequestErrorCode(null);

    const response = await retryFetch(`${API_BASE}/api/stats/increment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        delta: payload.delta,
        expectedVersion: payload.expectedVersion,
      }),
    });

    store.setRequestErrorCode(response.status);

    if (response.status === 409)
      return { ok: false, conflict: true, data: null, errorCode: 409 };
    if (!response.ok)
      return {
        ok: false,
        conflict: false,
        data: null,
        errorCode: response.status,
      };

    const json = await response.json();
    const data = transformResponse(json);

    writeCache(data);
    store.setStats(data);

    return { ok: true, conflict: false, data, errorCode: null };
  } catch {
    return { ok: false, conflict: false, data: null, errorCode: null };
  } finally {
    store.setRequestDuration(Date.now() - startTime);
  }
}
