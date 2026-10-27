import {
  blendedScore,
  classifyStatus,
  DEFAULT_MODEL,
  DEFAULT_SCORING_CONFIG as cfg,
  ema,
  extractFeatures,
  heuristicScore,
  initialFlowState,
  modelTrust,
  tick,
  toVector,
  fromVector,
} from '../index';
import { describe, expect, it } from 'vitest';
import type { ActivitySample, Features } from '../index';

const sample = (over: Partial<ActivitySample> = {}): ActivitySample => ({
  keys: 0,
  pointer: 0,
  scrolls: 0,
  tabSwitches: 0,
  windowMs: 60_000,
  idleState: 'active',
  relevance: null,
  ...over,
});

const deepWork = sample({ keys: 150, pointer: 40, scrolls: 20, relevance: 1 });
const doomScroll = sample({ keys: 0, pointer: 10, scrolls: 80, tabSwitches: 8, relevance: 0.1 });

describe('ema', () => {
  it('seeds with the first value', () => {
    expect(ema(null, 80, 0.3)).toBe(80);
  });
  it('moves a fraction alpha toward the new value', () => {
    expect(ema(50, 100, 0.3)).toBeCloseTo(65);
    expect(ema(50, 100, 1)).toBe(100);
    expect(ema(50, 100, 0)).toBe(50);
  });
  it('converges to a constant input', () => {
    let v: number | null = null;
    for (let i = 0; i < 50; i++) v = ema(v === null ? 0 : v, 70, 0.3);
    expect(v).toBeCloseTo(70, 3);
  });
  it('clamps alpha outside [0,1]', () => {
    expect(ema(50, 100, 5)).toBe(100);
  });
});

describe('extractFeatures', () => {
  it('normalises rates per minute and clamps to [0,1]', () => {
    const f = extractFeatures(sample({ keys: 60, windowMs: 30_000 }), cfg); // 120 keys/min = target
    expect(f.typing).toBe(1);
    const g = extractFeatures(sample({ keys: 30, windowMs: 60_000 }), cfg);
    expect(g.typing).toBeCloseTo(0.25);
    expect(extractFeatures(sample({ keys: 99999 }), cfg).typing).toBe(1);
  });
  it('computes switches per minute', () => {
    expect(extractFeatures(sample({ tabSwitches: 3 }), cfg).switchRate).toBeCloseTo(0.5);
    expect(extractFeatures(sample({ tabSwitches: 3, windowMs: 30_000 }), cfg).switchRate).toBe(1);
  });
  it('maps idle/locked to 1 and uses neutral relevance when unknown', () => {
    expect(extractFeatures(sample({ idleState: 'idle' }), cfg).idle).toBe(1);
    expect(extractFeatures(sample({ idleState: 'locked' }), cfg).idle).toBe(1);
    expect(extractFeatures(sample(), cfg).relevance).toBe(cfg.neutralRelevance);
  });
  it('guards against zero-length windows', () => {
    const f = extractFeatures(sample({ keys: 10, windowMs: 0 }), cfg);
    expect(Number.isFinite(f.typing)).toBe(true);
  });
  it('round-trips through the vector form', () => {
    const f = extractFeatures(deepWork, cfg);
    expect(fromVector(toVector(f))).toEqual(f);
    expect(toVector(f)).toHaveLength(5);
  });
});

