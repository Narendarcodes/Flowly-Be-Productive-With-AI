import { embeddingSimilarity } from '@src/embeddings';
import { nanoPrompt } from '@src/nano';
import type { OffscreenMessage, OffscreenResponse } from '@extension/core';

const handle = async (message: OffscreenMessage): Promise<OffscreenResponse> => {
  switch (message.type) {
    case 'PING':
      return { ok: true };
    case 'EMBED_SIMILARITY':
      return {
        ok: true,
        similarity: await embeddingSimilarity(message.payload.goal, message.payload.text, message.payload.modelHost),
      };
    case 'NANO_RELEVANCE':
      return { ok: true, text: await nanoPrompt(message.payload.prompt) };
    default:
      return { ok: false, error: 'Unknown message' };
  }
};

chrome.runtime.onMessage.addListener((message: OffscreenMessage, _sender, sendResponse) => {
  if (message?.target !== 'offscreen') return false;
  handle(message)
    .then(sendResponse)
    .catch((error: unknown) =>
      sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) }),
    );
  return true;
});
