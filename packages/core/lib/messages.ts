import type { ActivityCounts } from './types';

/** Messages pages/content scripts send to the background service worker. */
export type BackgroundMessage =
  | { type: 'ACTIVITY'; payload: Partial<ActivityCounts> }
  | { type: 'START_SESSION'; payload: { goal: string; minutes: number } }
  | { type: 'STOP_SESSION' }
  | { type: 'SNOOZE_SITE'; payload: { domain: string; minutes: number } }
  | { type: 'SUBMIT_LABEL'; payload: { sessionId: string; focused: boolean } }
  | { type: 'DISMISS_LABEL' }
  | { type: 'RESET_DATA' };

/** Messages the background sends to the offscreen document. */
export type OffscreenMessage =
  | { target: 'offscreen'; type: 'EMBED_SIMILARITY'; payload: { goal: string; text: string; modelHost?: string } }
  | { target: 'offscreen'; type: 'NANO_RELEVANCE'; payload: { prompt: string } }
  | { target: 'offscreen'; type: 'PING' };

export type OffscreenResponse = { ok: true; similarity?: number; text?: string } | { ok: false; error: string };

export interface BackgroundResponse {
  ok: boolean;
  error?: string;
  sessionId?: string;
}
