import { launchExtension, readStorage, startServer } from '../fixtures';
import { expect, test } from '@playwright/test';
import type { BrowserContext, Page, Worker } from '@playwright/test';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Ctx = { context: BrowserContext; extensionId: string; worker: Worker };
let ctx: Ctx;
let server: Awaited<ReturnType<typeof startServer>>;

const extUrl = (path: string) => `chrome-extension://${ctx.extensionId}/${path}`;
const open = async (url: string): Promise<Page> => {
  const page = await ctx.context.newPage();
  await page.goto(url);
  return page;
};
const sw = <T>(fn: () => Promise<T> | T): Promise<T> => ctx.worker.evaluate(fn);

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
  server = await startServer();
  ctx = await launchExtension();
  // Deterministic relevance for most tests: keyword matcher instead of the downloadable model.
  await ctx.worker.evaluate(async () => {
    const g = globalThis as any;
    const current = await g.__flowly.store.getSettings();
    await g.__flowly.store.saveSettings({
      // .test hosts avoid HSTS-preloaded real domains when the test navigates for real.
      blocklist: [...current.blocklist, 'social.flowly.test', 'video.flowly.test'],
      privacy: { activityCounting: true, embeddings: false, notifications: false },
    });
  });
});

test.afterAll(async () => {
  await ctx?.context.close();
  server?.server.close();
});

test('service worker starts with sanitized default settings and no blocking rules', async () => {
  const settings = await readStorage<any>(ctx.worker, 'flowly.settings');
  expect(settings.blocklist).toContain('reddit.com');
  expect(settings.ai.provider).toBe('none');
  const rules = await sw(() => chrome.declarativeNetRequest.getDynamicRules());
  expect(rules).toHaveLength(0);
});

test('popup renders the 3-second glance', async () => {
  const page = await open(extUrl('popup/index.html'));
  await expect(page.getByText('Flowly', { exact: true })).toBeVisible();
  await expect(page.getByTestId('popup-idle')).toBeVisible();
  await expect(page.getByTestId('popup-start')).toBeDisabled();
  await page.close();
});

test('setting a goal in the popup starts a session', async () => {
  const page = await open(extUrl('popup/index.html'));
  await page.getByLabel('What are you working on?').fill('Write the React hooks documentation');
  await page.getByRole('button', { name: '25 min' }).click();
  await page.getByTestId('popup-start').click();
  await expect(page.getByTestId('popup-active')).toBeVisible();
  await expect(page.getByTestId('popup-goal')).toHaveText('Write the React hooks documentation');
  await expect(page.getByTestId('popup-timer')).toHaveText(/^2[45]:\d\d$/);
  const session = await readStorage<any>(ctx.worker, 'flowly.session');
  expect(session.goal).toBe('Write the React hooks documentation');
  expect(session.endsAt - session.startedAt).toBe(25 * 60_000);
  const rules = await sw(() => chrome.declarativeNetRequest.getDynamicRules());
  expect(rules).toHaveLength(1);
  expect((rules[0].condition as any).requestDomains).toContain('reddit.com');
  await page.close();
});

test('a blocklisted site is redirected to the blocked page', async () => {
  const target = server.url('www.reddit.com', '/r/all?sort=top');
  const page = await ctx.context.newPage();
  await page.goto(target).catch(() => undefined);
  await expect(page).toHaveURL(new RegExp(`^chrome-extension://${ctx.extensionId}/blocked/index.html#`));
  expect(decodeURIComponent(new URL(page.url()).hash.slice(1))).toBe(target);
  await expect(page.getByTestId('blocked-host')).toHaveText('www.reddit.com is blocked');
  await expect(page.getByTestId('blocked-goal')).toHaveText('Write the React hooks documentation');
  await expect(page.getByTestId('blocked-time-left')).toHaveText(/^2[45]:\d\d$/);
  await page.close();
});

