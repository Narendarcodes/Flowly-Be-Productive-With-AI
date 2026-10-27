import { clamp } from './math';
import { FEATURE_KEYS } from '../types';
import type { ScoringConfig } from './config';
import type { Features } from '../types';

/** Linear, explainable cold-start score in 0..100. */
export const heuristicScore = (f: Features, cfg: ScoringConfig): number => {
  const { base, weights } = cfg.heuristic;
  const raw = FEATURE_KEYS.reduce((acc, k) => acc + weights[k] * f[k], base);
  return Math.round(clamp(raw) * 1000) / 10;
};
