import { cosineSimilarity } from '@extension/core';
import { env, pipeline } from '@huggingface/transformers';
import type { FeatureExtractionPipeline } from '@huggingface/transformers';

const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;
const cache = new Map<string, Float32Array>();

/** Developer/E2E override: load model files from a loopback mirror instead of the Hugging Face Hub. */
const isLoopback = (url: string) => /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//.test(url);

const configure = (devHost?: string) => {
  if (devHost && isLoopback(devHost)) env.remoteHost = devHost;
  // Model weights are fetched once from the Hugging Face Hub and cached by the browser.
  // No user text is ever sent anywhere: inference runs locally in WebAssembly.
  env.allowLocalModels = false;
  env.useBrowserCache = true;
  const onnx = env.backends.onnx;
  if (onnx.wasm) {
    onnx.wasm.wasmPaths = chrome.runtime.getURL('offscreen/ort/');
    onnx.wasm.numThreads = 1; // extension pages are not cross-origin isolated
    onnx.wasm.proxy = false;
  }
};

const getExtractor = (devHost?: string): Promise<FeatureExtractionPipeline> => {
  if (!extractorPromise) {
    configure(devHost);
    extractorPromise = pipeline('feature-extraction', EMBEDDING_MODEL, { dtype: 'q8', device: 'wasm' }).catch(
      (error: unknown) => {
        extractorPromise = null;
        throw error;
      },
    ) as Promise<FeatureExtractionPipeline>;
  }
  return extractorPromise;
};

const embed = async (text: string, devHost?: string): Promise<Float32Array> => {
  const key = text.slice(0, 512);
  const hit = cache.get(key);
  if (hit) return hit;
  const extractor = await getExtractor(devHost);
  const output = await extractor(key, { pooling: 'mean', normalize: true });
  const vector = output.data as Float32Array;
  if (cache.size > 500) cache.clear();
  cache.set(key, vector);
  return vector;
};

const embeddingSimilarity = async (goal: string, text: string, devHost?: string): Promise<number> => {
  const a = await embed(goal, devHost);
  const b = await embed(text, devHost);
  return cosineSimilarity(a, b);
};

export { EMBEDDING_MODEL, embeddingSimilarity };
