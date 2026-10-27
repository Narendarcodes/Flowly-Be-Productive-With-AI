import type { OffscreenMessage, OffscreenResponse } from '@extension/core';

const OFFSCREEN_PATH = 'offscreen/index.html';
let creating: Promise<void> | null = null;

const hasDocument = async (): Promise<boolean> => {
  const contexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [chrome.runtime.getURL(OFFSCREEN_PATH)],
  });
  return contexts.length > 0;
};

/** Service workers cannot run transformers.js/WebAssembly models comfortably, so they live in an offscreen document. */
const ensureOffscreen = async (): Promise<void> => {
  if (!chrome.offscreen) throw new Error('Offscreen documents are not supported');
  if (await hasDocument()) return;
  if (!creating) {
    creating = chrome.offscreen
      .createDocument({
        url: OFFSCREEN_PATH,
        reasons: [chrome.offscreen.Reason.WORKERS],
        justification: 'Runs the on-device embedding model and Chrome built-in AI for goal relevance checks.',
      })
      .finally(() => {
        creating = null;
      });
  }
  await creating;
};

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out after ${ms} ms`)), ms);
    promise.then(
      v => {
        clearTimeout(timer);
        resolve(v);
      },
      e => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });

const sendToOffscreen = async (message: OffscreenMessage, timeoutMs: number): Promise<OffscreenResponse> => {
  await ensureOffscreen();
  const response = await withTimeout(
    chrome.runtime.sendMessage<OffscreenMessage, OffscreenResponse>(message),
    timeoutMs,
  );
  if (!response) throw new Error('No response from offscreen document');
  return response;
};

const DEV_MODEL_HOST_KEY = 'flowly.dev.modelHost';

/** Optional developer/E2E override (loopback only, enforced in the offscreen document). */
const devModelHost = async (): Promise<string | undefined> => {
  const value = (await chrome.storage.local.get(DEV_MODEL_HOST_KEY))[DEV_MODEL_HOST_KEY];
  return typeof value === 'string' ? value : undefined;
};

const embedSimilarity = async (goal: string, text: string, timeoutMs: number): Promise<OffscreenResponse> =>
  sendToOffscreen(
    { target: 'offscreen', type: 'EMBED_SIMILARITY', payload: { goal, text, modelHost: await devModelHost() } },
    timeoutMs,
  );

export { ensureOffscreen, sendToOffscreen, devModelHost, embedSimilarity };
