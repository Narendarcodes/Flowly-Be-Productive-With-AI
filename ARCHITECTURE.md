# Flowly architecture

```
 content script (http/https pages)          extension pages (React 19 + Tailwind)
 ┌──────────────────────────┐               ┌───────────────────────────────────────────┐
 │ activity counter         │               │ popup · side panel · options · analytics  │
 │ keys/pointer/scroll      │               │ blocked page                              │
 │ COUNTS only, every 15 s  │               │ read state via chrome.storage.onChanged   │
 └────────────┬─────────────┘               └──────────────┬────────────────────────────┘
              │ ACTIVITY                                   │ START/STOP_SESSION, SNOOZE_SITE,
              ▼                                            ▼ SUBMIT_LABEL, RESET_DATA
 ┌──────────────────────────────────────────────────────────────────────────────────────┐
 │ background service worker (chrome-extension/src/background)                          │
 │  session.ts    start/stop, 30 s chrome.alarms tick → packages/core applyTick          │
 │  relevance.ts  rules → similarity (offscreen) → optional LLM tiebreak, strict mode    │
 │  blocking.ts   declarativeNetRequest dynamic rules, snoozes                           │
 │  chrome-store  typed storage over chrome.storage.local / .session                    │
 └───────────────┬───────────────────────────────────────────────┬──────────────────────┘
                 │ EMBED_SIMILARITY / NANO_RELEVANCE             │ (only if the user set a key)
                 ▼                                               ▼
 ┌──────────────────────────────────────┐          Gemini API gemini-2.5-flash-lite
 │ offscreen document                   │          goal + hostname + tab title only
 │ transformers.js all-MiniLM-L6-v2     │
 │ (ONNX Runtime WASM bundled locally)  │
 │ Chrome Prompt API (Gemini Nano)      │
 └──────────────────────────────────────┘
```

## Design principles

1. **Pure core, thin shell.** All decision logic lives in `packages/core` as pure functions with no
   `chrome.*` calls: feature extraction, heuristic score, EMA, status hysteresis, logistic model +
   SGD, domain rules, keyword similarity, similarity → verdict mapping, DNR rule generation, Gemini
   request/response handling (with an injectable `fetch`), Zod schemas, analytics aggregation and a
   storage layer over a minimal `StorageAreaLike` interface. That is what the Vitest suite covers.
2. **MV3-safe state.** The service worker can be suspended at any moment, so it keeps no state in
   memory that matters. The active session (including the flow state) lives in
   `chrome.storage.local`; the activity accumulator, active-tab relevance, relevance cache and AI
   debounce timestamp live in `chrome.storage.session`. Periodic work runs on `chrome.alarms`
   (30 s), not `setInterval`. All listeners are registered synchronously at top level.
3. **On-device by default.** The LLM is a tiebreak, never a dependency. Without it Flowly is fully
   functional.

## Scoring pipeline (`packages/core/lib/scoring`)

| Step | Module | Notes |
| --- | --- | --- |
| Counts → features | `features.ts` | `typing`, `pointer` (pointer + scroll), `switchRate` (per minute), `idle` (0/1), `relevance` (0–1, neutral 0.5 when unknown). All clamped to [0, 1]. |
| Heuristic | `heuristic.ts` | Linear model with weights in `config.ts` (no magic numbers in code). Used as the cold start. |
| Learned model | `logistic.ts`, `default-model.json` | Logistic regression, 5 weights + bias, pure TS inference. Default weights mirror the heuristic. |
| Blend | `engine.ts` | `score = (1-w)·heuristic + w·100·p`, `w = min(1, labels / 10)`. |
| Smoothing | `math.ts` | EMA, α = 0.3. |
| Status | `engine.ts` | Thresholds 35 / 55 / 75 with 5-point hysteresis; idle overrides. |
| Learning | `logistic.ts` | One SGD step (log-loss, L2) per "Were you focused?" answer, on the session's mean feature vector. Labels are kept locally (max 500). |

## Relevance pipeline (`packages/core/lib/relevance`, `background/relevance.ts`)

1. Only during a session, only for http(s) tabs, only the URL and title.
2. **Rules**: allowlist → blocklist → built-in work tools (`WORK_DOMAINS`).
3. **Similarity** between the goal and `title + host + path words`:
   - *Embeddings* (default): `Xenova/all-MiniLM-L6-v2` (q8) through transformers.js in the
     offscreen document. Service workers can't comfortably host WebAssembly models, so the
     offscreen document (reason `WORKERS`) does. The ONNX Runtime `.wasm`/`.mjs` files are copied
     into the package at build time (`pages/offscreen/vite.config.mts`) because MV3 forbids remote
     code; the manifest allows `'wasm-unsafe-eval'` for extension pages. Model weights are data and
     are fetched once from the Hugging Face Hub, then cached.
   - *Keyword fallback*: stop-word filtered, lightly stemmed bag-of-words cosine plus character
     trigrams. Used when embeddings are disabled or fail.
   - Thresholds per method (`SIMILARITY_THRESHOLDS`): embeddings allow ≥ 0.32, block < 0.12;
     keyword allow ≥ 0.20, block < 0.04. In between is *unsure*.
4. **Optional tiebreak** for *unsure* only, if configured: Gemini Nano (Prompt API with a JSON
   schema `responseConstraint`) or `gemini-2.5-flash-lite` via REST with `responseSchema`. Replies
   are validated with Zod (`ai/schema.ts`); invalid replies are ignored. At most one call per 20 s;
   verdicts are cached per (goal, host, title) for the browser session.
5. The verdict feeds the score's `relevance` feature. In **strict mode** an off-goal verdict
   auto-blocks the host for the rest of the session; otherwise Flowly only nudges.

## Blocking (`packages/core/lib/blocking/rules.ts`, `background/blocking.ts`)

- One dynamic `declarativeNetRequest` rule: `regexFilter ^https?://.*` + `requestDomains`
  (blocklist ∪ session auto-blocks, minus snoozed, minus allowlist) + `main_frame`, redirecting via
  `regexSubstitution` to `blocked/index.html#<original URL>`.
- Rules exist only while a session runs and are rebuilt whenever settings, snoozes or the session
  change. Tabs already open on a blocked domain are sent to the blocked page at session start.
- *Unblock for 5 minutes* stores a snooze expiry, rebuilds the rules, sets an alarm to rebuild
  them again at expiry, and returns the user to the original URL.

## Packages

| Path | Role |
| --- | --- |
| `chrome-extension` | Manifest (`manifest.ts`) and service worker. Built with Vite (lib mode). |
| `packages/core` | Pure logic + tests. Consumed as TypeScript source by Vite/Vitest. |
| `packages/ui` | Shared components and hooks. One accent colour (`#0f766e`), zinc neutrals. |
| `packages/{env,hmr,dev-utils,vite-config,tailwindcss-config,i18n,shared,storage,zipper}` | Build tooling inherited from chrome-extension-boilerplate-react-vite. |
| `pages/*` | One Vite app per extension page; `content` builds an IIFE content script. |
| `tests/e2e` | Playwright tests against the built `dist/`. |

## Messages

Defined in `packages/core/lib/messages.ts`: `ACTIVITY`, `START_SESSION`, `STOP_SESSION`,
`SNOOZE_SITE`, `SUBMIT_LABEL`, `DISMISS_LABEL`, `RESET_DATA` (to the worker) and
`EMBED_SIMILARITY`, `NANO_RELEVANCE`, `PING` (to the offscreen document, `target: 'offscreen'`).
`ACTIVITY` is only accepted from this extension's own content script, and only during a session.
