import { formatDuration, KEYS, remainingMs, sanitizeSettings } from '@extension/core';
import {
  Button,
  Card,
  ScoreDial,
  SectionTitle,
  sendToBackground,
  Sparkline,
  Stat,
  TextArea,
  useChromeStorage,
  useNow,
} from '@extension/ui';
import { useEffect, useState } from 'react';
import type { ActiveSession, BackgroundResponse, TabRelevance } from '@extension/core';

const DURATIONS: { label: string; value: number }[] = [
  { label: '25 min', value: 25 },
  { label: '50 min', value: 50 },
  { label: '90 min', value: 90 },
  { label: 'Open', value: 0 },
];

const VERDICT_TEXT: Record<TabRelevance['verdict'], string> = {
  allow: 'On goal',
  unsure: 'Unclear',
  block: 'Off goal',
};

const METHOD_TEXT: Record<TabRelevance['method'], string> = {
  rule: 'your lists',
  embedding: 'on-device model',
  keyword: 'keyword match',
  llm: 'AI tiebreak',
  none: '—',
};

const FocusPrompt = ({ session, pendingLabel }: { session: ActiveSession | undefined; pendingLabel?: string }) => {
  if (pendingLabel && !session) {
    const answer = (focused: boolean) =>
      sendToBackground({ type: 'SUBMIT_LABEL', payload: { sessionId: pendingLabel, focused } });
    return (
      <Card data-testid="label-prompt">
        <p className="text-sm font-medium text-zinc-900">Were you focused during that session?</p>
        <p className="mt-1 text-xs text-zinc-500">
          Your answer trains a small model on this device so the score fits how you work.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={() => answer(true)} data-testid="label-yes">
            Yes
          </Button>
          <Button size="sm" variant="secondary" onClick={() => answer(false)} data-testid="label-no">
            Not really
          </Button>
          <Button size="sm" variant="ghost" onClick={() => sendToBackground({ type: 'DISMISS_LABEL' })}>
            Skip
          </Button>
        </div>
      </Card>
    );
  }
  if (session && (session.flow.status === 'distracted' || session.flow.status === 'drifting')) {
    return (
      <Card className="border-accent-muted bg-accent-soft" data-testid="focus-nudge">
        <p className="text-sm text-zinc-800">
          Attention is drifting. Close what you don’t need and take the next small step on{' '}
          <span className="font-medium">{session.goal}</span>.
        </p>
      </Card>
    );
  }
  return null;
};

const SidePanel = () => {
  const [session] = useChromeStorage<ActiveSession>(KEYS.session);
  const [rawSettings, loaded] = useChromeStorage<unknown>(KEYS.settings);
  const [pendingLabel] = useChromeStorage<string>(KEYS.pendingLabel);
  const [relevance] = useChromeStorage<TabRelevance>(KEYS.tabRelevance, 'session');
  const settings = sanitizeSettings(rawSettings);
  const [goal, setGoal] = useState('');
  const [minutes, setMinutes] = useState(50);
  const [error, setError] = useState<string | null>(null);
  const now = useNow();

  useEffect(() => {
    if (loaded) {
      setGoal(settings.goal);
      setMinutes(settings.sessionMinutes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const start = async () => {
    setError(null);
    const res = await sendToBackground<BackgroundResponse>({ type: 'START_SESSION', payload: { goal, minutes } });
    if (!res?.ok) setError(res?.error ?? 'Could not start the session');
  };

  const left = session ? remainingMs(session, now) : null;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-base font-semibold tracking-tight text-zinc-900">Flowly</h1>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('analytics/index.html') })}>
            Analytics
          </Button>
          <Button variant="ghost" size="sm" onClick={() => chrome.runtime.openOptionsPage()}>
            Settings
          </Button>
        </div>
      </header>

      <Card>
        <SectionTitle>Goal</SectionTitle>
        {session ? (
          <div className="mt-2">
            <p className="text-sm font-medium text-zinc-900" data-testid="panel-goal">
              {session.goal}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                {left === null
                  ? 'Open-ended session'
                  : `Ends at ${new Date(session.endsAt ?? 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => sendToBackground({ type: 'STOP_SESSION' })}
                data-testid="panel-stop">
                Stop session
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2 flex flex-col gap-3">
            <TextArea
              rows={2}
              value={goal}
              maxLength={300}
              placeholder="What do you want to get done? Be specific."
              aria-label="Goal"
              onChange={e => setGoal(e.target.value)}
              data-testid="panel-goal-input"
            />
            <div className="flex gap-1" role="group" aria-label="Session length">
              {DURATIONS.map(d => (
                <Button
                  key={d.value}
                  size="sm"
                  variant={minutes === d.value ? 'primary' : 'secondary'}
                  className="flex-1"
                  onClick={() => setMinutes(d.value)}>
                  {d.label}
                </Button>
              ))}
            </div>
            {error ? <p className="text-xs text-red-700">{error}</p> : null}
            <Button onClick={start} disabled={!goal.trim()} data-testid="panel-start">
              Start focus session
            </Button>
          </div>
        )}
      </Card>

      <FocusPrompt session={session} pendingLabel={pendingLabel} />

      <Card className="flex flex-col items-center gap-4">
        <ScoreDial
          score={session && session.flow.ticks > 0 ? session.flow.score : null}
          status={session ? session.flow.status : null}
          size={148}
          active={Boolean(session)}
        />
        <div className="grid w-full grid-cols-4 gap-2 text-center">
          <Stat
            label={left === null ? 'Elapsed' : 'Left'}
            value={session ? formatDuration(left ?? now - session.startedAt) : '—'}
            testId="panel-timer"
          />
          <Stat label="Focused" value={session ? `${Math.round(session.focusedSec / 60)} min` : '—'} />
          <Stat label="Streak" value={session ? `${Math.round(session.flow.streakSec / 60)} min` : '—'} />
          <Stat label="Switches" value={session ? session.tabSwitches : '—'} />
        </div>
        {session ? <Sparkline points={session.timeline} width={320} height={40} testId="panel-sparkline" /> : null}
      </Card>

      {session ? (
        <Card data-testid="tab-relevance">
          <SectionTitle>Current tab</SectionTitle>
          {relevance ? (
            <div className="mt-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-medium text-zinc-900">{relevance.hostname}</span>
                <span
                  className={
                    relevance.verdict === 'allow'
                      ? 'text-xs font-medium text-accent'
                      : relevance.verdict === 'block'
                        ? 'text-xs font-medium text-red-700'
                        : 'text-xs font-medium text-zinc-500'
                  }
                  data-testid="tab-verdict">
                  {VERDICT_TEXT[relevance.verdict]}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {relevance.reason} · {METHOD_TEXT[relevance.method]}
                {relevance.similarity !== null ? ` · similarity ${relevance.similarity.toFixed(2)}` : ''}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs text-zinc-500">Open a web page to see whether it matches your goal.</p>
          )}
        </Card>
      ) : null}

      <p className="text-center text-2xs text-zinc-400">
        Scores are computed on this device from activity counts and tab titles. Nothing is uploaded
        {settings.ai.provider === 'gemini' ? ' except tiebreak questions to Gemini with your key' : ''}.
      </p>
    </main>
  );
};

export default SidePanel;
