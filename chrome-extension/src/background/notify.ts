import { store } from './chrome-store';

const THROTTLE_MS = 2 * 60_000;
const LAST_KEY = 'flowly.lastNotification';

/** Show a notification if the user allows them, throttled so Flowly never nags. */
export const notify = async (
  id: string,
  title: string,
  message: string,
  opts: { force?: boolean; buttons?: { title: string }[] } = {},
): Promise<void> => {
  const settings = await store.getSettings();
  if (!settings.privacy.notifications) return;
  const now = Date.now();
  const last = ((await chrome.storage.session.get(LAST_KEY))[LAST_KEY] as number | undefined) ?? 0;
  if (!opts.force && now - last < THROTTLE_MS) return;
  await chrome.storage.session.set({ [LAST_KEY]: now });
  chrome.notifications.create(id, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icon-128.png'),
    title,
    message,
    priority: 0,
    ...(opts.buttons ? { buttons: opts.buttons } : {}),
  });
};
