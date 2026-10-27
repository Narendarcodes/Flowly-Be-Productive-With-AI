/** Seeded into the user's editable blocklist on first install. */
export const DEFAULT_BLOCKLIST = [
  'facebook.com',
  'instagram.com',
  'tiktok.com',
  'x.com',
  'twitter.com',
  'reddit.com',
  'netflix.com',
  'twitch.tv',
];

/**
 * Built-in hints: sites that are almost always work tools. They are treated as on-goal
 * unless the user blocklists them. Users can override with their own lists.
 */
export const WORK_DOMAINS = [
  'github.com',
  'gitlab.com',
  'stackoverflow.com',
  'stackexchange.com',
  'developer.mozilla.org',
  'docs.google.com',
  'notion.so',
  'linear.app',
  'figma.com',
  'localhost',
];

/** Normalise user input ("https://www.Reddit.com/r/x") to a bare hostname ("reddit.com"). Returns '' if invalid. */
export const normalizeDomain = (input: string): string => {
  let value = input.trim().toLowerCase();
  if (!value) return '';
  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, '');
  value = value.split(/[/?#]/)[0] ?? '';
  value = value
    .replace(/:\d+$/, '')
    .replace(/^\*\./, '')
    .replace(/^www\./, '')
    .replace(/\.$/, '');
  if (!/^[a-z0-9.-]+$/.test(value) || value.startsWith('.') || value.includes('..')) return '';
  return value;
};

/** Normalise, de-duplicate and sort a list of domains. */
export const normalizeDomainList = (inputs: string[]): string[] =>
  [...new Set(inputs.map(normalizeDomain).filter(Boolean))].sort();

/** True when `hostname` equals `domain` or is a subdomain of it. */
export const matchesDomain = (hostname: string, domain: string): boolean => {
  const host = normalizeDomain(hostname);
  const d = normalizeDomain(domain);
  if (!host || !d) return false;
  return host === d || host.endsWith(`.${d}`);
};

export const findMatch = (hostname: string, list: string[]): string | null =>
  list.find(d => matchesDomain(hostname, d)) ?? null;

/** Hostname of an http(s) URL, or null for anything else (chrome://, file://, invalid). */
export const httpHostname = (url: string | undefined): string | null => {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.hostname.toLowerCase();
  } catch {
    return null;
  }
};
