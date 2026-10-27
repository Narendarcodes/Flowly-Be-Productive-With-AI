import { findMatch, formatDuration, KEYS, remainingMs, sanitizeSettings } from '@extension/core';
import { Button, Card, sendToBackground, useChromeStorage, useNow } from '@extension/ui';
import { useState } from 'react';
import type { ActiveSession } from '@extension/core';

const SNOOZE_MINUTES = 5;

/** The original URL arrives in the fragment (set by the declarativeNetRequest redirect). */
const readOriginalUrl = (): string | null => {
  const raw = window.location.hash.slice(1);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
};

const Blocked = () => {
  const [session, loaded] = useChromeStorage<ActiveSession>(KEYS.session);
  const [rawSettings] = useChromeStorage<unknown>(KEYS.settings);
  const [busy, setBusy] = useState(false);
  const now = useNow();
  const original = readOriginalUrl();
  const host = original ? new URL(original).hostname : 'This site';
  const settings = sanitizeSettings(rawSettings);
  const onBlocklist = original ? findMatch(new URL(original).hostname, settings.blocklist) : null;
  const left = session ? remainingMs(session, now) : null;

  const unblock = async () => {
    if (!original) return;
    setBusy(true);
    await sendToBackground({
      type: 'SNOOZE_SITE',
      payload: { domain: new URL(original).hostname, minutes: SNOOZE_MINUTES },
    });
    window.location.replace(original);
  };

  const backToWork = async () => {
    const tab = await chrome.tabs.getCurrent();
    if (tab?.id !== undefined) await chrome.tabs.remove(tab.id);
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <p className="text-2xs font-semibold uppercase tracking-wide text-zinc-500">Flowly</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900" data-testid="blocked-host">
          {host} is blocked
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {onBlocklist ? 'It’s on your blocklist' : 'It looked unrelated to your goal'} while a focus session is
          running.
        </p>

        {loaded && session ? (
          <dl className="mt-6 grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-zinc-500">Goal</dt>
            <dd className="font-medium text-zinc-900" data-testid="blocked-goal">
              {session.goal}
            </dd>
            <dt className="text-zinc-500">{left === null ? 'Elapsed' : 'Time left'}</dt>
            <dd className="font-medium tabular-nums text-zinc-900" data-testid="blocked-time-left">
              {formatDuration(left ?? now - session.startedAt)}
            </dd>
          </dl>
        ) : loaded ? (
          <p className="mt-6 text-sm text-zinc-500">No session is running anymore — you can reload the page.</p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-2">
          <Button onClick={backToWork}>Back to work</Button>
          {original ? (
            <Button variant="secondary" onClick={unblock} disabled={busy} data-testid="unblock-5">
              Unblock for {SNOOZE_MINUTES} minutes
            </Button>
          ) : null}
        </div>
      </Card>
    </main>
  );
};

export default Blocked;
