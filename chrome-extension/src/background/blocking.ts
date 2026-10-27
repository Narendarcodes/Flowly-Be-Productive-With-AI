import { store } from './chrome-store';
import { activeBlockedDomains, buildBlockingRules, findMatch, httpHostname, pruneSnoozes } from '@extension/core';

const BLOCKED_PAGE = 'blocked/index.html';
const SNOOZE_ALARM_PREFIX = 'flowly-snooze:';
const MAX_SNOOZE_MINUTES = 15;

const blockedPageUrl = (): string => chrome.runtime.getURL(BLOCKED_PAGE);

/** Domains blocked right now: only while a focus session is running. */
const currentBlockedDomains = async (now = Date.now()): Promise<string[]> => {
  const [session, settings, snoozes] = await Promise.all([store.getSession(), store.getSettings(), store.getSnoozes()]);
  if (!session) return [];
  return activeBlockedDomains({
    blocked: [...settings.blocklist, ...session.autoBlocked],
    allowlist: settings.allowlist,
    snoozed: snoozes,
    now,
  });
};

/** Rebuild declarativeNetRequest dynamic rules from current state. Idempotent. */
const syncBlockingRules = async (now = Date.now()): Promise<number> => {
  const [session, settings, rawSnoozes] = await Promise.all([
    store.getSession(),
    store.getSettings(),
    store.getSnoozes(),
  ]);
  const snoozes = pruneSnoozes(rawSnoozes, now);
  if (Object.keys(snoozes).length !== Object.keys(rawSnoozes).length) await store.saveSnoozes(snoozes);
  const rules = session
    ? buildBlockingRules({
        blocked: [...settings.blocklist, ...session.autoBlocked],
        allowlist: settings.allowlist,
        snoozed: snoozes,
        now,
        blockedPageUrl: blockedPageUrl(),
      })
    : [];
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map(r => r.id),
    addRules: rules as unknown as chrome.declarativeNetRequest.Rule[],
  });
  return rules.length;
};

/** Send any open tab that is on a blocked domain to the blocked page (rules only catch new navigations). */
const redirectOpenBlockedTabs = async (): Promise<void> => {
  const domains = await currentBlockedDomains();
  if (domains.length === 0) return;
  const tabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
  await Promise.all(
    tabs.map(async tab => {
      const host = httpHostname(tab.url);
      if (tab.id !== undefined && host && findMatch(host, domains)) {
        await chrome.tabs.update(tab.id, { url: `${blockedPageUrl()}#${tab.url}` }).catch(() => undefined);
      }
    }),
  );
};

/** Temporarily unblock a domain ("unblock for 5 minutes"). */
const snoozeDomain = async (domain: string, minutes: number): Promise<void> => {
  const m = Math.min(MAX_SNOOZE_MINUTES, Math.max(1, Math.round(minutes)));
  const snoozes = await store.getSnoozes();
  const until = Date.now() + m * 60_000;
  // Snooze the exact blocked entry that matched, so subdomain visits work too.
  const settings = await store.getSettings();
  const session = await store.getSession();
  const entry = findMatch(domain, [...settings.blocklist, ...(session?.autoBlocked ?? [])]) ?? domain;
  snoozes[entry] = until;
  await store.saveSnoozes(snoozes);
  await chrome.alarms.create(`${SNOOZE_ALARM_PREFIX}${entry}`, { when: until + 500 });
  await syncBlockingRules();
};

const isSnoozeAlarm = (name: string): boolean => name.startsWith(SNOOZE_ALARM_PREFIX);

export {
  BLOCKED_PAGE,
  MAX_SNOOZE_MINUTES,
  blockedPageUrl,
  currentBlockedDomains,
  syncBlockingRules,
  redirectOpenBlockedTabs,
  snoozeDomain,
  isSnoozeAlarm,
};
