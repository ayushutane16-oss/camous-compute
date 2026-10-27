// ============================================================
// cn utility — Tailwind class merging
// ============================================================
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateTime(isoString: string): string {
  return `${formatDate(isoString)}, ${formatTime(isoString)}`;
}

export function timeUntil(isoString: string): string {
  const diff = new Date(isoString).getTime() - Date.now();
  if (diff < 0) return 'Departed';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m away`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m away` : `${hrs}h away`;
}
