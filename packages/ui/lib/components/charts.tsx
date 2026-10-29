/** Minimal dependency-free SVG charts in the Flowly palette. */

export const Sparkline = ({
  points,
  width = 160,
  height = 32,
  testId,
}: {
  points: { t: number; score: number }[];
  width?: number;
  height?: number;
  testId?: string;
}) => {
  if (points.length < 2) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center rounded border border-dashed border-zinc-200 text-2xs text-zinc-400"
        data-testid={testId}
        data-empty="true">
        Focus trend appears after the first minute
      </div>
    );
  }
  const t0 = points[0].t;
  const span = Math.max(1, points[points.length - 1].t - t0);
  const d = points
    .map((p, i) => {
      const x = ((p.t - t0) / span) * (width - 2) + 1;
      const y = height - 1 - (Math.max(0, Math.min(100, p.score)) / 100) * (height - 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} role="img" aria-label="Focus score over the session" data-testid={testId}>
      <line x1="0" x2={width} y1={height / 2} y2={height / 2} stroke="#f4f4f5" />
      <path d={d} fill="none" stroke="#0f766e" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};

export const BarChart = ({
  data,
  height = 160,
  unit = 'min',
  testId,
}: {
  data: { label: string; value: number; title?: string }[];
  height?: number;
  unit?: string;
  testId?: string;
}) => {
  const max = Math.max(1, ...data.map(d => d.value));
  const barArea = height - 20;
  return (
    <div data-testid={testId}>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map(d => (
          <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <div
              className={d.value > 0 ? 'w-full rounded-sm bg-accent' : 'w-full rounded-sm bg-zinc-200'}
              style={{ height: Math.max(2, (d.value / max) * barArea) }}
              title={d.title ?? `${d.label}: ${Math.round(d.value)} ${unit}`}
              data-value={d.value}
            />
            <span className="text-2xs tabular-nums text-zinc-500">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
