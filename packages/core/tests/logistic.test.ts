import { cloneDefaultModel, DEFAULT_MODEL, logLoss, predict, sanitizeModel, sgdUpdate } from '../index';
import { describe, expect, it } from 'vitest';

const opts = { learningRate: 0.3, l2: 0.001 };

describe('logistic model', () => {
  it('ships default weights loaded from JSON', () => {
    expect(DEFAULT_MODEL.weights).toHaveLength(5);
    expect(DEFAULT_MODEL.updates).toBe(0);
  });

  it('predicts probabilities in (0,1) that follow the cold-start intuition', () => {
    const focused = predict(DEFAULT_MODEL, [1, 0.6, 0, 0, 1]);
    const distracted = predict(DEFAULT_MODEL, [0, 0.9, 1, 0, 0.1]);
    expect(focused).toBeGreaterThan(0.9);
    expect(distracted).toBeLessThan(0.1);
    expect(predict(DEFAULT_MODEL, [0, 0, 0, 0, 0])).toBeGreaterThan(0);
  });

  it('a single SGD step moves the prediction toward the label and does not mutate input', () => {
    const m = cloneDefaultModel();
    const x = [0.5, 0.5, 0.2, 0, 0.5];
    const before = predict(m, x);
    const up = sgdUpdate(m, x, true, opts);
    const down = sgdUpdate(m, x, false, opts);
    expect(predict(up, x)).toBeGreaterThan(before);
    expect(predict(down, x)).toBeLessThan(before);
    expect(up.updates).toBe(1);
    expect(m.weights).toEqual(DEFAULT_MODEL.weights);
  });

  it('learns a user-specific pattern with online updates (log-loss decreases)', () => {
    // This user is focused while pointer-heavy (e.g. design work) even with little typing,
    // which the cold-start prior under-rates.
    const data = [
      { x: [0.05, 0.9, 0.1, 0, 0.5], y: true },
      { x: [0.1, 0.8, 0.0, 0, 0.6], y: true },
      { x: [0.0, 0.9, 0.9, 0, 0.2], y: false },
      { x: [0.0, 0.1, 0.0, 1, 0.5], y: false },
    ];
    let m = cloneDefaultModel();
    const initialLoss = logLoss(m, data);
    for (let epoch = 0; epoch < 30; epoch++) for (const d of data) m = sgdUpdate(m, d.x, d.y, opts);
    expect(logLoss(m, data)).toBeLessThan(initialLoss);
    expect(predict(m, data[0].x)).toBeGreaterThan(0.5);
    expect(predict(m, data[2].x)).toBeLessThan(0.5);
  });

  it('keeps weights bounded under L2 with repeated identical labels', () => {
    let m = cloneDefaultModel();
    for (let i = 0; i < 2000; i++) m = sgdUpdate(m, [1, 1, 0, 0, 1], true, { learningRate: 0.3, l2: 0.05 });
    expect(m.weights.every(w => Number.isFinite(w) && Math.abs(w) < 50)).toBe(true);
  });

  it('sanitizes corrupt stored models back to the default', () => {
    expect(sanitizeModel(null)).toEqual(cloneDefaultModel());
    expect(sanitizeModel({ version: 1, weights: [1, 2], bias: 0, updates: 3 })).toEqual(cloneDefaultModel());
    expect(sanitizeModel({ version: 1, weights: [1, 2, 3, 4, NaN], bias: 0 })).toEqual(cloneDefaultModel());
    const ok = { version: 1, weights: [1, 2, 3, 4, 5], bias: 0.5, updates: 7 };
    expect(sanitizeModel(ok)).toEqual(ok);
  });
});