describe('heuristicScore', () => {
  it('rewards on-goal typing and penalises switching, idling and off-goal pages', () => {
    const good = heuristicScore(extractFeatures(deepWork, cfg), cfg);
    const bad = heuristicScore(extractFeatures(doomScroll, cfg), cfg);
    const idle = heuristicScore(extractFeatures(sample({ idleState: 'idle', relevance: 1 }), cfg), cfg);
    expect(good).toBeGreaterThan(85);
    expect(bad).toBeLessThan(20);
    expect(idle).toBeLessThan(30);
  });
  it('stays within 0..100', () => {
    const max: Features = { typing: 1, pointer: 1, switchRate: 0, idle: 0, relevance: 1 };
    const min: Features = { typing: 0, pointer: 0, switchRate: 1, idle: 1, relevance: 0 };
    expect(heuristicScore(max, cfg)).toBe(100);
    expect(heuristicScore(min, cfg)).toBe(0);
  });
  it('is driven by config, not magic numbers', () => {
    const f: Features = { typing: 0.5, pointer: 0, switchRate: 0, idle: 0, relevance: 0.5 };
    const custom = { ...cfg, heuristic: { base: 0, weights: { ...cfg.heuristic.weights, typing: 1, relevance: 0 } } };
    expect(heuristicScore(f, custom)).toBe(50);
  });
});

describe('classifyStatus', () => {
  it('maps thresholds', () => {
    expect(classifyStatus(80, null, false, cfg)).toBe('flow');
    expect(classifyStatus(60, null, false, cfg)).toBe('focused');
    expect(classifyStatus(40, null, false, cfg)).toBe('drifting');
    expect(classifyStatus(10, null, false, cfg)).toBe('distracted');
    expect(classifyStatus(99, null, true, cfg)).toBe('idle');
  });
  it('applies hysteresis when leaving a level', () => {
    expect(classifyStatus(72, 'flow', false, cfg)).toBe('flow'); // 72 >= 75-5
    expect(classifyStatus(72, 'focused', false, cfg)).toBe('focused'); // entering flow needs 75
    expect(classifyStatus(69, 'flow', false, cfg)).toBe('focused');
    expect(classifyStatus(52, 'focused', false, cfg)).toBe('focused');
    expect(classifyStatus(52, 'drifting', false, cfg)).toBe('drifting');
  });
});

describe('model blending', () => {
  it('uses only the heuristic before any labels', () => {
    const f = extractFeatures(deepWork, cfg);
    expect(modelTrust(DEFAULT_MODEL, cfg)).toBe(0);
    expect(blendedScore(f, DEFAULT_MODEL, cfg)).toBeCloseTo(heuristicScore(f, cfg), 1);
  });
  it('trusts the model fully after labelsForFullTrust labels', () => {
    const trained = { ...DEFAULT_MODEL, weights: [0, 0, 0, 0, 0], bias: 0, updates: cfg.labelsForFullTrust };
    expect(modelTrust(trained, cfg)).toBe(1);
    expect(blendedScore(extractFeatures(deepWork, cfg), trained, cfg)).toBeCloseTo(50, 1);
    expect(modelTrust({ ...trained, updates: 5 }, cfg)).toBeCloseTo(0.5);
  });
});

describe('tick', () => {
  it('seeds the EMA on the first tick and smooths afterwards', () => {
    const t0 = initialFlowState(0);
    const r1 = tick(t0, deepWork, DEFAULT_MODEL, cfg, 60_000);
    expect(r1.state.score).toBe(r1.state.rawScore);
    expect(r1.state.ticks).toBe(1);
    const r2 = tick(r1.state, doomScroll, DEFAULT_MODEL, cfg, 120_000);
    expect(r2.state.score).toBeLessThan(r1.state.score);
    expect(r2.state.score).toBeGreaterThan(r2.state.rawScore); // smoothing lags the drop
  });
  it('counts focused seconds and streaks', () => {
    let state = initialFlowState(0);
    let focused = 0;
    for (let i = 0; i < 3; i++) {
      const r = tick(state, deepWork, DEFAULT_MODEL, cfg, (i + 1) * 60_000);
      state = r.state;
      focused += r.focusedSec;
    }
    expect(state.status).toBe('flow');
    expect(focused).toBe(180);
    expect(state.streakSec).toBe(180);
    const idle = tick(state, sample({ idleState: 'idle' }), DEFAULT_MODEL, cfg, 240_000);
    expect(idle.state.status).toBe('idle');
    expect(idle.state.streakSec).toBe(0);
    expect(idle.focusedSec).toBe(0);
  });
});
