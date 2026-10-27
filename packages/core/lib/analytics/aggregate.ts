import type { SessionSummary } from '../types';

/** Local calendar day key, e.g. "2026-10-27". */
export const dayKey = (t: number): string => {
  const d = new Date(t);
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export interface DayBucket {
  day: string;
  focusedMinutes: number;
  sessions: number;
}

/** Focused minutes per local day for the last `days` days (oldest first), including empty days. */
export const focusMinutesByDay = (history: SessionSummary[], days: number, now: number): DayBucket[] => {
  const buckets = new Map<string, DayBucket>();
  const start = new Date(now);
  start.setHours(12, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const key = dayKey(start.getTime() - i * 86_400_000);
    buckets.set(key, { day: key, focusedMinutes: 0, sessions: 0 });
  }
  for (const s of history) {
    const b = buckets.get(dayKey(s.startedAt));
    if (!b) continue;
    b.focusedMinutes += s.focusedSec / 60;
    b.sessions += 1;
  }
  return [...buckets.values()].map(b => ({ ...b, focusedMinutes: Math.round(b.focusedMinutes * 10) / 10 }));
};

export const formatDuration = (ms: number): string => {
  const total = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = `${m}`.padStart(h > 0 ? 2 : 1, '0');
  return h > 0 ? `${h}:${mm}:${`${s}`.padStart(2, '0')}` : `${mm}:${`${s}`.padStart(2, '0')}`;
};
