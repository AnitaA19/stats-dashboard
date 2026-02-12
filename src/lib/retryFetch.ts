import { RETRY_DELAYS } from "../config/constants";

export async function retryFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const res = await fetch(url, options);

      if (
        (res.status === 429 || res.status === 503) &&
        attempt < RETRY_DELAYS.length
      ) {
        await delay(RETRY_DELAYS[attempt]);
        continue;
      }

      return res;
    } catch (err) {
      lastError = err;
      if (attempt < RETRY_DELAYS.length) {
        await delay(RETRY_DELAYS[attempt]);
      }
    }
  }

  throw lastError;
}

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
