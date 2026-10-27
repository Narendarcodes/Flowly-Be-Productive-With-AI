/**
 * Lightweight on-device text similarity used when the embedding model is disabled or unavailable.
 * Tokenises, drops stop words, applies a tiny suffix stemmer and returns the cosine similarity of
 * TF-IDF-weighted bag-of-words vectors, smoothed with character trigrams for partial matches.
 */

const STOP_WORDS = new Set(
  (
    'a an and are as at be by for from has have how i in is it its of on or that the this to was were will with ' +
    'my me we our you your www com org net io http https html php index home page new get about vs do does ' +
    'can just into out up what when where who why which'
  ).split(' '),
);

/** Very common page-title words that say little about topic. */
const LOW_SIGNAL = new Set(['login', 'sign', 'account', 'welcome', 'official', 'site', 'online', 'free', 'best']);

const stem = (word: string): string => {
  if (word.length <= 4) return word;
  for (const suffix of ['ingly', 'ings', 'ing', 'edly', 'ed', 'ies', 'es', 's', 'ly', 'ment', 'tion']) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      return suffix === 'ies' ? `${word.slice(0, -3)}y` : word.slice(0, -suffix.length);
    }
  }
  return word;
};

const trigrams = (word: string): string[] => {
  const padded = `_${word}_`;
  const out: string[] = [];
  for (let i = 0; i < padded.length - 2; i++) out.push(padded.slice(i, i + 3));
  return out;
};

const cosine = (a: Map<string, number>, b: Map<string, number>): number => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (const [, v] of a) normA += v * v;
  for (const [, v] of b) normB += v * v;
  for (const [k, v] of a) dotProduct += v * (b.get(k) ?? 0);
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / Math.sqrt(normA * normB);
};

const termVector = (tokens: string[]): Map<string, number> => {
  const v = new Map<string, number>();
  for (const t of tokens) v.set(t, (v.get(t) ?? 0) + (LOW_SIGNAL.has(t) ? 0.3 : 1));
  return v;
};

const trigramVector = (tokens: string[]): Map<string, number> => {
  const v = new Map<string, number>();
  for (const t of tokens) for (const g of trigrams(t)) v.set(g, (v.get(g) ?? 0) + 1);
  return v;
};

export const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/https?:\/\//g, ' ')
    .split(/[^a-z0-9+#]+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t) && !/^\d+$/.test(t))
    .map(stem);

/** Similarity in [0, 1] between a goal and a page descriptor (title + URL words). */
export const keywordSimilarity = (goal: string, page: string): number => {
  const g = tokenize(goal);
  const p = tokenize(page);
  if (g.length === 0 || p.length === 0) return 0;
  const word = cosine(termVector(g), termVector(p));
  const chars = cosine(trigramVector(g), trigramVector(p));
  // Word overlap dominates; trigrams only add partial credit ("react" ~ "reactjs").
  return Math.min(1, Math.round((0.75 * word + 0.25 * chars) * 1000) / 1000);
};

/** Cosine similarity of two dense vectors (used for embeddings). */
export const cosineSimilarity = (a: ArrayLike<number>, b: ArrayLike<number>): number => {
  if (a.length !== b.length || a.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / Math.sqrt(normA * normB);
};
