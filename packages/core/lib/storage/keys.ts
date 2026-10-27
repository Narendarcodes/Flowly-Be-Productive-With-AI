/** Every chrome.storage key Flowly uses, in one place. */
export const KEYS = {
  /** local */
  settings: 'flowly.settings',
  model: 'flowly.model',
  labels: 'flowly.labels',
  history: 'flowly.history',
  session: 'flowly.session',
  pendingLabel: 'flowly.pendingLabel',
  snoozes: 'flowly.snoozes',
  /** session (cleared when the browser closes, survives service-worker sleep) */
  activity: 'flowly.activity',
  tabRelevance: 'flowly.tabRelevance',
  relevanceCache: 'flowly.relevanceCache',
  aiLastCall: 'flowly.aiLastCall',
  aiStatus: 'flowly.aiStatus',
} as const;

export const LOCAL_KEYS = [
  KEYS.settings,
  KEYS.model,
  KEYS.labels,
  KEYS.history,
  KEYS.session,
  KEYS.pendingLabel,
  KEYS.snoozes,
] as const;

export const SESSION_KEYS = [
  KEYS.activity,
  KEYS.tabRelevance,
  KEYS.relevanceCache,
  KEYS.aiLastCall,
  KEYS.aiStatus,
] as const;

export const MAX_LABELS = 500;
export const MAX_HISTORY = 200;
