import type { ActivityCounts, BackgroundMessage } from '@extension/core';

/**
 * Privacy-first activity counter. It records HOW MANY key presses / pointer moves / scrolls
 * happened in this tab — never which keys, never page text — and only while the page is visible
 * and focused. Counts are flushed to the background every 15 s and never leave the device.
 */

const FLUSH_MS = 15_000;
const POINTER_SAMPLE_MS = 250; // count at most 4 pointer moves per second

let counts: Omit<ActivityCounts, 'tabSwitches'> = { keys: 0, pointer: 0, scrolls: 0 };
let lastPointer = 0;
let enabled = true;
let timer: ReturnType<typeof setInterval> | null = null;

const isAttentive = () => document.visibilityState === 'visible' && document.hasFocus();

const onKey = () => {
  if (enabled && isAttentive()) counts.keys++;
};

const onPointer = () => {
  const now = performance.now();
  if (!enabled || now - lastPointer < POINTER_SAMPLE_MS || !isAttentive()) return;
  lastPointer = now;
  counts.pointer++;
};

const onScroll = () => {
  if (enabled && isAttentive()) counts.scrolls++;
};

const flush = () => {
  if (counts.keys + counts.pointer + counts.scrolls === 0) return;
  const message: BackgroundMessage = { type: 'ACTIVITY', payload: counts };
  counts = { keys: 0, pointer: 0, scrolls: 0 };
  chrome.runtime.sendMessage(message).catch(() => {
    // Extension was reloaded/updated: stop quietly.
    stop();
  });
};

const start = () => {
  if (timer) return;
  window.addEventListener('keydown', onKey, { capture: true, passive: true });
  window.addEventListener('pointermove', onPointer, { capture: true, passive: true });
  window.addEventListener('pointerdown', onPointer, { capture: true, passive: true });
  window.addEventListener('wheel', onScroll, { capture: true, passive: true });
  timer = setInterval(flush, FLUSH_MS);
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flush());
};

const stop = () => {
  if (timer) clearInterval(timer);
  timer = null;
  window.removeEventListener('keydown', onKey, { capture: true });
  window.removeEventListener('pointermove', onPointer, { capture: true });
  window.removeEventListener('pointerdown', onPointer, { capture: true });
  window.removeEventListener('wheel', onScroll, { capture: true });
};

const SETTINGS_KEY = 'flowly.settings';

const applySettings = (value: unknown) => {
  const privacy = (value as { privacy?: { activityCounting?: boolean } } | undefined)?.privacy;
  enabled = privacy?.activityCounting !== false;
  if (enabled) start();
  else stop();
};

export const initActivityCounter = () => {
  if (window.top !== window) return; // top frame only
  chrome.storage.local
    .get(SETTINGS_KEY)
    .then(data => applySettings(data[SETTINGS_KEY]))
    .catch(() => applySettings(undefined));
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && SETTINGS_KEY in changes) applySettings(changes[SETTINGS_KEY].newValue);
  });
  // Exposed for the E2E suite so it can flush without waiting 15 s.
  window.addEventListener('flowly:flush', flush);
};