test('"Unblock for 5 minutes" lets the site through and keeps other sites blocked', async () => {
  const target = server.url('social.flowly.test', '/feed');
  const page = await ctx.context.newPage();
  await page.goto(target).catch(() => undefined);
  await expect(page.getByTestId('unblock-5')).toBeVisible();
  await page.getByTestId('unblock-5').click();
  await expect(page).toHaveURL(target);
  await expect(page.locator('#title')).toHaveText('Social feed mock');
  const snoozes = await readStorage<Record<string, number>>(ctx.worker, 'flowly.snoozes');
  const until = snoozes['social.flowly.test'];
  expect(until - Date.now()).toBeGreaterThan(4 * 60_000);
  expect(until - Date.now()).toBeLessThanOrEqual(5 * 60_000);
  const alarms = await sw(() => chrome.alarms.getAll());
  expect(alarms.map(a => a.name)).toContain('flowly-snooze:social.flowly.test');
  // Another blocklisted domain is still blocked.
  const other = await ctx.context.newPage();
  await other.goto(server.url('video.flowly.test', '/watch')).catch(() => undefined);
  await expect(other).toHaveURL(/blocked\/index\.html#/);
  await other.close();
  await page.close();
});

test('flow score updates from simulated activity', async () => {
  const docs = await open(server.url('docs.flowly.test', '/react/hooks'));
  await docs.bringToFront();
  // Relevance of the active tab: keyword matcher should mark it on-goal.
  await expect
    .poll(async () => (await readStorage<any>(ctx.worker, 'flowly.tabRelevance', 'session'))?.verdict, {
      timeout: 15_000,
    })
    .toBe('allow');
  await docs.locator('#editor').click();
  await docs.keyboard.type(
    'useEffect runs after render. Custom hooks share stateful logic between components. '.repeat(2),
  );
  for (let i = 0; i < 20; i++) await docs.mouse.move(10 + i * 7, 10 + i * 3);
  await docs.evaluate(() => window.dispatchEvent(new Event('flowly:flush')));
  await expect
    .poll(async () => (await readStorage<any>(ctx.worker, 'flowly.activity', 'session'))?.keys ?? 0)
    .toBeGreaterThan(100);

  const after = await sw(async () => {
    const g = globalThis as any;
    const s = await g.__flowly.store.getSession();
    // Pretend 60 s passed since the last tick so the window is a full minute.
    s.flow.lastTickAt = Date.now() - 60_000;
    await g.__flowly.store.saveSession(s);
    return g.__flowly.runTick();
  });
  expect(after.flow.ticks).toBe(1);
  expect(after.flow.score).toBeGreaterThan(55);
  expect(['focused', 'flow']).toContain(after.flow.status);
  expect(after.timeline).toHaveLength(1);

  // Side panel shows the live score.
  const panel = await open(extUrl('side-panel/index.html'));
  await expect(panel.getByTestId('flow-score')).toHaveText(String(Math.round(after.flow.score)));
  await expect(panel.getByTestId('panel-goal')).toHaveText('Write the React hooks documentation');

  // Now simulate distraction: off-goal page, lots of tab switching, no typing.
  const cats = await open(server.url('cats.flowly.test', '/'));
  await cats.bringToFront();
  await expect
    .poll(async () => (await readStorage<any>(ctx.worker, 'flowly.tabRelevance', 'session'))?.hostname, {
      timeout: 15_000,
    })
    .toBe('cats.flowly.test');
  const distracted = await sw(async () => {
    const g = globalThis as any;
    await g.__flowly.store.takeActivity();
    await g.__flowly.store.addActivity({ tabSwitches: 8 });
    const s = await g.__flowly.store.getSession();
    s.flow.lastTickAt = Date.now() - 60_000;
    await g.__flowly.store.saveSession(s);
    return g.__flowly.runTick();
  });
  expect(distracted.flow.rawScore).toBeLessThan(after.flow.rawScore);
  expect(distracted.flow.score).toBeLessThan(after.flow.score);
  await expect(panel.getByTestId('flow-score')).toHaveText(String(Math.round(distracted.flow.score)));
  await expect(panel.getByTestId('tab-verdict')).toHaveText(/Off goal|Unclear/);
  await Promise.all([docs.close(), cats.close(), panel.close()]);
});

test('options page saves blocklist, allowlist and privacy settings', async () => {
  const page = await open(extUrl('options/index.html'));
  const blocklist = page.locator('#blocklist');
  await expect(blocklist).toHaveValue(/reddit\.com/);
  await blocklist.fill(`${await blocklist.inputValue()}\nhttps://news.flowly.test/sports`);
  await page.locator('#allowlist').fill('docs.flowly.test');
  await page.getByRole('switch', { name: 'Notifications' }).click();
  await page.getByTestId('options-save').click();
  await expect(page.getByTestId('options-saved')).toBeVisible();
  const settings = await readStorage<any>(ctx.worker, 'flowly.settings');
  expect(settings.blocklist).toContain('news.flowly.test');
  expect(settings.allowlist).toEqual(['docs.flowly.test']);
  expect(settings.privacy.notifications).toBe(true);
  // The running session picks the change up immediately.
  await expect
    .poll(async () => {
      const rules = await sw(() => chrome.declarativeNetRequest.getDynamicRules());
      return (rules[0]?.condition as any)?.requestDomains ?? [];
    })
    .toContain('news.flowly.test');
  const news = await ctx.context.newPage();
  await news.goto(server.url('news.flowly.test', '/today')).catch(() => undefined);
  await expect(news).toHaveURL(/blocked\/index\.html#/);
  await news.close();

  // Optional AI key is stored locally only.
  await page.getByLabel(/Gemini API/).check();
  await page.getByLabel('Gemini API key').fill('test-key-not-real');
  await page.getByTestId('options-save').click();
  await expect(page.getByTestId('options-saved')).toBeVisible();
  const ai = (await readStorage<any>(ctx.worker, 'flowly.settings')).ai;
  expect(ai).toEqual({ provider: 'gemini', geminiApiKey: 'test-key-not-real' });
  await page.getByLabel(/^Off/).check();
  await page.getByTestId('options-save').click();
  await page.close();
});

test('strict mode auto-blocks a page the relevance check marks off-goal', async () => {
  const options = await open(extUrl('options/index.html'));
  await options.getByRole('switch', { name: 'Strict mode' }).click();
  await options.getByTestId('options-save').click();
  await expect(options.getByTestId('options-saved')).toBeVisible();
  await options.close();
  const page = await ctx.context.newPage();
  await page.goto(server.url('cats.flowly.test', '/funny')).catch(() => undefined);
  await page.bringToFront();
  await expect(page).toHaveURL(/blocked\/index\.html#http:\/\/cats\.flowly\.test/, { timeout: 15_000 });
  await expect(page.getByText('It looked unrelated to your goal', { exact: false })).toBeVisible();
  const session = await readStorage<any>(ctx.worker, 'flowly.session');
  expect(session.autoBlocked).toContain('cats.flowly.test');
  await page.close();
});

test('stopping a session asks "Were you focused?" and trains the local model', async () => {
  const panel = await open(extUrl('side-panel/index.html'));
  await panel.getByTestId('panel-stop').click();
  await expect(panel.getByTestId('label-prompt')).toBeVisible();
  const rules = await sw(() => chrome.declarativeNetRequest.getDynamicRules());
  expect(rules).toHaveLength(0);
  const before = await sw(async () => (globalThis as any).__flowly.store.getModel());
  await panel.getByTestId('label-yes').click();
  await expect(panel.getByTestId('label-prompt')).toBeHidden();
  const model = await readStorage<any>(ctx.worker, 'flowly.model');
  expect(model.updates).toBe(1);
  expect(model.weights).not.toEqual(before.weights);
  const labels = await readStorage<any[]>(ctx.worker, 'flowly.labels');
  expect(labels).toHaveLength(1);
  expect(labels[0].focused).toBe(true);
  await panel.close();
});

test('analytics renders the focus chart and session timeline', async () => {
  const page = await open(extUrl('analytics/index.html'));
  await expect(page.getByRole('heading', { name: 'Analytics' })).toBeVisible();
  await expect(page.getByTestId('focus-chart')).toBeVisible();
  await expect(page.getByTestId('stat-sessions')).toHaveText('1');
  const items = page.getByTestId('session-timeline').locator('li');
  await expect(items).toHaveCount(1);
  await expect(items.first()).toContainText('Write the React hooks documentation');
  await expect(items.first()).toContainText('felt focused');
  await page.close();
});

test('after the session ends, blocked sites load normally again', async () => {
  const page = await ctx.context.newPage();
  await page.goto(server.url('video.flowly.test', '/watch'));
  await expect(page.locator('#title')).toHaveText('Video site mock');
  await page.close();
});

test('reset all data wipes local state', async () => {
  const page = await open(extUrl('options/index.html'));
  await page.getByTestId('options-reset').click();
  await page.getByTestId('options-reset').click();
  await expect.poll(async () => readStorage<any>(ctx.worker, 'flowly.history')).toBeUndefined();
  expect(await readStorage(ctx.worker, 'flowly.labels')).toBeUndefined();
  expect(await readStorage(ctx.worker, 'flowly.model')).toBeUndefined();
  const settings = await readStorage<any>(ctx.worker, 'flowly.settings');
  expect(settings.allowlist).toEqual([]);
  await page.close();
});

test('on-device embeddings run in the offscreen document (transformers.js)', async () => {
  test.skip(
    process.env.FLOWLY_E2E_EMBEDDINGS !== '1',
    'Set FLOWLY_E2E_EMBEDDINGS=1 to download the model and run this check',
  );
  test.setTimeout(240_000);
  if (process.env.FLOWLY_HF_MIRROR_DIR) {
    // Serve the model from the local test server instead of the Hugging Face Hub.
    await ctx.worker.evaluate(
      host => chrome.storage.local.set({ 'flowly.dev.modelHost': host }),
      `http://127.0.0.1:${server.port}/hf/`,
    );
  }
  const result = await ctx.worker.evaluate(async () => {
    const g = globalThis as any;
    const on = await g.__flowly.embeddingSimilarity(
      'Write the React hooks documentation',
      'useEffect hook reference React docs',
    );
    const off = await g.__flowly.embeddingSimilarity(
      'Write the React hooks documentation',
      'Funny cat videos compilation',
    );
    return { on, off };
  });
  expect(result.on.ok).toBe(true);
  expect(result.off.ok).toBe(true);
  expect(result.on.similarity).toBeGreaterThan(result.off.similarity);
  expect(result.on.similarity).toBeGreaterThan(0.32);
  expect(result.off.similarity).toBeLessThan(0.12);

  // And the live pipeline uses it for the active tab during a session.
  await ctx.worker.evaluate(async () => {
    const g = globalThis as any;
    await g.__flowly.store.saveSettings({
      privacy: { activityCounting: true, embeddings: true, notifications: false },
    });
  });
  const popup = await open(extUrl('popup/index.html'));
  await popup.getByLabel('What are you working on?').fill('Study for my operating systems exam');
  await popup.getByTestId('popup-start').click();
  await expect(popup.getByTestId('popup-active')).toBeVisible();
  await popup.close();
  const page = await open(server.url('docs.flowly.test', '/process-scheduling-algorithms'));
  await page.bringToFront();
  await expect
    .poll(async () => (await readStorage<any>(ctx.worker, 'flowly.tabRelevance', 'session'))?.method, {
      timeout: 60_000,
    })
    .toBe('embedding');
  await page.close();
});
