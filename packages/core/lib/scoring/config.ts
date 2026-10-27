import type { Features, FlowStatus } from '../types';

export interface ScoringConfig {
  /** Keystrokes per minute that count as "fully engaged typing". */
  typingTargetPerMin: number;
  /** Pointer events per minute that count as "fully engaged pointing/scrolling". */
  pointerTargetPerMin: number;
  /** Tab switches per minute at which the switching penalty saturates. */
  maxSwitchesPerMin: number;
  /** Relevance used when the active tab's relevance is unknown. */
  neutralRelevance: number;
  heuristic: {
    base: number;
    weights: Features;
  };
  /** EMA smoothing factor in (0, 1]; higher reacts faster. */
  emaAlpha: number;
  /** Labels after which the learned model fully replaces the heuristic. */
  labelsForFullTrust: number;
  /** Status thresholds on the smoothed score, entered at `enter`, left below `enter - hysteresis`. */
  thresholds: Record<Exclude<FlowStatus, 'idle' | 'distracted'>, number>;
  hysteresis: number;
  sgd: {
    learningRate: number;
    l2: number;
  };
  /** Max points kept on a session timeline. */
  timelineMax: number;
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  typingTargetPerMin: 120,
  pointerTargetPerMin: 90,
  maxSwitchesPerMin: 6,
  neutralRelevance: 0.5,
  heuristic: {
    base: 0.25,
    weights: {
      typing: 0.35,
      pointer: 0.15,
      switchRate: -0.4,
      idle: -0.6,
      relevance: 0.35,
    },
  },
  emaAlpha: 0.3,
  labelsForFullTrust: 10,
  thresholds: {
    drifting: 35,
    focused: 55,
    flow: 75,
  },
  hysteresis: 5,
  sgd: {
    learningRate: 0.3,
    l2: 0.001,
  },
  timelineMax: 240,
};
