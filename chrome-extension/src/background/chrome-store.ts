import { createStore } from '@extension/core';
import type { StorageAreaLike } from '@extension/core';

const wrap = (area: chrome.storage.StorageArea): StorageAreaLike => ({
  get: keys => area.get(keys) as Promise<Record<string, unknown>>,
  set: items => area.set(items),
  remove: keys => area.remove(keys),
});

/** Single store instance for the service worker: durable state in local, transient state in session. */
export const store = createStore({ local: wrap(chrome.storage.local), session: wrap(chrome.storage.session) });
