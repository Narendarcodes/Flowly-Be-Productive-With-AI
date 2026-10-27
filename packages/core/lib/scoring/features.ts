import { clamp } from './math';
import { FEATURE_KEYS } from '../types';
import type { ScoringConfig } from './config';
import type { ActivitySample, Features } from '../types';

/** Convert a raw activity window into normalised [0,1] features. Pure. */
export const extractFeatures = (sample: ActivitySample, cfg: ScoringConfig): Features => {
  const minutes = Math.max(sample.windowMs, 1000) / 60000;
  return {
    typing: clamp(sample.keys / minutes / cfg.typingTargetPerMin),
    pointer: clamp((sample.pointer + sample.scrolls) / minutes / cfg.pointerTargetPerMin),
    switchRate: clamp(sample.tabSwitches / minutes / cfg.maxSwitchesPerMin),
    idle: sample.idleState === 'active' ? 0 : 1,
    relevance: clamp(sample.relevance ?? cfg.neutralRelevance),
  };
};

export const toVector = (f: Features): number[] => FEATURE_KEYS.map(k => f[k]);

export const fromVector = (v: number[]): Features =>
  Object.fromEntries(FEATURE_KEYS.map((k, i) => [k, v[i] ?? 0])) as unknown as Features;
