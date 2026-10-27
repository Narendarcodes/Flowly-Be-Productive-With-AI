import { blockedPageUrl, syncBlockingRules } from './blocking';
import { store } from './chrome-store';
import { notify } from './notify';
import { embedSimilarity, sendToOffscreen } from './offscreen';
import {
  buildRelevancePrompt,
  canCallAi,
  decideByRules,
  decideBySimilarity,
  geminiRelevance,
  httpHostname,
  isAiConfigured,
  keywordSimilarity,
  needsTiebreak,
  pageText,
  parseRelevanceAnswer,
} from '@extension/core';
import type { RelevanceAnswer, RelevanceResult, Settings, TabRelevance } from '@extension/core';

const EMBEDDING_STATUS_KEY = 'flowly.embeddingStatus';

const setEmbeddingStatus = (status: 'ready' | 'loading' | 'unavailable' | 'off') =>
  chrome.storage.session.set({ [EMBEDDING_STATUS_KEY]: status });

/** On-device similarity: embeddings in the offscreen document, keyword overlap as the always-available fallback. */
const similarity = async (
  goal: string,
  text: string,
  settings: Settings,
): Promise<{ value: number; method: 'embedding' | 'keyword' }> => {
  if (settings.privacy.embeddings) {
    try {
      // The first call downloads/compiles the model; allow it time, later calls take milliseconds.
      const res = await embedSimilarity(goal, text, 45_000);
      if (res.ok && typeof res.similarity === 'number') {
        await setEmbeddingStatus('ready');
        return { value: res.similarity, method: 'embedding' };
      }
      await setEmbeddingStatus('unavailable');
    } catch {
      await setEmbeddingStatus('unavailable');
    }
  } else {
    await setEmbeddingStatus('off');
  }
  return { value: keywordSimilarity(goal, text), method: 'keyword' };
};

const askAi = async (
  settings: Settings,
  goal: string,
  hostname: string,
  title: string,
): Promise<RelevanceAnswer | null> => {
  const now = Date.now();
  if (!canCallAi(await store.getAiLastCall(), now)) return null;
  await store.setAiLastCall(now);
  if (settings.ai.provider === 'gemini') {
    const result = await geminiRelevance({ apiKey: settings.ai.geminiApiKey, goal, hostname, title });
    await store.setAiStatus(result.ok ? 'ok' : result.error);
    return result.ok ? result.answer : null;
  }
  if (settings.ai.provider === 'nano') {
    try {
      const res = await sendToOffscreen(
        {
          target: 'offscreen',
          type: 'NANO_RELEVANCE',
          payload: { prompt: buildRelevancePrompt(goal, hostname, title) },
        },
        30_000,
      );
      const answer = res.ok ? parseRelevanceAnswer(res.text) : null;
      await store.setAiStatus(answer ? 'ok' : res.ok ? 'Invalid response from Gemini Nano' : res.error);
      return answer;
    } catch (error) {
      await store.setAiStatus(error instanceof Error ? error.message : 'Gemini Nano failed');
      return null;
    }
  }
  return null;
};

/** Full relevance pipeline: rules → on-device similarity → optional LLM tiebreak. */
export const assessPage = async (goal: string, hostname: string, title: string, path: string, settings: Settings) => {
  const page = { hostname, title, path };
  const byRule = decideByRules(page, settings);
  if (byRule) return byRule;
  const sim = await similarity(goal, pageText(page), settings);
  let result: RelevanceResult = decideBySimilarity(sim.value, sim.method);
  if (needsTiebreak(result, isAiConfigured(settings))) {
    const answer = await askAi(settings, goal, hostname, title);
    if (answer && answer.confidence >= 0.6) {
      result = {
        verdict: answer.relevant ? 'allow' : 'block',
        relevance: answer.relevant ? 0.9 : 0.15,
        similarity: result.similarity,
        method: 'llm',
        reason: answer.reason,
      };
    }
  }
  return result;
};

/** Evaluate a tab against the current session goal; may auto-block in strict mode. */
export const evaluateTab = async (tab: chrome.tabs.Tab | undefined): Promise<TabRelevance | null> => {
  const session = await store.getSession();
  if (!session || !tab) {
    await store.setTabRelevance(null);
    return null;
  }
  const hostname = httpHostname(tab.url);
  if (!hostname || !tab.url) {
    await store.setTabRelevance(null);
    return null;
  }
  const settings = await store.getSettings();
  const title = (tab.title ?? '').slice(0, 200);
  const path = new URL(tab.url).pathname;
  const cacheKey = `${session.goal}|${hostname}|${title}`;
  const cache = await store.getRelevanceCache();
  let result: TabRelevance | undefined = cache[cacheKey];
  if (!result) {
    const assessed = await assessPage(session.goal, hostname, title, path, settings);
    result = { ...assessed, hostname, title, checkedAt: Date.now() };
    await store.putRelevanceCache(cacheKey, result);
  }
  if (tab.active) await store.setTabRelevance(result);

  if (result.verdict === 'block' && result.method !== 'rule') {
    if (settings.strictMode && tab.id !== undefined) {
      const latest = await store.getSession();
      if (latest && !latest.autoBlocked.includes(hostname)) {
        latest.autoBlocked = [...latest.autoBlocked, hostname];
        await store.saveSession(latest);
        await syncBlockingRules();
      }
      await chrome.tabs.update(tab.id, { url: `${blockedPageUrl()}#${tab.url}` }).catch(() => undefined);
    } else if (tab.active) {
      await notify('flowly-offgoal', 'Is this part of your goal?', `${hostname} looks unrelated to “${session.goal}”.`);
    }
  }
  return result;
};

export const evaluateActiveTab = async (): Promise<TabRelevance | null> => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return evaluateTab(tab);
};
