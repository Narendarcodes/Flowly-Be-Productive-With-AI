/** Shared domain types for Flowly. Everything here is plain data so it can live in chrome.storage. */

export type FlowStatus = 'idle' | 'distracted' | 'drifting' | 'focused' | 'flow';

/** Raw counters collected during one scoring window. Counts only — never key values or page content. */
export interface ActivityCounts {
  keys: number;
  pointer: number;
  scrolls: number;
  tabSwitches: number;
}

export type IdleState = 'active' | 'idle' | 'locked';

/** One scoring window as seen by the engine. */
export interface ActivitySample extends ActivityCounts {
  windowMs: number;
  idleState: IdleState;
  /** 0..1 relevance of the active tab to the goal, or null when unknown (non-http page, no goal). */
  relevance: number | null;
}

/** Normalised feature vector, every entry in [0, 1]. Order matters: it is the logistic model's input order. */
export interface Features {
  typing: number;
  pointer: number;
  switchRate: number;
  idle: number;
  relevance: number;
}

export const FEATURE_KEYS = [
  'typing',
  'pointer',
  'switchRate',
  'idle',
  'relevance',
] as const satisfies readonly (keyof Features)[];

export interface LogisticModel {
  version: number;
  /** Same order as FEATURE_KEYS. */
  weights: number[];
  bias: number;
  /** Number of self-report labels the model has been trained on. */
  updates: number;
}

export interface TimelinePoint {
  t: number;
  score: number;
}

export interface FlowState {
  /** Smoothed (EMA) score 0..100 — what the UI shows. */
  score: number;
  /** Unsmoothed score from the latest window. */
  rawScore: number;
  status: FlowStatus;
  lastTickAt: number;
  /** Seconds of continuous focused/flow status. */
  streakSec: number;
  ticks: number;
}

export interface ActiveSession {
  id: string;
  goal: string;
  startedAt: number;
  /** null = open-ended session. */
  endsAt: number | null;
  focusedSec: number;
  totalSec: number;
  tabSwitches: number;
  flow: FlowState;
  timeline: TimelinePoint[];
  /** Running sum of feature vectors (FEATURE_KEYS order) for the session-average used in labelling. */
  featureSum: number[];
  featureCount: number;
  /** Domains auto-blocked during this session by strict mode. */
  autoBlocked: string[];
}

export interface SessionSummary {
  id: string;
  goal: string;
  startedAt: number;
  endedAt: number;
  focusedSec: number;
  totalSec: number;
  avgScore: number;
  tabSwitches: number;
  timeline: TimelinePoint[];
  avgFeatures: number[];
  /** Self-report: were you focused? null until answered. */
  label: boolean | null;
}

export interface FocusLabel {
  sessionId: string;
  features: number[];
  focused: boolean;
  at: number;
}

export type AiProvider = 'none' | 'gemini' | 'nano';

export interface Settings {
  goal: string;
  sessionMinutes: number;
  blocklist: string[];
  allowlist: string[];
  /** Automatically block sites the relevance check marks as off-goal during a session. */
  strictMode: boolean;
  privacy: {
    /** Count keystrokes/pointer events (counts only) in pages. */
    activityCounting: boolean;
    /** Use the on-device embedding model for relevance (downloads model weights once). */
    embeddings: boolean;
    notifications: boolean;
  };
  ai: {
    provider: AiProvider;
    geminiApiKey: string;
  };
}

export type RelevanceVerdict = 'allow' | 'block' | 'unsure';
export type RelevanceMethod = 'rule' | 'embedding' | 'keyword' | 'llm' | 'none';

export interface RelevanceResult {
  verdict: RelevanceVerdict;
  /** 0..1 value fed to the scoring engine. */
  relevance: number;
  similarity: number | null;
  method: RelevanceMethod;
  reason: string;
}

export interface TabRelevance extends RelevanceResult {
  hostname: string;
  title: string;
  checkedAt: number;
}
