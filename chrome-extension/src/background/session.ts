import { redirectOpenBlockedTabs, syncBlockingRules } from './blocking';
import { store } from './chrome-store';
import { notify } from './notify';
import { evaluateActiveTab } from './relevance';
import {
  applyTick,
  createSession,
  DEFAULT_SCORING_CONFIG,
  isSessionExpired,
  sgdUpdate,
  summarizeSession,
} from '@extension/core';
import type { ActiveSession, ActivitySample, IdleState } from '@extension/core';

const TICK_ALARM = 'flowly-tick';
const MAX_WINDOW_MS = 5 * 60_000;
const RELEVANCE_FRESH_MS = 10 * 60_000;

const ensureTickAlarm = async (): Promise<void> => {
  const existing = await chrome.alarms.get(TICK_ALARM);
  if (!existing) await chrome.alarms.create(TICK_ALARM, { periodInMinutes: 0.5, delayInMinutes: 0.5 });
};

const queryIdle = async (): Promise<IdleState> => {
  try {
    return (await chrome.idle.queryState(60)) as IdleState;
  } catch {
    return 'active';
  }
};

const endSession = async (reason: 'completed' | 'stopped'): Promise<string | null> => {
  const session = await store.getSession();
  if (!session) return null;
  const summary = summarizeSession(session, Date.now());
  await store.appendHistory(summary);
  await store.clearSession();
  await store.setTabRelevance(null);
  await syncBlockingRules();
  if (session.featureCount > 0) {
    await store.setPendingLabel(summary.id);
    const minutes = Math.round(summary.focusedSec / 60);
    await notify(
      'flowly-label',
      reason === 'completed' ? 'Session complete' : 'Session stopped',
      `${minutes} focused min. Were you focused?`,
      { force: true, buttons: [{ title: 'Yes, focused' }, { title: 'Not really' }] },
    );
  }
  return summary.id;
};

/** One scoring step. Called by chrome.alarms every 30 s; state lives in storage so worker sleep loses nothing. */
const runTick = async (now = Date.now()): Promise<ActiveSession | null> => {
  const session = await store.getSession();
  if (!session) return null;
  const windowMs = Math.min(MAX_WINDOW_MS, Math.max(1000, now - session.flow.lastTickAt));
  const [activity, idleState, rel, model] = await Promise.all([
    store.takeActivity(),
    queryIdle(),
    store.getTabRelevance(),
    store.getModel(),
  ]);
  const sample: ActivitySample = {
    ...activity,
    windowMs,
    idleState,
    relevance: rel && now - rel.checkedAt < RELEVANCE_FRESH_MS ? rel.relevance : null,
  };
  const next = applyTick(session, sample, model, now, DEFAULT_SCORING_CONFIG);
  await store.saveSession(next);
  if (isSessionExpired(next, now)) {
    await endSession('completed');
    return null;
  }
  if (next.flow.status === 'distracted' && session.flow.status === 'distracted') {
    await notify('flowly-nudge', 'Drifting away?', `Back to “${next.goal}”. You've got this.`);
  }
  return next;
};

const startSession = async (goal: string, minutes: number): Promise<string> => {
  const trimmed = goal.trim();
  if (!trimmed) throw new Error('Set a goal first');
  if (await store.getSession()) await endSession('stopped');
  await store.saveSettings({ goal: trimmed, sessionMinutes: minutes });
  const session = createSession(trimmed, minutes, Date.now(), crypto.randomUUID());
  await store.saveSession(session);
  await store.takeActivity();
  await store.setPendingLabel(null);
  await store.clearRelevanceCache();
  await syncBlockingRules();
  await ensureTickAlarm();
  await redirectOpenBlockedTabs();
  void evaluateActiveTab();
  return session.id;
};

/** Record a "Were you focused?" answer and take one on-device SGD step on the local model. */
const submitLabel = async (sessionId: string, focused: boolean): Promise<void> => {
  const summary = await store.setHistoryLabel(sessionId, focused);
  await store.setPendingLabel(null);
  if (!summary) return;
  const model = await store.getModel();
  await store.saveModel(sgdUpdate(model, summary.avgFeatures, focused, DEFAULT_SCORING_CONFIG.sgd));
  await store.addLabel({ sessionId, features: summary.avgFeatures, focused, at: Date.now() });
};

export { TICK_ALARM, ensureTickAlarm, endSession, runTick, startSession, submitLabel };
