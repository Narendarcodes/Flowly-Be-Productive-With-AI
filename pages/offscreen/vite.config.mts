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
    // The package's exports map hides dist/, so locate it from the resolved entry point.
    const distDir = dirname(require.resolve('@huggingface/transformers'));
    const ortDir = resolve(outDir, 'ort');
    mkdirSync(ortDir, { recursive: true });
    copyFileSync(
      resolve(distDir, 'ort-wasm-simd-threaded.jsep.mjs'),
      resolve(ortDir, 'ort-wasm-simd-threaded.jsep.mjs'),
    );
    // Vite already emitted the .wasm as a hashed asset; move it (instead of shipping 21 MB twice).
    const assetsDir = resolve(outDir, 'assets');
    const emitted = readdirSync(assetsDir).find(
      f => f.startsWith('ort-wasm-simd-threaded.jsep') && f.endsWith('.wasm'),
    );
    if (emitted) {
      renameSync(resolve(assetsDir, emitted), resolve(ortDir, 'ort-wasm-simd-threaded.jsep.wasm'));
    } else {
      copyFileSync(
        resolve(distDir, 'ort-wasm-simd-threaded.jsep.wasm'),
        resolve(ortDir, 'ort-wasm-simd-threaded.jsep.wasm'),
      );
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
