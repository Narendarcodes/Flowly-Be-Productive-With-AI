import { findMatch, WORK_DOMAINS } from './domains';
import type { RelevanceMethod, RelevanceResult } from '../types';

export interface PageInfo {
  hostname: string;
  title: string;
  /** URL path, used as extra words for similarity (never sent anywhere). */
  path?: string;
}

export interface RuleLists {
  blocklist: string[];
  allowlist: string[];
}

export interface SimilarityThresholds {
  /** At or above: on-goal. */
  allow: number;
  /** Below: off-goal. Between the two: unsure. */
  block: number;
}

/** Thresholds per similarity method; embeddings and keyword overlap live on different scales. */
export const SIMILARITY_THRESHOLDS: Record<'embedding' | 'keyword', SimilarityThresholds> = {
  embedding: { allow: 0.32, block: 0.12 },
  keyword: { allow: 0.2, block: 0.04 },
};

/** Rules first: user allowlist beats user blocklist beats built-in work hints. */
export const decideByRules = (page: PageInfo, lists: RuleLists): RelevanceResult | null => {
  const allowed = findMatch(page.hostname, lists.allowlist);
  if (allowed) {
    return {
      verdict: 'allow',
      relevance: 1,
      similarity: null,
      method: 'rule',
      reason: `${allowed} is on your allowlist`,
    };
  }
  const blocked = findMatch(page.hostname, lists.blocklist);
  if (blocked) {
    return {
      verdict: 'block',
      relevance: 0,
      similarity: null,
      method: 'rule',
      reason: `${blocked} is on your blocklist`,
    };
  }
  const work = findMatch(page.hostname, WORK_DOMAINS);
  if (work) {
    return {
      verdict: 'allow',
      relevance: 0.85,
      similarity: null,
      method: 'rule',
      reason: `${work} is a common work tool`,
    };
  }
  return null;
};

/** Map a similarity score to a verdict and a 0..1 relevance signal. */
export const decideBySimilarity = (
  similarity: number,
  method: Extract<RelevanceMethod, 'embedding' | 'keyword'>,
  thresholds: SimilarityThresholds = SIMILARITY_THRESHOLDS[method],
): RelevanceResult => {
  const s = Math.max(0, Math.min(1, similarity));
  if (s >= thresholds.allow) {
    return { verdict: 'allow', relevance: 1, similarity: s, method, reason: 'Matches your goal' };
  }
  if (s < thresholds.block) {
    return { verdict: 'block', relevance: 0.1, similarity: s, method, reason: 'Looks unrelated to your goal' };
  }
  const span = thresholds.allow - thresholds.block;
  const relevance = 0.3 + (0.5 * (s - thresholds.block)) / span;
  return {
    verdict: 'unsure',
    relevance: Math.round(relevance * 100) / 100,
    similarity: s,
    method,
    reason: 'Possibly related',
  };
};

/** Text that represents a page for similarity: title plus URL words. Hostname TLD noise is dropped. */
export const pageText = (page: PageInfo): string => {
  const host = page.hostname.replace(/^www\./, '').replace(/\.(com|org|net|io|dev|app|co|edu|gov)(\.[a-z]{2})?$/, '');
  const path = (page.path ?? '').replace(/[-_/.]+/g, ' ');
  return `${page.title} ${host.replace(/\./g, ' ')} ${path}`.replace(/\s+/g, ' ').trim();
};

/** Should an unsure verdict be escalated to the optional LLM? Pure so it can be tested. */
export const needsTiebreak = (result: RelevanceResult, aiConfigured: boolean): boolean =>
  aiConfigured && result.verdict === 'unsure';

/** Minimum time between LLM calls (debounce), and whether a call is allowed now. */
export const AI_MIN_INTERVAL_MS = 20_000;

export const canCallAi = (lastCallAt: number | null, now: number, minIntervalMs = AI_MIN_INTERVAL_MS): boolean =>
  lastCallAt === null || now - lastCallAt >= minIntervalMs;
