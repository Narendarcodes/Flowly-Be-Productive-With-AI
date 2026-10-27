import { DEFAULT_SCORING_CONFIG } from './scoring/config';
import { initialFlowState, tick } from './scoring/engine';
import { toVector } from './scoring/features';
import { FEATURE_KEYS } from './types';
import type { ScoringConfig } from './scoring/config';
import type { ActiveSession, ActivitySample, LogisticModel, SessionSummary } from './types';

export const createSession = (goal: string, minutes: number, now: number, id: string): ActiveSession => ({
  id,
  goal: goal.trim(),
  startedAt: now,
  endsAt: minutes > 0 ? now + minutes * 60_000 : null,
  focusedSec: 0,
  totalSec: 0,
  tabSwitches: 0,
  flow: initialFlowState(now),
  timeline: [],
  featureSum: FEATURE_KEYS.map(() => 0),
  featureCount: 0,
  autoBlocked: [],
});

/** Downsample a timeline to at most `max` points by averaging neighbours. */
export const downsample = <T extends { t: number; score: number }>(
  points: T[],
  max: number,
): { t: number; score: number }[] => {
  if (points.length <= max) return points.map(p => ({ t: p.t, score: p.score }));
  const bucket = points.length / max;
  const out: { t: number; score: number }[] = [];
  for (let i = 0; i < max; i++) {
    const slice = points.slice(Math.floor(i * bucket), Math.floor((i + 1) * bucket));
    if (slice.length === 0) continue;
    out.push({
      t: slice[Math.floor(slice.length / 2)].t,
      score: Math.round((slice.reduce((s, p) => s + p.score, 0) / slice.length) * 10) / 10,
    });
  }
  return out;
};

/** Apply one activity window to the active session. Pure. */
export const applyTick = (
  session: ActiveSession,
  sample: ActivitySample,
  model: LogisticModel,
  now: number,
  cfg: ScoringConfig = DEFAULT_SCORING_CONFIG,
): ActiveSession => {
  const result = tick(session.flow, sample, model, cfg, now);
  const vector = toVector(result.features);
  const timeline = [...session.timeline, { t: now, score: result.state.score }];
  return {
    ...session,
    flow: result.state,
    focusedSec: session.focusedSec + result.focusedSec,
    totalSec: session.totalSec + Math.round(sample.windowMs / 1000),
    tabSwitches: session.tabSwitches + sample.tabSwitches,
    timeline: timeline.length > cfg.timelineMax ? downsample(timeline, Math.floor(cfg.timelineMax / 2)) : timeline,
    featureSum: session.featureSum.map((s, i) => s + (vector[i] ?? 0)),
    featureCount: session.featureCount + 1,
  };
};

export const isSessionExpired = (session: ActiveSession, now: number): boolean =>
  session.endsAt !== null && now >= session.endsAt;

export const summarizeSession = (session: ActiveSession, now: number): SessionSummary => {
  const avgScore =
    session.timeline.length === 0
      ? 0
      : Math.round((session.timeline.reduce((s, p) => s + p.score, 0) / session.timeline.length) * 10) / 10;
  return {
    id: session.id,
    goal: session.goal,
    startedAt: session.startedAt,
    endedAt: session.endsAt !== null ? Math.min(now, session.endsAt) : now,
    focusedSec: session.focusedSec,
    totalSec: session.totalSec,
    avgScore,
    tabSwitches: session.tabSwitches,
    timeline: downsample(session.timeline, 60),
    avgFeatures:
      session.featureCount === 0
        ? session.featureSum.map(() => 0)
        : session.featureSum.map(s => s / session.featureCount),
    label: null,
  };
};

/** Remaining milliseconds in a timed session (0 when done), or null for open-ended sessions. */
export const remainingMs = (session: Pick<ActiveSession, 'endsAt'>, now: number): number | null =>
  session.endsAt === null ? null : Math.max(0, session.endsAt - now);
