import {
  addActivity,
  applyTick,
  cloneDefaultModel,
  createSession,
  createStore,
  DEFAULT_SETTINGS,
  focusMinutesByDay,
  formatDuration,
  isAiConfigured,
  isSessionExpired,
  KEYS,
  MAX_LABELS,
  remainingMs,
  sanitizeSettings,
  summarizeSession,
  downsample,
  dayKey,
} from '../index';
import { describe, expect, it } from 'vitest';
import type { StorageAreaLike } from '../index';

const memoryArea = (): StorageAreaLike & { data: Record<string, unknown> } => {
  const data: Record<string, unknown> = {};
  return {
    data,
    get: async keys => {
      if (keys === null) return structuredClone(data);
      const list = Array.isArray(keys) ? keys : [keys];
      return Object.fromEntries(list.filter(k => k in data).map(k => [k, structuredClone(data[k])]));
    },
    set: async items => {
      Object.assign(data, structuredClone(items));
    },
    remove: async keys => {
      for (const k of Array.isArray(keys) ? keys : [keys]) delete data[k];
    },
  };
};

const makeStore = () => {
  const local = memoryArea();
  const session = memoryArea();
  return { local, session, store: createStore({ local, session }) };
};

describe('settings', () => {
  it('returns defaults when storage is empty or corrupt', async () => {
    const { store, local } = makeStore();
    expect(await store.getSettings()).toEqual(DEFAULT_SETTINGS);
    local.data[KEYS.settings] = 'garbage';
    expect(await store.getSettings()).toEqual(DEFAULT_SETTINGS);
  });
  it('merges partial updates, normalises lists and nested objects', async () => {
    const { store } = makeStore();
    await store.saveSettings({
      goal: 'Thesis',
      blocklist: ['https://www.YouTube.com/watch', 'youtube.com', 'bad entry'],
    });
    const s = await store.saveSettings({ privacy: { ...DEFAULT_SETTINGS.privacy, embeddings: false } });
    expect(s.goal).toBe('Thesis');
    expect(s.blocklist).toEqual(['youtube.com']);
    expect(s.privacy).toEqual({ activityCounting: true, embeddings: false, notifications: true });
  });
  it('coerces invalid values', () => {
    const s = sanitizeSettings({ sessionMinutes: -5, ai: { provider: 'gpt-9', geminiApiKey: 42 }, strictMode: 'yes' });
    expect(s.sessionMinutes).toBe(50);
    expect(s.ai).toEqual({ provider: 'none', geminiApiKey: '' });
    expect(s.strictMode).toBe(false);
  });
  it('knows when AI is configured', () => {
    expect(isAiConfigured(DEFAULT_SETTINGS)).toBe(false);
    expect(isAiConfigured(sanitizeSettings({ ai: { provider: 'gemini', geminiApiKey: '' } }))).toBe(false);
    expect(isAiConfigured(sanitizeSettings({ ai: { provider: 'gemini', geminiApiKey: 'k' } }))).toBe(true);
    expect(isAiConfigured(sanitizeSettings({ ai: { provider: 'nano' } }))).toBe(true);
  });
});

describe('activity accumulator (session storage)', () => {
  it('accumulates and resets', async () => {
    const { store, session } = makeStore();
    await store.addActivity({ keys: 10, pointer: 3 });
    await store.addActivity({ keys: 5, tabSwitches: 1 });
    expect(session.data[KEYS.activity]).toEqual({ keys: 15, pointer: 3, scrolls: 0, tabSwitches: 1 });
    expect(await store.takeActivity()).toEqual({ keys: 15, pointer: 3, scrolls: 0, tabSwitches: 1 });
    expect(await store.takeActivity()).toEqual({ keys: 0, pointer: 0, scrolls: 0, tabSwitches: 0 });
  });
  it('rejects junk counts from untrusted senders', () => {
    const r = addActivity(
      { keys: 0, pointer: 0, scrolls: 0, tabSwitches: 0 },
      { keys: -5, pointer: NaN, scrolls: 1e9 },
    );
    expect(r).toEqual({ keys: 0, pointer: 0, scrolls: 100_000, tabSwitches: 0 });
  });
});

