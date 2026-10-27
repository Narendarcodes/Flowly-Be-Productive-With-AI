/**
 * Build the tiebreak prompt. Only the goal, hostname and tab title are included —
 * never page content, keystrokes or full URLs with query strings.
 */
export const buildRelevancePrompt = (goal: string, hostname: string, title: string): string =>
  [
    "You decide whether a browser tab helps with the user's current work goal.",
    'Answer strictly as JSON with keys relevant (boolean), confidence (0-1) and reason (one short sentence).',
    'Reference material, documentation, tools and search results that plausibly serve the goal are relevant.',
    'Entertainment, social feeds and unrelated shopping or news are not.',
    '',
    `Goal: ${goal.slice(0, 300)}`,
    `Site: ${hostname.slice(0, 200)}`,
    `Tab title: ${title.slice(0, 200)}`,
  ].join('\n');
