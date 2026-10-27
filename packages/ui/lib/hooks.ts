import { useEffect, useState } from 'react';

/** Subscribe to one chrome.storage key; re-renders whenever it changes anywhere in the extension. */
export const useChromeStorage = <T>(key: string, area: 'local' | 'session' = 'local'): [T | undefined, boolean] => {
  const [value, setValue] = useState<T | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    chrome.storage[area].get(key).then(data => {
      if (!alive) return;
      setValue(data[key] as T | undefined);
      setLoaded(true);
    });
    const listener = (changes: Record<string, chrome.storage.StorageChange>, changedArea: string) => {
      if (changedArea === area && key in changes) setValue(changes[key].newValue as T | undefined);
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      alive = false;
      chrome.storage.onChanged.removeListener(listener);
    };
  }, [key, area]);
  return [value, loaded];
};

/** Re-render every `ms` milliseconds (for timers). */
export const useNow = (ms = 1000): number => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
};

/** Typed wrapper around chrome.runtime.sendMessage for messages to the background. */
export const sendToBackground = async <R = { ok: boolean; error?: string }>(message: unknown): Promise<R> =>
  chrome.runtime.sendMessage(message) as Promise<R>;
