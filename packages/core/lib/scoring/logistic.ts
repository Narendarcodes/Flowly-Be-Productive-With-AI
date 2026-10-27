import defaultModelJson from './default-model.json';
import { sigmoid } from './math';
import { FEATURE_KEYS } from '../types';
import type { LogisticModel } from '../types';

const dot = (a: number[], b: number[]): number => a.reduce((sum, v, i) => sum + v * (b[i] ?? 0), 0);

const isFiniteArray = (v: unknown, length: number): v is number[] =>
  Array.isArray(v) && v.length === length && v.every(n => typeof n === 'number' && Number.isFinite(n));

export const DEFAULT_MODEL: LogisticModel = Object.freeze({ ...defaultModelJson }) as LogisticModel;

export const cloneDefaultModel = (): LogisticModel => ({ ...DEFAULT_MODEL, weights: [...DEFAULT_MODEL.weights] });

/** Validates a model loaded from storage, falling back to the default when it is corrupt or stale. */
export const sanitizeModel = (value: unknown): LogisticModel => {
  const m = value as Partial<LogisticModel> | null | undefined;
  if (
    !m ||
    m.version !== DEFAULT_MODEL.version ||
    !isFiniteArray(m.weights, FEATURE_KEYS.length) ||
    typeof m.bias !== 'number' ||
    !Number.isFinite(m.bias)
  ) {
    return cloneDefaultModel();
  }
  return { version: m.version, weights: [...m.weights], bias: m.bias, updates: Math.max(0, m.updates ?? 0) };
};

/** P(focused | x). */
export const predict = (model: LogisticModel, x: number[]): number => sigmoid(dot(model.weights, x) + model.bias);

/**
 * One step of online stochastic gradient descent on the log-loss with L2 regularisation.
 * Returns a new model; the input is not mutated.
 */
export const sgdUpdate = (
  model: LogisticModel,
  x: number[],
  focused: boolean,
  opts: { learningRate: number; l2: number },
): LogisticModel => {
  const y = focused ? 1 : 0;
  const error = y - predict(model, x);
  const weights = model.weights.map((w, i) => w + opts.learningRate * (error * (x[i] ?? 0) - opts.l2 * w));
  return {
    version: model.version,
    weights,
    bias: model.bias + opts.learningRate * error,
    updates: model.updates + 1,
  };
};

/** Mean log-loss over a labelled set; handy for tests and for diagnostics. */
export const logLoss = (model: LogisticModel, data: { x: number[]; y: boolean }[]): number => {
  if (data.length === 0) return 0;
  const eps = 1e-9;
  const total = data.reduce((sum, { x, y }) => {
    const p = Math.min(1 - eps, Math.max(eps, predict(model, x)));
    return sum - (y ? Math.log(p) : Math.log(1 - p));
  }, 0);
  return total / data.length;
};
