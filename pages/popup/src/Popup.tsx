import { formatDuration, KEYS, remainingMs, sanitizeSettings } from '@extension/core';
import { Button, ScoreDial, sendToBackground, TextInput, useChromeStorage, useNow } from '@extension/ui';
import { useEffect, useState } from 'react';
import type { ActiveSession, BackgroundResponse } from '@extension/core';

const DURATIONS = [25, 50, 90];

const openPage = (path: string) => chrome.tabs.create({ url: chrome.runtime.getURL(path) });

const openSidePanel = async () => {
  const win = await chrome.windows.getCurrent();
  if (win.id !== undefined) await chrome.sidePanel.open({ windowId: win.id });
  window.close();
};

const Popup = () => {
  const [session] = useChromeStorage<ActiveSession>(KEYS.session);
  const [rawSettings, settingsLoaded] = useChromeStorage<unknown>(KEYS.settings);
  const [pendingLabel] = useChromeStorage<string>(KEYS.pendingLabel);
  const settings = sanitizeSettings(rawSettings);
  const [goal, setGoal] = useState('');
  const [minutes, setMinutes] = useState(50);
  const [error, setError] = useState<string | null>(null);
  const now = useNow();

  useEffect(() => {
    if (settingsLoaded) {
      setGoal(settings.goal);
      setMinutes(settings.sessionMinutes || 50);
    }
    // Initialise the form once from stored settings.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsLoaded]);

  const start = async () => {
    setError(null);
    const res = await sendToBackground<BackgroundResponse>({ type: 'START_SESSION', payload: { goal, minutes } });
    if (!res?.ok) setError(res?.error ?? 'Could not start');
  };

  const left = session ? remainingMs(session, now) : null;

  return (
    <main className="flex flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight text-zinc-900">Flowly</span>
        <Button variant="ghost" size="sm" onClick={() => chrome.runtime.openOptionsPage()} aria-label="Settings">
          Settings
        </Button>
      </header>

      {session ? (
        <section className="flex items-center gap-4" data-testid="popup-active">
          <ScoreDial
            score={session.flow.ticks > 0 ? session.flow.score : null}
            status={session.flow.status}
            size={92}
          />
          <div className="min-w-0 flex-1">
            <div className="text-2xs uppercase tracking-wide text-zinc-500">Goal</div>
            <p className="truncate text-sm font-medium text-zinc-900" title={session.goal} data-testid="popup-goal">
              {session.goal}
            </p>
            <div className="mt-2 text-2xs uppercase tracking-wide text-zinc-500">
              {left === null ? 'Elapsed' : 'Left'}
            </div>
            <p className="text-lg font-semibold tabular-nums text-zinc-900" data-testid="popup-timer">
              {formatDuration(left ?? now - session.startedAt)}
            </p>
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-2" data-testid="popup-idle">
          <label htmlFor="popup-goal" className="text-2xs uppercase tracking-wide text-zinc-500">
            What are you working on?
          </label>
          <TextInput
            id="popup-goal"
            value={goal}
            maxLength={300}
            placeholder="e.g. Finish the API docs"
            onChange={e => setGoal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && goal.trim() && void start()}
          />
          <div className="flex gap-1" role="group" aria-label="Session length">
            {DURATIONS.map(m => (
              <Button
                key={m}
                size="sm"
                variant={minutes === m ? 'primary' : 'secondary'}
                className="flex-1"
                onClick={() => setMinutes(m)}>
                {m} min
              </Button>
            ))}
          </div>
          {error ? <p className="text-xs text-red-700">{error}</p> : null}
        </section>
      )}

      {session ? (
        <Button variant="secondary" onClick={() => sendToBackground({ type: 'STOP_SESSION' })} data-testid="popup-stop">
          Stop session
        </Button>
      ) : (
        <Button onClick={start} disabled={!goal.trim()} data-testid="popup-start">
          Start focus session
        </Button>
      )}

      {pendingLabel && !session ? (
        <div className="flex items-center justify-between rounded-md bg-zinc-100 px-3 py-2 text-xs text-zinc-700">
          <span>Were you focused last session?</span>
          <span className="flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                sendToBackground({ type: 'SUBMIT_LABEL', payload: { sessionId: pendingLabel, focused: true } })
              }>
              Yes
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                sendToBackground({ type: 'SUBMIT_LABEL', payload: { sessionId: pendingLabel, focused: false } })
              }>
              No
            </Button>
          </span>
        </div>
      ) : null}

      <nav className="flex justify-between border-t border-zinc-200 pt-3 text-xs">
        <button type="button" className="text-zinc-600 hover:text-zinc-900" onClick={openSidePanel}>
          Side panel
        </button>
        <button
          type="button"
          className="text-zinc-600 hover:text-zinc-900"
          onClick={() => openPage('analytics/index.html')}>
          Analytics
        </button>
      </nav>
    </main>
  );
};

export default Popup;
