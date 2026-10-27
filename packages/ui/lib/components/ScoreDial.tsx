import { cn } from '../utils';

const STATUS_LABEL: Record<string, string> = {
  idle: 'Idle',
  distracted: 'Distracted',
  drifting: 'Drifting',
  focused: 'Focused',
  flow: 'In flow',
};

export const statusLabel = (status: string | undefined | null): string =>
  status ? (STATUS_LABEL[status] ?? status) : '—';

/** A plain ring: neutral track, accent arc, number in the middle. */
export const ScoreDial = ({
  score,
  status,
  size = 120,
  active = true,
}: {
  score: number | null;
  status?: string | null;
  size?: number;
  active?: boolean;
}) => {
  const stroke = size >= 100 ? 8 : 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const value = score === null ? 0 : Math.max(0, Math.min(100, score));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e4e4e7" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={active ? '#0f766e' : '#a1a1aa'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className={cn('font-semibold tabular-nums text-zinc-900', size >= 100 ? 'text-3xl' : 'text-xl')}
          data-testid="flow-score">
          {score === null ? '—' : Math.round(value)}
        </span>
        <span className="text-2xs uppercase tracking-wide text-zinc-500" data-testid="flow-status">
          {statusLabel(status)}
        </span>
      </div>
    </div>
  );
};
