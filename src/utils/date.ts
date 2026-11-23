import { differenceInCalendarDays, format } from 'date-fns';

/** Fixed "today" so the sample data always reads consistently in the prototype. */
export const TODAY_ISO = '2026-10-18';

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getToday(): Date {
  return parseISODate(TODAY_ISO);
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDate(iso: string, pattern = 'MMM d, yyyy'): string {
  return format(parseISODate(iso), pattern);
}

export function daysUntil(iso: string): number {
  return differenceInCalendarDays(parseISODate(iso), getToday());
}

export function relativeDayLabel(iso: string): string {
  const d = daysUntil(iso);
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  if (d === -1) return 'Yesterday';
  if (d > 1) return `In ${d} days`;
  return `${Math.abs(d)} days ago`;
}

export function formatTime(time: string): string {
  if (!time) return 'All day';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}