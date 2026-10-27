'use client';
import { cn } from '@/lib/utils';
import React from 'react';

// ---- Button ----
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({
  className, variant = 'primary', size = 'md', loading, icon, iconRight, children, disabled, ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50';
  const variants = {
    primary: 'gradient-emerald text-white hover:opacity-90 active:scale-[0.98] emerald-glow-sm',
    secondary: 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700',
    outline: 'border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10',
    ghost: 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}

// ---- Card ----
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-zinc-900 border border-zinc-800',
    glass: 'glass',
    bordered: 'bg-zinc-900/50 border border-zinc-700/50',
  };
  return (
    <div className={cn('rounded-2xl', variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

// ---- Badge ----
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'zinc' | 'amber' | 'red' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = 'emerald', size = 'sm', className, dot }: BadgeProps) {
  const variants = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    zinc: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border border-red-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  };
  const sizes = { sm: 'text-[10px] px-2 py-0.5', md: 'text-xs px-2.5 py-1' };
  return (
    <span className={cn('inline-flex items-center gap-1 font-medium rounded-full', variants[variant], sizes[size], className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

// ---- Input ----
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Input({ className, label, error, icon, iconRight, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-zinc-400">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">{icon}</span>}
        <input
          id={inputId}
          className={cn(
            'w-full bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 text-sm placeholder:text-zinc-600',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50',
            'transition-all duration-200',
            icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5',
            iconRight ? 'pr-10' : '',
            error && 'border-red-500/50 focus:ring-red-500/30',
            className
          )}
          {...props}
        />
        {iconRight && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">{iconRight}</span>}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ---- Select ----
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}

export function Select({ className, label, error, options, icon, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-zinc-400">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 z-10 pointer-events-none">{icon}</span>}
        <select
          id={selectId}
          className={cn(
            'w-full bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50',
            'transition-all duration-200 appearance-none cursor-pointer',
            icon ? 'pl-10 pr-8 py-2.5' : 'px-4 py-2.5 pr-8',
            error && 'border-red-500/50',
            className
          )}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 8L1 3h10L6 8z" />
          </svg>
        </span>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ---- Avatar ----
export function Avatar({ name, size = 'md', className }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className={cn('rounded-full gradient-emerald flex items-center justify-center text-white font-bold flex-shrink-0', sizes[size], className)}>
      {initials}
    </div>
  );
}

// ---- Divider ----
export function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-zinc-800" />
      {label && <span className="text-xs text-zinc-600 font-medium">{label}</span>}
      <div className="flex-1 h-px bg-zinc-800" />
    </div>
  );
}

// ---- Stars ----
export function StarRating({ rating, max = 5, size = 14 }: { rating: number; max?: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < Math.round(rating) ? '#10b981' : '#3f3f46'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="text-xs text-zinc-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}
