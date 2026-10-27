import { activeBlockedDomains, BLOCK_RULE_ID, buildBlockingRules, pruneSnoozes } from '../index';
import { describe, expect, it } from 'vitest';

const base = {
  blocked: ['reddit.com', 'https://www.youtube.com/', 'x.com'],
  allowlist: [],
  snoozed: {},
  now: 1_000,
  blockedPageUrl: 'chrome-extension://abc/blocked/index.html',
};

describe('blocking rules', () => {
  it('generates a single redirect rule for all blocked domains', () => {
    const rules = buildBlockingRules(base);
    expect(rules).toHaveLength(1);
    const [rule] = rules;
    expect(rule.id).toBe(BLOCK_RULE_ID);
    expect(rule.action.type).toBe('redirect');
    expect(rule.action.redirect.regexSubstitution).toBe('chrome-extension://abc/blocked/index.html#\\0');
    expect(rule.condition.requestDomains).toEqual(['reddit.com', 'x.com', 'youtube.com']);
    expect(rule.condition.resourceTypes).toEqual(['main_frame']);
    expect(new RegExp(rule.condition.regexFilter).test('https://reddit.com/r/all')).toBe(true);
    expect(rule.condition.excludedRequestDomains).toBeUndefined();
  });

  it('returns no rules when nothing is blocked', () => {
    expect(buildBlockingRules({ ...base, blocked: [] })).toEqual([]);
    expect(buildBlockingRules({ ...base, blocked: ['not a domain'] })).toEqual([]);
  });

  it('skips snoozed domains until the snooze expires', () => {
    const snoozed = { 'reddit.com': 2_000 };
    expect(activeBlockedDomains({ ...base, snoozed })).toEqual(['x.com', 'youtube.com']);
    expect(activeBlockedDomains({ ...base, snoozed, now: 2_000 })).toEqual(['reddit.com', 'x.com', 'youtube.com']);
  });

  it('never blocks allowlisted domains and excludes them from the rule', () => {
    const rules = buildBlockingRules({ ...base, allowlist: ['x.com', 'music.youtube.com'] });
    expect(rules[0].condition.requestDomains).toEqual(['reddit.com', 'youtube.com']);
    expect(rules[0].condition.excludedRequestDomains).toEqual(['music.youtube.com', 'x.com']);
  });

  it('prunes expired snoozes', () => {
    expect(pruneSnoozes({ a: 5, b: 50 }, 10)).toEqual({ b: 50 });
  });
});
