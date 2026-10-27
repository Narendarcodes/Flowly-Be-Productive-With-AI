import { chromium } from '@playwright/test';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import type { BrowserContext, Worker } from '@playwright/test';
import type { AddressInfo } from 'node:net';

const DIST = resolve(import.meta.dirname, '..', '..', 'dist');

/** Hostnames served by the local test server (mapped to 127.0.0.1, so no real network is used). */
const TEST_HOSTS = [
  'reddit.com',
  'www.reddit.com',
  'social.flowly.test',
  'video.flowly.test',
  'docs.flowly.test',
  'news.flowly.test',
  'cats.flowly.test',
];

const PAGES: Record<string, string> = {
  'docs.flowly.test': 'React Hooks documentation – useEffect and custom hooks',
  'news.flowly.test': 'Celebrity gossip and football transfer rumours',
  'cats.flowly.test': 'Funny cat videos compilation',
  'reddit.com': 'Reddit mock front page',
  'www.reddit.com': 'Reddit mock front page',
  'social.flowly.test': 'Social feed mock',
  'video.flowly.test': 'Video site mock',
};

const startServer = async () => {
  const mirror = process.env.FLOWLY_HF_MIRROR_DIR;
  const server = createServer((req, res) => {
    // Optional loopback mirror of Hugging Face model files (for sandboxes where the browser can't reach the Hub).
    if (mirror && req.url?.startsWith('/hf/')) {
      const file = join(mirror, decodeURIComponent(req.url.slice(4).split('?')[0]).replace('/resolve/main/', '/'));
      if (!file.startsWith(mirror) || !existsSync(file)) {
        res.writeHead(404, { 'Access-Control-Allow-Origin': '*' });
        res.end('not mirrored');
        return;
      }
      res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/octet-stream' });
      res.end(readFileSync(file));
      return;
    }
    const host = (req.headers.host ?? '').split(':')[0];
    const title = PAGES[host] ?? `Test page ${host}`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(
      `<!doctype html><html><head><title>${title}</title></head><body><h1 id="title">${title}</h1><textarea id="editor"></textarea></body></html>`,
    );
  });
  await new Promise<void>(r => server.listen(0, '127.0.0.1', () => r()));
  const { port } = server.address() as AddressInfo;
  return { server, port, url: (host: string, path = '/') => `http://${host}:${port}${path}` };
};

/**
 * Test hosts must hit the local server, never an HTTP proxy from the environment. If a proxy is
 * configured (CI or sandbox), keep using it for real hosts (e.g. the Hugging Face model download)
 * but bypass it for the test hosts; otherwise disable proxies entirely.
 */
const proxyOption = () => {
  const raw = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;
  if (!raw) return undefined;
  const u = new URL(raw);
  return {
    server: `${u.protocol}//${u.host}`,
    bypass: [...TEST_HOSTS, '127.0.0.1', 'localhost'].join(','),
    ...(u.username ? { username: decodeURIComponent(u.username), password: decodeURIComponent(u.password) } : {}),
  };
};

const launchExtension = async (): Promise<{ context: BrowserContext; extensionId: string; worker: Worker }> => {
  const userDataDir = mkdtempSync(join(tmpdir(), 'flowly-e2e-'));
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: true,
    proxy: proxyOption(),
    // Extensions need Chromium's "new" headless mode: use the full Chromium build (channel 'chromium'),
    // not chromium-headless-shell, or a system Chromium via CHROME_PATH.
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chromium' }),
    args: [
      `--disable-extensions-except=${DIST}`,
      `--load-extension=${DIST}`,
      `--host-resolver-rules=${TEST_HOSTS.map(h => `MAP ${h} 127.0.0.1`).join(', ')}`,
      ...(proxyOption() ? [] : ['--no-proxy-server']),
      '--no-first-run',
      '--no-default-browser-check',
    ],
  });
  let [worker] = context.serviceWorkers();
  if (!worker) worker = await context.waitForEvent('serviceworker');
  const extensionId = new URL(worker.url()).host;
  return { context, extensionId, worker };
};

/** Read one chrome.storage key from the service worker. */
const readStorage = <T>(worker: Worker, key: string, area: 'local' | 'session' = 'local'): Promise<T> =>
  worker.evaluate(async ([k, a]) => (await chrome.storage[a as 'local' | 'session'].get(k))[k], [
    key,
    area,
  ] as const) as Promise<T>;

export { DIST, TEST_HOSTS, startServer, launchExtension, readStorage };
