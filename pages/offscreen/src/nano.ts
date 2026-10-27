import { JSON_RESPONSE_SCHEMA } from '@extension/core';

/** Minimal typing for Chrome's built-in Prompt API (Gemini Nano). */
interface LanguageModelSession {
  prompt(input: string, options?: { responseConstraint?: object }): Promise<string>;
  destroy(): void;
}

interface LanguageModelStatic {
  availability(): Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>;
  create(options?: object): Promise<LanguageModelSession>;
}

const getApi = (): LanguageModelStatic | null =>
  (globalThis as unknown as { LanguageModel?: LanguageModelStatic }).LanguageModel ?? null;

export const nanoAvailability = async (): Promise<string> => {
  const api = getApi();
  if (!api) return 'unavailable';
  try {
    return await api.availability();
  } catch {
    return 'unavailable';
  }
};

/** Runs entirely on-device. Returns the raw JSON text; the background validates it with Zod. */
export const nanoPrompt = async (prompt: string): Promise<string> => {
  const api = getApi();
  if (!api) throw new Error('Chrome built-in AI is not available in this browser');
  if ((await api.availability()) !== 'available') throw new Error('Gemini Nano model is not downloaded yet');
  const session = await api.create();
  try {
    return await session.prompt(prompt, { responseConstraint: JSON_RESPONSE_SCHEMA });
  } finally {
    session.destroy();
  }
};
