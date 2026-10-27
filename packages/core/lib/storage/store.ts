import { KEYS, LOCAL_KEYS, MAX_HISTORY, MAX_LABELS, SESSION_KEYS } from './keys';
import { sanitizeSettings } from './settings';
import { sanitizeModel } from '../scoring/logistic';
import type {
  ActiveSession,
  ActivityCounts,
  FocusLabel,
  LogisticModel,
  SessionSummary,
  Settings,
  TabRelevance,
} from '../types';

const read = async <T>(area: StorageAreaLike, key: string): Promise<T | undefined> =>
  (await area.get(key))[key] as T | undefined;

/** The subset of chrome.storage.StorageArea we rely on; trivially mockable in tests. */
export interface StorageAreaLike {
  get(keys: string | string[] | null): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
}

export interface Areas {
  local: StorageAreaLike;
  session: StorageAreaLike;
}

export const EMPTY_ACTIVITY: ActivityCounts = { keys: 0, pointer: 0, scrolls: 0, tabSwitches: 0 };

/** Add two activity count records, clamping each count to a sane non-negative integer. */
export const addActivity = (a: ActivityCounts, b: Partial<ActivityCounts>): ActivityCounts => {
  const n = (x: unknown) =>
    typeof x === 'number' && Number.isFinite(x) ? Math.max(0, Math.min(100_000, Math.round(x))) : 0;
  return {
    keys: a.keys + n(b.keys),
    pointer: a.pointer + n(b.pointer),
    scrolls: a.scrolls + n(b.scrolls),
    tabSwitches: a.tabSwitches + n(b.tabSwitches),
  };
};

/** Typed accessors over chrome.storage. Every reader validates, so a corrupt value never crashes the worker. */
export const createStore = (areas: Areas) => ({
  getSettings: async (): Promise<Settings> => sanitizeSettings(await read(areas.local, KEYS.settings)),
  saveSettings: async (patch: Partial<Settings>): Promise<Settings> => {
    const current = sanitizeSettings(await read(areas.local, KEYS.settings));
    const next = sanitizeSettings({
      ...current,
      ...patch,
      privacy: { ...current.privacy, ...(patch.privacy ?? {}) },
      ai: { ...current.ai, ...(patch.ai ?? {}) },
    });
    await areas.local.set({ [KEYS.settings]: next });
    return next;
  },

  getModel: async (): Promise<LogisticModel> => sanitizeModel(await read(areas.local, KEYS.model)),
  saveModel: (model: LogisticModel) => areas.local.set({ [KEYS.model]: model }),

  getLabels: async (): Promise<FocusLabel[]> => (await read<FocusLabel[]>(areas.local, KEYS.labels)) ?? [],
  addLabel: async (label: FocusLabel): Promise<FocusLabel[]> => {
    const labels = [...((await read<FocusLabel[]>(areas.local, KEYS.labels)) ?? []), label].slice(-MAX_LABELS);
    await areas.local.set({ [KEYS.labels]: labels });
    return labels;
  },

  getHistory: async (): Promise<SessionSummary[]> => (await read<SessionSummary[]>(areas.local, KEYS.history)) ?? [],
  appendHistory: async (summary: SessionSummary): Promise<void> => {
    const history = [...((await read<SessionSummary[]>(areas.local, KEYS.history)) ?? []), summary].slice(-MAX_HISTORY);
    await areas.local.set({ [KEYS.history]: history });
  },
  setHistoryLabel: async (sessionId: string, focused: boolean): Promise<SessionSummary | null> => {
    const history = (await read<SessionSummary[]>(areas.local, KEYS.history)) ?? [];
    const target = history.find(h => h.id === sessionId) ?? null;
    if (!target) return null;
    target.label = focused;
    await areas.local.set({ [KEYS.history]: history });
    return target;
  },

  getSession: async (): Promise<ActiveSession | null> => (await read<ActiveSession>(areas.local, KEYS.session)) ?? null,
  saveSession: (session: ActiveSession) => areas.local.set({ [KEYS.session]: session }),
  clearSession: () => areas.local.remove(KEYS.session),

  getPendingLabel: async (): Promise<string | null> => (await read<string>(areas.local, KEYS.pendingLabel)) ?? null,
  setPendingLabel: (sessionId: string | null) =>
    sessionId ? areas.local.set({ [KEYS.pendingLabel]: sessionId }) : areas.local.remove(KEYS.pendingLabel),

  getSnoozes: async (): Promise<Record<string, number>> =>
    (await read<Record<string, number>>(areas.local, KEYS.snoozes)) ?? {},
  saveSnoozes: (snoozes: Record<string, number>) => areas.local.set({ [KEYS.snoozes]: snoozes }),

  /** Activity accumulates in session storage so it survives the worker sleeping between ticks. */
  addActivity: async (delta: Partial<ActivityCounts>): Promise<ActivityCounts> => {
    const next = addActivity((await read<ActivityCounts>(areas.session, KEYS.activity)) ?? EMPTY_ACTIVITY, delta);
    await areas.session.set({ [KEYS.activity]: next });
    return next;
  },
  /** Read and reset the activity accumulator. */
  takeActivity: async (): Promise<ActivityCounts> => {
    const current = (await read<ActivityCounts>(areas.session, KEYS.activity)) ?? EMPTY_ACTIVITY;
    await areas.session.set({ [KEYS.activity]: EMPTY_ACTIVITY });
    return addActivity(EMPTY_ACTIVITY, current);
  },

  getTabRelevance: async (): Promise<TabRelevance | null> =>
    (await read<TabRelevance>(areas.session, KEYS.tabRelevance)) ?? null,
  setTabRelevance: (value: TabRelevance | null) =>
    value ? areas.session.set({ [KEYS.tabRelevance]: value }) : areas.session.remove(KEYS.tabRelevance),

  getRelevanceCache: async (): Promise<Record<string, TabRelevance>> =>
    (await read<Record<string, TabRelevance>>(areas.session, KEYS.relevanceCache)) ?? {},
  putRelevanceCache: async (key: string, value: TabRelevance): Promise<void> => {
    const cache = (await read<Record<string, TabRelevance>>(areas.session, KEYS.relevanceCache)) ?? {};
    cache[key] = value;
    const entries = Object.entries(cache).slice(-300);
    await areas.session.set({ [KEYS.relevanceCache]: Object.fromEntries(entries) });
  },
  clearRelevanceCache: () => areas.session.remove(KEYS.relevanceCache),

  getAiLastCall: async (): Promise<number | null> => (await read<number>(areas.session, KEYS.aiLastCall)) ?? null,
  setAiLastCall: (t: number) => areas.session.set({ [KEYS.aiLastCall]: t }),
  setAiStatus: (status: string) => areas.session.set({ [KEYS.aiStatus]: status }),

  /** Delete everything Flowly stored, in both areas. */
  resetAll: async (): Promise<void> => {
    await areas.local.remove([...LOCAL_KEYS]);
    await areas.session.remove([...SESSION_KEYS]);
  },
});

export type Store = ReturnType<typeof createStore>;
