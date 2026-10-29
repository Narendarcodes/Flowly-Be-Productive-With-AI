import { cn } from '../utils';
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover disabled:bg-zinc-300',
  secondary: 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 disabled:text-zinc-400',
  ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
  danger: 'border border-red-200 bg-white text-red-700 hover:bg-red-50',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: 'sm' | 'md' }) => (
  <button
    type={type}
    className={cn(
      'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:cursor-not-allowed',
      size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-4 text-sm',
      VARIANTS[variant],
      className,
    )}
    {...props}
  />
);

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('rounded-lg border border-zinc-200 bg-white p-4', className)} {...props} />
);

export const SectionTitle = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h2 className={cn('text-2xs font-semibold uppercase tracking-wide text-zinc-500', className)}>{children}</h2>
);

export const TextInput = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-accent focus:outline-none',
      className,
    )}
    {...props}
  />
);

export const TextArea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(
      'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-accent focus:outline-none',
      className,
    )}
    {...props}
  />
);

export const Toggle = ({
  checked,
  onChange,
  label,
  description,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  id: string;
}) => (
  <div className="flex items-start justify-between gap-4 py-2">
    <div>
      <label htmlFor={id} className="text-sm font-medium text-zinc-900">
        {label}
      </label>
      {description ? <p className="mt-0.5 text-xs text-zinc-500">{description}</p> : null}
    </div>
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative mt-0.5 inline-flex h-5 w-9 shrink-0 rounded-full transition-colors',
        checked ? 'bg-accent' : 'bg-zinc-300',
      )}>
      <span
        className={cn(
          'absolute top-0.5 size-4 rounded-full bg-white transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0.5',
        )}
      />
    </button>
  </div>
);

export const Stat = ({ label, value, testId }: { label: string; value: ReactNode; testId?: string }) => (
  <div>
    <div className="text-2xs uppercase tracking-wide text-zinc-500">{label}</div>
    <div className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-900" data-testid={testId}>
      {value}
    </div>
  </div>
);
