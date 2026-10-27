import { normalizeDomainList } from '../relevance/domains';

/** Minimal structural type of a chrome.declarativeNetRequest.Rule we generate (keeps this module chrome-free). */
export interface RedirectRule {
  id: number;
  priority: number;
  action: {
    type: 'redirect';
    redirect: { regexSubstitution: string };
  };
  condition: {
    regexFilter: string;
    requestDomains: string[];
    excludedRequestDomains?: string[];
    resourceTypes: ['main_frame'];
  };
}

export const BLOCK_RULE_ID = 1;

export interface BlockingInput {
  /** Domains to block (user blocklist plus session auto-blocks). */
  blocked: string[];
  /** Domains that must never be blocked (user allowlist). */
  allowlist: string[];
  /** domain -> epoch ms until which it is temporarily unblocked. */
  snoozed: Record<string, number>;
  now: number;
  /** chrome.runtime.getURL('blocked/index.html'). The original URL is appended after '#'. */
  blockedPageUrl: string;
}

/** Domains that are actually blocked right now (snoozes and allowlist applied). */
export const activeBlockedDomains = (
  input: Pick<BlockingInput, 'blocked' | 'allowlist' | 'snoozed' | 'now'>,
): string[] => {
  const allow = new Set(normalizeDomainList(input.allowlist));
  return normalizeDomainList(input.blocked).filter(d => !allow.has(d) && !((input.snoozed[d] ?? 0) > input.now));
};

/** Drop expired snoozes. */
export const pruneSnoozes = (snoozed: Record<string, number>, now: number): Record<string, number> =>
  Object.fromEntries(Object.entries(snoozed).filter(([, until]) => until > now));

/**
 * Build the dynamic declarativeNetRequest rules for the current blocking state.
 * One regex rule redirects every top-level navigation to a blocked domain (and its subdomains)
 * to the extension's blocked page, carrying the original URL in the fragment so
 * "unblock for 5 minutes" can send the user straight back.
 */
export const buildBlockingRules = (input: BlockingInput): RedirectRule[] => {
  const domains = activeBlockedDomains(input);
  if (domains.length === 0) return [];
  const allow = normalizeDomainList(input.allowlist);
  return [
    {
      id: BLOCK_RULE_ID,
      priority: 1,
      action: { type: 'redirect', redirect: { regexSubstitution: `${input.blockedPageUrl}#\\0` } },
      condition: {
        regexFilter: '^https?://.*',
        requestDomains: domains,
        ...(allow.length > 0 ? { excludedRequestDomains: allow } : {}),
        resourceTypes: ['main_frame'],
      },
    },
  ];
};
