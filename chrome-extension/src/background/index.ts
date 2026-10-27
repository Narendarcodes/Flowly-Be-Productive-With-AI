import { isSnoozeAlarm, MAX_SNOOZE_MINUTES, snoozeDomain, syncBlockingRules } from './blocking';
import { store } from './chrome-store';
import { embedSimilarity } from './offscreen';
import { evaluateActiveTab, evaluateTab } from './relevance';
import { endSession, ensureTickAlarm, runTick, startSession, submitLabel, TICK_ALARM } from './session';
import { DEFAULT_SETTINGS, KEYS } from '@extension/core';
import type { BackgroundMessage, BackgroundResponse } from '@extension/core';

/*
 * Flowly background service worker.
 * All listeners are registered synchronously at the top level (MV3 requirement) and every piece of
 * state is read from chrome.storage, so the worker can be suspended at any time without losing data.
 */

const tabTimers = new Map<number, ReturnType<typeof setTimeout>>();

/** Debounce relevance checks per tab: title/URL updates arrive in bursts while a page loads. */
const scheduleEvaluate = (tabId: number, delayMs = 800) => {
  clearTimeout(tabTimers.get(tabId));
  tabTimers.set(
    tabId,
    setTimeout(() => {
      tabTimers.delete(tabId);
      chrome.tabs
        .get(tabId)
        .then(tab => (tab.active ? evaluateTab(tab) : null))
        .catch(() => undefined);
    }, delayMs),
  );
};

const handleMessage = async (
  message: BackgroundMessage,
  sender: chrome.runtime.MessageSender,
): Promise<BackgroundResponse> => {
  switch (message.type) {
    case 'ACTIVITY': {
      // Only accept counts from our own content script in a top frame, and only during a session.
      if (!sender.tab || sender.id !== chrome.runtime.id) return { ok: false, error: 'Rejected' };
      const [session, settings] = await Promise.all([store.getSession(), store.getSettings()]);
      if (session && settings.privacy.activityCounting) await store.addActivity(message.payload);
      return { ok: true };
    }
    case 'START_SESSION':
      return { ok: true, sessionId: await startSession(message.payload.goal, message.payload.minutes) };
    case 'STOP_SESSION':
      await endSession('stopped');
      return { ok: true };
    case 'SNOOZE_SITE':
      await snoozeDomain(message.payload.domain, Math.min(MAX_SNOOZE_MINUTES, message.payload.minutes));
      return { ok: true };
    case 'SUBMIT_LABEL':
      await submitLabel(message.payload.sessionId, message.payload.focused);
      return { ok: true };
    case 'DISMISS_LABEL':
      await store.setPendingLabel(null);
      return { ok: true };
    case 'RESET_DATA':
      await store.clearSession();
      await store.resetAll();
      await store.saveSettings(DEFAULT_SETTINGS);
      await syncBlockingRules();
      return { ok: true };
    default:
      return { ok: false, error: 'Unknown message' };
  }
};

chrome.runtime.onMessage.addListener((message: BackgroundMessage & { target?: string }, sender, sendResponse) => {
  if (!message || typeof message !== 'object' || message.target === 'offscreen') return false;
  handleMessage(message, sender)
    .then(sendResponse)
    .catch((error: unknown) =>
      sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) }),
    );
  return true;
});

chrome.runtime.onInstalled.addListener(async () => {
  // Persist sanitized settings so first-run defaults (e.g. the starter blocklist) become editable data.
  await store.saveSettings({});
  await ensureTickAlarm();
  await syncBlockingRules();
  chrome.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: false }).catch(() => undefined);
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureTickAlarm();
  await syncBlockingRules();
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === TICK_ALARM) void runTick();
  else if (isSnoozeAlarm(alarm.name)) void syncBlockingRules();
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  if (await store.getSession()) {
    await store.addActivity({ tabSwitches: 1 });
    scheduleEvaluate(tabId, 300);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && (changeInfo.status === 'complete' || changeInfo.title !== undefined)) scheduleEvaluate(tabId);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && KEYS.settings in changes) {
    void store.clearRelevanceCache();
    void syncBlockingRules();
  }
});

chrome.notifications?.onButtonClicked.addListener(async (id, buttonIndex) => {
  if (id !== 'flowly-label') return;
  const sessionId = await store.getPendingLabel();
  if (sessionId) await submitLabel(sessionId, buttonIndex === 0);
  chrome.notifications.clear(id);
});

// Make sure the periodic tick exists whenever the worker starts.
void ensureTickAlarm();

// Test hook used by the Playwright E2E suite (and handy from the service-worker console).
(globalThis as unknown as { __flowly: object }).__flowly = {
  runTick,
  evaluateActiveTab,
  syncBlockingRules,
  store,
  embeddingSimilarity: (goal: string, text: string) => embedSimilarity(goal, text, 120_000),
};
