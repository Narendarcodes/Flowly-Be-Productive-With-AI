import { extractFeatures, toVector } from './features';
import { heuristicScore } from './heuristic';
import { predict } from './logistic';
import { clamp, ema } from './math';
import type { ScoringConfig } from './config';
import type { ActivitySample, Features, FlowState, FlowStatus, LogisticModel } from '../types';

const RANK: Record<FlowStatus, number> = { idle: -1, distracted: 0, drifting: 1, focused: 2, flow: 3 };

/** Status from the smoothed score, with hysteresis so the label does not flap around a threshold. */
export const classifyStatus = (
  score: number,
  prev: FlowStatus | null,
  isIdle: boolean,
  cfg: ScoringConfig,
): FlowStatus => {
  if (isIdle) return 'idle';
  const { thresholds, hysteresis } = cfg;
  const levels: [FlowStatus, number][] = [
    ['flow', thresholds.flow],
    ['focused', thresholds.focused],
    ['drifting', thresholds.drifting],
  ];
  for (const [status, enter] of levels) {
    // Staying at (or above) a level you're already in only requires clearing enter - hysteresis.
    const effective = prev && RANK[prev] >= RANK[status] ? enter - hysteresis : enter;
    if (score >= effective) return status;
  }
  return 'distracted';
};

/** How much the learned model is trusted: 0 with no labels, 1 after `labelsForFullTrust` labels. */
export const modelTrust = (model: LogisticModel, cfg: ScoringConfig): number =>
  clamp(model.updates / Math.max(1, cfg.labelsForFullTrust));

/** Blend heuristic (cold start) with the logistic model as labels accumulate. Returns 0..100. */
export const blendedScore = (f: Features, model: LogisticModel, cfg: ScoringConfig): number => {
  const h = heuristicScore(f, cfg);
  const w = modelTrust(model, cfg);
  const learned = predict(model, toVector(f)) * 100;
  return Math.round(((1 - w) * h + w * learned) * 10) / 10;
};

export const initialFlowState = (now: number): FlowState => ({
  score: 0,
  rawScore: 0,
  status: 'idle',
  lastTickAt: now,
  streakSec: 0,
  ticks: 0,
});

export interface TickResult {
  state: FlowState;
  features: Features;
  /** Seconds of this window counted as focused (status focused or flow). */
  focusedSec: number;
}

/** Pure scoring step: one activity window in, next flow state out. */
export const tick = (
  prev: FlowState,
  sample: ActivitySample,
  model: LogisticModel,
  cfg: ScoringConfig,
  now: number,
): TickResult => {
  const features = extractFeatures(sample, cfg);
  const rawScore = blendedScore(features, model, cfg);
  const score = Math.round(ema(prev.ticks === 0 ? null : prev.score, rawScore, cfg.emaAlpha) * 10) / 10;
  const status = classifyStatus(score, prev.ticks === 0 ? null : prev.status, features.idle === 1, cfg);
  const windowSec = Math.round(sample.windowMs / 1000);
  const isFocused = status === 'focused' || status === 'flow';
  return {
    features,
    focusedSec: isFocused ? windowSec : 0,
    state: {
      score,
      rawScore,
      status,
      lastTickAt: now,
      streakSec: isFocused ? prev.streakSec + windowSec : 0,
      ticks: prev.ticks + 1,
    },
  };
};
