# Stats Dashboard + Live Chat

A React app I built to practice some real-world frontend patterns — things like caching, optimistic updates, WebSocket chat, and offline support. It's a stats dashboard that talks to a backend API, plus a little chat widget in the corner.

---

## What it does

The main dashboard shows three numbers pulled from an API — total visits, unique users, and conversion rate. Nothing fancy on the surface, but there's a lot going on under the hood:

- It caches responses so repeat requests don't always hit the server
- If the cache is stale, it shows the old data right away while quietly fetching fresh data in the background
- You can flip it into offline mode, where it stops making network calls entirely and just reads from the cache
- There's an auto-refresh toggle that polls every 10 seconds
- The "Add fake visit" button updates the count instantly before the server responds, and rolls back cleanly if something goes wrong

There's also a chat widget in the bottom-right corner that connects over WebSocket. Messages are saved to localStorage so they survive a page refresh, and there's a reconnect button if the connection drops.

---

## Running it locally

You'll need Node 18+ and a backend running at `http://localhost:8000`.

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

The backend needs to expose these three endpoints:

```
GET  /api/stats/get          → { data: { visits, uniqueUsers, conversionRate }, version }
POST /api/stats/increment    → { delta, expectedVersion }
WS   /api/chat/ws
```

---

## Tuning the defaults

Everything configurable lives in `src/config/constants.ts`:

```ts
CACHE_TTL_MS    = 30_000   // how long before cached data is considered stale
AUTO_REFRESH_MS = 10_000   // how often auto-refresh polls
RETRY_DELAYS    = [500, 1000, 2000]  // backoff between retries on 429/503
WS_URL          = "ws://localhost:8000/api/chat/ws"
```

---

## How the caching works

When a request comes in, it checks the cache first. If the data is fresh (less than 30 seconds old), it returns that immediately — no network call. If the data is expired, it shows whatever's in the cache right away so the UI doesn't go blank, puts up a "Refreshing…" banner, and fetches fresh data in the background. When that comes back, the UI updates silently.

One edge case worth mentioning: if the user hammers the refresh button or auto-refresh fires at the same time as a manual fetch, they all share the same in-flight promise instead of each spawning their own request. So there's no pile-up.

Failed requests on `429` or `503` are retried up to three times with increasing delays (500ms → 1s → 2s) before giving up and showing an error.

---

## The chat widget

The widget connects to the WebSocket server as soon as the page loads. When you send a message, it appears in the list immediately marked as "pending" — once any response comes back from the server, it flips to "sent". While it's still connecting, the input is disabled and it shows "Connecting…".

If the connection drops, the widget shows a "Disconnected" state with a Reconnect button. All your previous messages are still there because everything gets written to localStorage as you go.

---

## Project structure

```
src/
├── api/            # API calls and in-flight deduplication
├── cache/          # The two-layer cache (memory + localStorage)
├── config/         # Constants and environment values
├── features/
│   ├── dashboard/  # All the dashboard UI components
│   └── chat/       # The chat widget
├── hooks/          # useStats (React Query) and useWebSocketChat
├── lib/            # retryFetch utility
├── store/          # Zustand store for UI state and debug counters
├── types/          # Shared TypeScript types
└── ui/             # Generic reusable components
```
