import {
  canCallAi,
  cosineSimilarity,
  decideByRules,
  decideBySimilarity,
  findMatch,
  httpHostname,
  keywordSimilarity,
  matchesDomain,
  needsTiebreak,
  normalizeDomain,
  normalizeDomainList,
  pageText,
  SIMILARITY_THRESHOLDS,
  tokenize,
} from '../index';
import { describe, expect, it } from 'vitest';

describe('domain helpers', () => {
  it('normalises user input to bare hostnames', () => {
    expect(normalizeDomain('https://www.Reddit.com/r/programming?x=1')).toBe('reddit.com');
    expect(normalizeDomain('  *.youtube.com ')).toBe('youtube.com');
    expect(normalizeDomain('news.ycombinator.com:443')).toBe('news.ycombinator.com');
    expect(normalizeDomain('not a domain')).toBe('');
    expect(normalizeDomain('')).toBe('');
    expect(normalizeDomain('..evil')).toBe('');
  });
  it('dedupes and sorts lists', () => {
    expect(normalizeDomainList(['x.com', 'https://x.com', 'b.com', 'bad domain'])).toEqual(['b.com', 'x.com']);
  });
  it('matches subdomains but not lookalikes', () => {
    expect(matchesDomain('old.reddit.com', 'reddit.com')).toBe(true);
    expect(matchesDomain('reddit.com', 'reddit.com')).toBe(true);
    expect(matchesDomain('notreddit.com', 'reddit.com')).toBe(false);
    expect(findMatch('m.youtube.com', ['x.com', 'youtube.com'])).toBe('youtube.com');
  });
  it('only accepts http(s) URLs', () => {
    expect(httpHostname('https://GitHub.com/a')).toBe('github.com');
    expect(httpHostname('chrome://extensions')).toBeNull();
    expect(httpHostname('file:///tmp/a')).toBeNull();
    expect(httpHostname('nonsense')).toBeNull();
    expect(httpHostname(undefined)).toBeNull();
  });
});

describe('rules', () => {
  const lists = { blocklist: ['reddit.com', 'youtube.com'], allowlist: ['music.youtube.com'] };
  it('allowlist beats blocklist', () => {
    expect(decideByRules({ hostname: 'music.youtube.com', title: '' }, lists)?.verdict).toBe('allow');
    expect(decideByRules({ hostname: 'www.youtube.com', title: '' }, lists)?.verdict).toBe('block');
  });
  it('built-in work tools are allowed, unknown sites fall through', () => {
    const r = decideByRules({ hostname: 'github.com', title: 'PRs' }, lists);
    expect(r?.verdict).toBe('allow');
    expect(r?.method).toBe('rule');
    expect(decideByRules({ hostname: 'example.org', title: 'Example' }, lists)).toBeNull();
  });
  it('user blocklist overrides built-in work hints', () => {
    expect(
      decideByRules({ hostname: 'github.com', title: '' }, { blocklist: ['github.com'], allowlist: [] })?.verdict,
    ).toBe('block');
  });
});

describe('keyword similarity', () => {
  it('tokenises, removes stop words and stems', () => {
    expect(tokenize('Learning the React Hooks in 2026 | https://www.example.com')).toEqual([
      'learn',
      'react',
      'hook',
      'example',
    ]);
  });
  it('scores on-goal pages above off-goal pages', () => {
    const goal = 'Write the React hooks chapter of my thesis';
    const on = keywordSimilarity(goal, 'Using the Effect Hook – React docs');
    const off = keywordSimilarity(goal, 'Funny cat compilation 2026 - YouTube');
    expect(on).toBeGreaterThan(SIMILARITY_THRESHOLDS.keyword.allow);
    expect(off).toBeLessThan(SIMILARITY_THRESHOLDS.keyword.block);
  });
  it('returns 0 for empty input and 1 for identical text', () => {
    expect(keywordSimilarity('', 'abc def')).toBe(0);
    expect(keywordSimilarity('kubernetes ingress', 'kubernetes ingress')).toBeCloseTo(1);
  });
  it('gives partial credit for related word forms', () => {
    expect(keywordSimilarity('python testing', 'pytest tutorial python')).toBeGreaterThan(0.2);
  });
});

describe('cosineSimilarity', () => {
  it('handles identical, orthogonal and degenerate vectors', () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
    expect(cosineSimilarity([0, 0], [1, 1])).toBe(0);
    expect(cosineSimilarity([1], [1, 2])).toBe(0);
    expect(cosineSimilarity(new Float32Array([1, 1]), new Float32Array([1, 0]))).toBeCloseTo(Math.SQRT1_2);
  });
});

describe('decideBySimilarity', () => {
  it('maps the similarity bands to verdicts and relevance', () => {
    expect(decideBySimilarity(0.6, 'embedding')).toMatchObject({ verdict: 'allow', relevance: 1, method: 'embedding' });
    expect(decideBySimilarity(0.05, 'embedding')).toMatchObject({ verdict: 'block', relevance: 0.1 });
    const mid = decideBySimilarity(0.28, 'embedding');
    expect(mid.verdict).toBe('unsure');
    expect(mid.relevance).toBeGreaterThan(0.3);
    expect(mid.relevance).toBeLessThan(0.8);
  });
  it('clamps out-of-range similarity', () => {
    expect(decideBySimilarity(7, 'keyword').similarity).toBe(1);
    expect(decideBySimilarity(-1, 'keyword').verdict).toBe('block');
  });
});

describe('page text and AI gating', () => {
  it('builds similarity text from title, host and path without TLD noise', () => {
    expect(
      pageText({ hostname: 'www.typescriptlang.org', title: 'Handbook', path: '/docs/handbook/2/generics.html' }),
    ).toBe('Handbook typescriptlang docs handbook 2 generics html');
  });
  it('only tie-breaks unsure verdicts when AI is configured', () => {
    const unsure = decideBySimilarity(0.28, 'embedding');
    expect(needsTiebreak(unsure, true)).toBe(true);
    expect(needsTiebreak(unsure, false)).toBe(false);
    expect(needsTiebreak(decideBySimilarity(0.9, 'embedding'), true)).toBe(false);
  });
  it('debounces AI calls', () => {
    expect(canCallAi(null, 1000)).toBe(true);
    expect(canCallAi(1000, 5000)).toBe(false);
    expect(canCallAi(1000, 21_000)).toBe(true);
    expect(canCallAi(1000, 2000, 500)).toBe(true);
  });
});
