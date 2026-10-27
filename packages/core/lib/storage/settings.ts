import { DEFAULT_BLOCKLIST, normalizeDomainList } from '../relevance/domains';
import type { AiProvider, Settings } from '../types';

const PROVIDERS: AiProvider[] = ['none', 'gemini', 'nano'];

const bool = (v: unknown, fallback: boolean): boolean => (typeof v === 'boolean' ? v : fallback);
const strList = (v: unknown, fallback: string[]): string[] =>
  Array.isArray(v) ? normalizeDomainList(v.filter((x): x is string => typeof x === 'string')) : [...fallback];

export const DEFAULT_SETTINGS: Settings = {
  goal: '',
  sessionMinutes: 50,
  blocklist: DEFAULT_BLOCKLIST,
  allowlist: [],
  strictMode: false,
  privacy: {
    activityCounting: true,
    embeddings: true,
    notifications: true,
  },
  ai: {
    provider: 'none',
    geminiApiKey: '',
  },
};

/** Merge whatever is in storage with defaults and coerce every field into a valid shape. */
export const sanitizeSettings = (value: unknown): Settings => {
  const v = (value ?? {}) as Partial<Settings> & Record<string, unknown>;
  const privacy = (v.privacy ?? {}) as Partial<Settings['privacy']>;
  const ai = (v.ai ?? {}) as Partial<Settings['ai']>;
  const minutes = Number(v.sessionMinutes);
  return {
    goal: typeof v.goal === 'string' ? v.goal.slice(0, 300) : DEFAULT_SETTINGS.goal,
    sessionMinutes: Number.isFinite(minutes) && minutes >= 0 && minutes <= 480 ? Math.round(minutes) : 50,
    blocklist: strList(v.blocklist, DEFAULT_SETTINGS.blocklist),
    allowlist: strList(v.allowlist, DEFAULT_SETTINGS.allowlist),
    strictMode: bool(v.strictMode, DEFAULT_SETTINGS.strictMode),
    privacy: {
      activityCounting: bool(privacy.activityCounting, DEFAULT_SETTINGS.privacy.activityCounting),
      embeddings: bool(privacy.embeddings, DEFAULT_SETTINGS.privacy.embeddings),
      notifications: bool(privacy.notifications, DEFAULT_SETTINGS.privacy.notifications),
    },
    ai: {
      provider: PROVIDERS.includes(ai.provider as AiProvider) ? (ai.provider as AiProvider) : 'none',
      geminiApiKey: typeof ai.geminiApiKey === 'string' ? ai.geminiApiKey.trim() : '',
    },
  };
};

/** True when the user has configured an LLM that can actually be called. */
export const isAiConfigured = (s: Settings): boolean =>
  s.ai.provider === 'nano' || (s.ai.provider === 'gemini' && s.ai.geminiApiKey.length > 0);
