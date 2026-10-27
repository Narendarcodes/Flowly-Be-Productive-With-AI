export const clamp = (value: number, min = 0, max = 1): number => {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
};

export const sigmoid = (z: number): number => 1 / (1 + Math.exp(-z));

/** Exponential moving average. `prev === null` seeds the average with `value`. */
export const ema = (prev: number | null, value: number, alpha: number): number => {
  const a = clamp(alpha, 0, 1);
  if (prev === null || Number.isNaN(prev)) return value;
  return a * value + (1 - a) * prev;
};

export const mean = (values: number[]): number =>
  values.length === 0 ? 0 : values.reduce((sum, v) => sum + v, 0) / values.length;
