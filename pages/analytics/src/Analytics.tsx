import { dayKey, focusMinutesByDay, formatDuration, KEYS } from '@extension/core';
import { BarChart, Card, SectionTitle, Sparkline, Stat, useChromeStorage } from '@extension/ui';
import type { SessionSummary } from '@extension/core';

const DAYS = 14;

const dayLabel = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString([], { weekday: 'narrow' });
};

const Analytics = () => {
  const [history = [], loaded] = useChromeStorage<SessionSummary[]>(KEYS.history);
  const now = Date.now();
  const days = focusMinutesByDay(history, DAYS, now);
  const today = days.find(d => d.day === dayKey(now));
  const week = days.slice(-7).reduce((s, d) => s + d.focusedMinutes, 0);
  const labelled = history.filter(h => h.label !== null);
  const avg = history.length ? Math.round(history.reduce((s, h) => s + h.avgScore, 0) / history.length) : 0;
  const sessions = [...history].reverse().slice(0, 50);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 px-6 py-10">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Analytics</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Focused minutes are the time your score stayed in Focused or In flow.
        </p>
      </header>

      <Card className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Today" value={`${Math.round(today?.focusedMinutes ?? 0)} min`} testId="stat-today" />
        <Stat label="Last 7 days" value={`${Math.round(week)} min`} testId="stat-week" />
        <Stat label="Sessions" value={history.length} testId="stat-sessions" />
        <Stat label="Avg score" value={history.length ? avg : '—'} />
      </Card>

      <Card>
        <SectionTitle>Focus minutes per day</SectionTitle>
        <div className="mt-4">
          <BarChart
            data={days.map(d => ({
              label: dayLabel(d.day),
              value: d.focusedMinutes,
              title: `${d.day}: ${Math.round(d.focusedMinutes)} min in ${d.sessions} session(s)`,
            }))}
            testId="focus-chart"
          />
        </div>
      </Card>

      <Card>
        <div className="flex items-baseline justify-between">
          <SectionTitle>Sessions</SectionTitle>
          <span className="text-xs text-zinc-500">{labelled.length} with a focus check-in</span>
        </div>
        {loaded && sessions.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500" data-testid="sessions-empty">
            No sessions yet. Start one from the toolbar button or the side panel.
          </p>
        ) : (
          <ol className="mt-3 divide-y divide-zinc-100" data-testid="session-timeline">
            {sessions.map(s => (
              <li key={s.id} className="flex items-center gap-4 py-3">
                <div className="w-24 shrink-0 text-xs tabular-nums text-zinc-500">
                  {new Date(s.startedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  <br />
                  {new Date(s.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">{s.goal}</p>
                  <p className="text-xs text-zinc-500">
                    {formatDuration(s.endedAt - s.startedAt)} · {Math.round(s.focusedSec / 60)} focused min · avg{' '}
                    {Math.round(s.avgScore)} · {s.tabSwitches} switches
                    {s.label === null ? '' : s.label ? ' · felt focused' : ' · felt distracted'}
                  </p>
                </div>
                <Sparkline points={s.timeline} width={120} height={28} />
              </li>
            ))}
          </ol>
        )}
      </Card>
    </main>
  );
};

export default Analytics;