describe('model, labels, history persistence', () => {
  it('persists the model and falls back to default', async () => {
    const { store } = makeStore();
    expect(await store.getModel()).toEqual(cloneDefaultModel());
    const m = { ...cloneDefaultModel(), bias: 1, updates: 2 };
    await store.saveModel(m);
    expect(await store.getModel()).toEqual(m);
  });
  it('caps stored labels', async () => {
    const { store, local } = makeStore();
    local.data[KEYS.labels] = Array.from({ length: MAX_LABELS }, (_, i) => ({
      sessionId: `${i}`,
      features: [],
      focused: true,
      at: i,
    }));
    const labels = await store.addLabel({ sessionId: 'new', features: [], focused: false, at: 9999 });
    expect(labels).toHaveLength(MAX_LABELS);
    expect(labels.at(-1)?.sessionId).toBe('new');
    expect(labels[0].sessionId).toBe('1');
  });
  it('stores session history and labels', async () => {
    const { store } = makeStore();
    const s = createSession('Goal', 25, 0, 's1');
    await store.appendHistory(summarizeSession(s, 60_000));
    const updated = await store.setHistoryLabel('s1', true);
    expect(updated?.label).toBe(true);
    expect(await store.setHistoryLabel('missing', true)).toBeNull();
  });
  it('round-trips the active session and pending label; resetAll wipes everything', async () => {
    const { store, local, session } = makeStore();
    await store.saveSession(createSession('G', 0, 5, 'x'));
    await store.setPendingLabel('x');
    await store.addActivity({ keys: 1 });
    await store.saveSettings({ goal: 'keep?' });
    expect((await store.getSession())?.id).toBe('x');
    expect(await store.getPendingLabel()).toBe('x');
    await store.resetAll();
    expect(local.data).toEqual({});
    expect(session.data).toEqual({});
  });
  it('caches relevance verdicts with a bound', async () => {
    const { store } = makeStore();
    const v = {
      verdict: 'allow' as const,
      relevance: 1,
      similarity: null,
      method: 'rule' as const,
      reason: '',
      hostname: 'a',
      title: '',
      checkedAt: 0,
    };
    for (let i = 0; i < 310; i++) await store.putRelevanceCache(`k${i}`, v);
    const cache = await store.getRelevanceCache();
    expect(Object.keys(cache)).toHaveLength(300);
    expect(cache.k309).toBeDefined();
  });
});

describe('session lifecycle', () => {
  const sample = {
    keys: 150,
    pointer: 40,
    scrolls: 0,
    tabSwitches: 1,
    windowMs: 60_000,
    idleState: 'active' as const,
    relevance: 1,
  };
  it('applies ticks and summarises', () => {
    let s = createSession('  Write report ', 30, 0, 'id');
    expect(s.goal).toBe('Write report');
    expect(s.endsAt).toBe(30 * 60_000);
    for (let i = 1; i <= 5; i++) s = applyTick(s, sample, cloneDefaultModel(), i * 60_000);
    expect(s.totalSec).toBe(300);
    expect(s.focusedSec).toBe(300);
    expect(s.tabSwitches).toBe(5);
    expect(s.featureCount).toBe(5);
    const sum = summarizeSession(s, 6 * 60_000);
    expect(sum.avgFeatures).toHaveLength(5);
    expect(sum.avgFeatures[4]).toBeCloseTo(1);
    expect(sum.avgScore).toBeGreaterThan(70);
    expect(sum.label).toBeNull();
  });
  it('never counts more focused or total time than has elapsed', () => {
    let s = createSession('Write report', 30, 0, 'id');
    // Three rapid ticks 10 s apart, each claiming a full 60 s window.
    for (let i = 1; i <= 3; i++) s = applyTick(s, sample, cloneDefaultModel(), i * 10_000);
    expect(s.totalSec).toBeLessThanOrEqual(30);
    expect(s.focusedSec).toBeLessThanOrEqual(s.totalSec);
    const sum = summarizeSession(s, 30_000);
    expect(sum.focusedSec).toBeLessThanOrEqual(sum.totalSec);
    expect(sum.totalSec).toBeLessThanOrEqual((sum.endedAt - sum.startedAt) / 1000);
  });
  it('handles expiry and remaining time', () => {
    const timed = createSession('g', 10, 0, 'a');
    const open = createSession('g', 0, 0, 'b');
    expect(isSessionExpired(timed, 10 * 60_000)).toBe(true);
    expect(isSessionExpired(open, 1e12)).toBe(false);
    expect(remainingMs(timed, 60_000)).toBe(9 * 60_000);
    expect(remainingMs(open, 60_000)).toBeNull();
  });
  it('downsamples long timelines', () => {
    const pts = Array.from({ length: 1000 }, (_, i) => ({ t: i, score: i % 100 }));
    expect(downsample(pts, 60).length).toBeLessThanOrEqual(60);
    expect(downsample(pts.slice(0, 10), 60)).toHaveLength(10);
  });
});

describe('analytics aggregation', () => {
  it('buckets focused minutes per local day including empty days', () => {
    const now = new Date(2026, 9, 27, 15, 0).getTime();
    const day = 86_400_000;
    const mk = (startedAt: number, focusedSec: number) => ({
      ...summarizeSession(createSession('g', 0, startedAt, `${startedAt}`), startedAt),
      focusedSec,
    });
    const buckets = focusMinutesByDay(
      [mk(now - 1000, 1800), mk(now - 2000, 600), mk(now - 2 * day, 1200), mk(now - 30 * day, 999)],
      7,
      now,
    );
    expect(buckets).toHaveLength(7);
    expect(buckets.at(-1)).toEqual({ day: dayKey(now), focusedMinutes: 40, sessions: 2 });
    expect(buckets.at(-3)?.focusedMinutes).toBe(20);
    expect(buckets[0].focusedMinutes).toBe(0);
  });
  it('formats durations', () => {
    expect(formatDuration(65_000)).toBe('1:05');
    expect(formatDuration(3_725_000)).toBe('1:02:05');
    expect(formatDuration(-1)).toBe('0:00');
  });
});
