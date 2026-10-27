import { buildRelevancePrompt } from './prompt';
import { extractGeminiText, GEMINI_RESPONSE_SCHEMA, parseRelevanceAnswer } from './schema';
import type { RelevanceAnswer } from './schema';

export const GEMINI_MODEL = 'gemini-2.5-flash-lite';
export const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type AiResult = { ok: true; answer: RelevanceAnswer } | { ok: false; error: string };

/**
 * Ask Gemini (with the user's own API key) whether a tab is relevant to the goal.
 * Uses structured output (responseSchema) and validates the reply with Zod.
 * The key travels in a header, never in the URL.
 */
export const geminiRelevance = async (
  params: { apiKey: string; goal: string; hostname: string; title: string; timeoutMs?: number },
  fetchFn: FetchLike = fetch,
): Promise<AiResult> => {
  if (!params.apiKey.trim()) return { ok: false, error: 'No API key configured' };
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), params.timeoutMs ?? 8000) : null;
  try {
    const response = await fetchFn(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': params.apiKey.trim() },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: buildRelevancePrompt(params.goal, params.hostname, params.title) }] },
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 200,
          responseMimeType: 'application/json',
          responseSchema: GEMINI_RESPONSE_SCHEMA,
        },
      }),
      signal: controller?.signal,
    });
    if (!response.ok) return { ok: false, error: `Gemini returned HTTP ${response.status}` };
    const text = extractGeminiText(await response.json());
    const answer = parseRelevanceAnswer(text);
    return answer ? { ok: true, answer } : { ok: false, error: 'Gemini response did not match the expected schema' };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Network error' };
  } finally {
    if (timer) clearTimeout(timer);
  }
};
