import { CACHE_KEY, CACHE_TTL_MS } from "../config/constants";
import type { CacheEntry, StatsData } from "../types/types";

const memoryCache = new Map<string, CacheEntry>();

export function readCache(): CacheEntry | null {
  const cached = memoryCache.get(CACHE_KEY);
  if (cached) return cached;

  try {
    const cacheExist = localStorage.getItem(CACHE_KEY);
    if (!cacheExist) return null;

    const parsed: CacheEntry = JSON.parse(cacheExist);
    memoryCache.set(CACHE_KEY, parsed);
    return parsed;
  } catch {
    return null;
  }
}

export function writeCache(value: StatsData): CacheEntry {
  const entry: CacheEntry = { value, cachedAt: Date.now() };

  memoryCache.set(CACHE_KEY, entry);
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Ignore localStorage errors (e.g., quota exceeded)
  }

  return entry;
}

export function clearCache(): void {
  memoryCache.delete(CACHE_KEY);
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore localStorage errors
  }
}

export function isCacheValid(entry: CacheEntry | null): entry is CacheEntry {
  if (!entry) return false;
  const age = Date.now() - entry.cachedAt;
  return age < CACHE_TTL_MS;
}

export function isCacheExpired(entry: CacheEntry | null): entry is CacheEntry {
  if (!entry) return false;
  const age = Date.now() - entry.cachedAt;
  return age >= CACHE_TTL_MS;
}
