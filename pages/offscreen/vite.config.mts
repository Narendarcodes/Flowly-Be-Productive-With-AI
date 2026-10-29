import { copyFileSync, mkdirSync, readdirSync, renameSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { withPageConfig } from '@extension/vite-config';
import type { PluginOption } from 'vite';

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, 'src');
const outDir = resolve(rootDir, '..', '..', 'dist', 'offscreen');

/**
 * MV3 forbids remotely hosted code, so the ONNX Runtime WebAssembly files that transformers.js
 * would normally pull from a CDN are copied into the extension package instead.
 */
const copyOrtWasm = (): PluginOption => ({
  name: 'flowly-copy-ort-wasm',
  writeBundle() {
    const require = createRequire(import.meta.url);
    // transformers.js bundles a specific onnxruntime-web build; resolve that exact copy.
    const transformersEntry = require.resolve('@huggingface/transformers');
    const ortWebDir = dirname(createRequire(transformersEntry).resolve('onnxruntime-web'));
    const ortDir = resolve(outDir, 'ort');
    mkdirSync(ortDir, { recursive: true });
    // Vite emits the runtime's .wasm as a hashed asset. Its variant (jsep, asyncify, ...) decides which
    // loader .mjs ONNX Runtime asks for, so move the .wasm under its canonical name and copy the loader.
    const assetsDir = resolve(outDir, 'assets');
    const emitted = readdirSync(assetsDir).filter(f => /^ort-wasm-simd-threaded.*\.wasm$/.test(f));
    if (emitted.length === 0) throw new Error('flowly-copy-ort-wasm: no ONNX Runtime .wasm asset was emitted');
    for (const file of emitted) {
      const variant = file
        .replace(/^ort-wasm-simd-threaded\.?/, '')
        .replace(/-[\w-]+\.wasm$/, '')
        .replace(/\.wasm$/, '');
      const base = variant ? `ort-wasm-simd-threaded.${variant}` : 'ort-wasm-simd-threaded';
      renameSync(resolve(assetsDir, file), resolve(ortDir, `${base}.wasm`));
      copyFileSync(resolve(ortWebDir, `${base}.mjs`), resolve(ortDir, `${base}.mjs`));
    }
  },
});

export default withPageConfig({
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  plugins: [copyOrtWasm()],
  build: {
    outDir,
    // transformers.js is large; this page is never shown to the user.
    chunkSizeWarningLimit: 2000,
  },
});
